"use client";

/**
 * app/admin/users/page.js — Admin User Management
 * ─────────────────────────────────────────────────
 * Full CRUD user management interface:
 *  - Fetches all users from Firestore /users collection
 *  - Toggle isAuthorized / isAdmin per user with optimistic UI updates
 *  - Delete user document with confirmation modal
 *  - Search/filter by name or email
 *  - Responsive table with mobile card fallback
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import {
  getAllUsers,
  updateUserPermissions,
  deleteUserDocument,
} from "@/services/user.service";
import {
  Users, Search, RefreshCw, Shield, CheckCircle2,
  XCircle, Trash2, AlertTriangle, ChevronRight,
  Loader2, Filter, UserCheck, UserX, Crown,
} from "lucide-react";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-[#E2E8F0] rounded-lg ${className}`} />;
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled, color = "amber" }) {
  const colors = {
    amber:  { on: "bg-[#FFB800]",  knob: "bg-white" },
    purple: { on: "bg-purple-500", knob: "bg-white" },
  };
  const c = colors[color] ?? colors.amber;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`
        relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB800]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${checked ? c.on : "bg-[#CBD5E1]"}
      `}
    >
      <span
        className={`
          inline-block h-3.5 w-3.5 rounded-full ${c.knob} shadow transition-transform duration-200
          ${checked ? "translate-x-4.5" : "translate-x-0.5"}
        `}
      />
    </button>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
function DeleteModal({ user, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] w-full max-w-md p-6 z-10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#0F172A]">Delete user?</h3>
            <p className="mt-1.5 text-sm text-[#64748B] leading-relaxed">
              This will permanently delete{" "}
              <strong className="text-[#0F172A]">{user.displayName || user.email}</strong>'s
              Firestore profile. Their Firebase Auth record will remain — contact
              your Firebase console to fully purge the authentication account.
            </p>
            <p className="mt-2 text-xs text-red-600 font-medium">This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC] transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            {loading ? "Deleting…" : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── User Row (desktop table) ─────────────────────────────────────────────────
function UserRow({ user, onToggle, onDelete, updating }) {
  const initials = (user.displayName || user.email || "?")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isUpdating = updating === user.id;

  return (
    <tr className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors group">
      {/* User info */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FFB800] flex items-center justify-center text-[#0F172A] text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#0F172A] truncate">
              {user.displayName || "—"}
            </p>
            <p className="text-xs text-[#64748B] truncate">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Account type */}
      <td className="px-5 py-4 hidden sm:table-cell">
        <span className="text-xs text-[#64748B] capitalize">
          {user.accountType || "personal"}
        </span>
      </td>

      {/* isAuthorized toggle */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          {isUpdating ? (
            <Loader2 size={14} className="animate-spin text-[#94A3B8]" />
          ) : (
            <Toggle
              checked={user.isAuthorized === true}
              onChange={() => onToggle(user.id, "isAuthorized", !user.isAuthorized)}
              disabled={isUpdating}
              color="amber"
            />
          )}
          <span className={`text-xs font-medium hidden lg:block ${user.isAuthorized ? "text-green-600" : "text-[#94A3B8]"}`}>
            {user.isAuthorized ? "Authorized" : "Pending"}
          </span>
        </div>
      </td>

      {/* isAdmin toggle */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          {isUpdating ? (
            <Loader2 size={14} className="animate-spin text-[#94A3B8]" />
          ) : (
            <Toggle
              checked={user.isAdmin === true}
              onChange={() => onToggle(user.id, "isAdmin", !user.isAdmin)}
              disabled={isUpdating}
              color="purple"
            />
          )}
          <span className={`text-xs font-medium hidden lg:block ${user.isAdmin ? "text-purple-600" : "text-[#94A3B8]"}`}>
            {user.isAdmin ? "Admin" : "User"}
          </span>
        </div>
      </td>

      {/* Joined */}
      <td className="px-5 py-4 hidden md:table-cell">
        <p className="text-xs text-[#94A3B8]">
          {user.createdAt
            ? (typeof user.createdAt.toDate === "function"
                ? user.createdAt.toDate()
                : new Date(user.createdAt)
              ).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "—"}
        </p>
      </td>

      {/* Delete */}
      <td className="px-5 py-4">
        <button
          onClick={() => onDelete(user)}
          className="p-1.5 rounded-lg text-[#CBD5E1] hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
          title="Delete user"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}

// ─── User Card (mobile) ───────────────────────────────────────────────────────
function UserCard({ user, onToggle, onDelete, updating }) {
  const isUpdating = updating === user.id;
  const initials = (user.displayName || user.email || "?")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFB800] flex items-center justify-center text-[#0F172A] text-sm font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#0F172A] truncate">{user.displayName || "—"}</p>
            <p className="text-xs text-[#64748B] truncate">{user.email}</p>
            <p className="text-[11px] text-[#94A3B8] capitalize mt-0.5">{user.accountType || "personal"}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(user)}
          className="p-1.5 rounded-lg text-[#CBD5E1] hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex items-center gap-4 pt-1 border-t border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          {isUpdating ? (
            <Loader2 size={13} className="animate-spin text-[#94A3B8]" />
          ) : (
            <Toggle
              checked={user.isAuthorized === true}
              onChange={() => onToggle(user.id, "isAuthorized", !user.isAuthorized)}
              disabled={isUpdating}
              color="amber"
            />
          )}
          <span className="text-xs text-[#64748B]">Authorized</span>
        </div>
        <div className="flex items-center gap-2">
          {isUpdating ? (
            <Loader2 size={13} className="animate-spin text-[#94A3B8]" />
          ) : (
            <Toggle
              checked={user.isAdmin === true}
              onChange={() => onToggle(user.id, "isAdmin", !user.isAdmin)}
              disabled={isUpdating}
              color="purple"
            />
          )}
          <span className="text-xs text-[#64748B]">Admin</span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("all"); // all | authorized | pending | admin
  const [updating,   setUpdating]   = useState(null);  // uid of row being updated
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toastMsg,   setToastMsg]   = useState("");

  // ── Fetch ────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { users: data } = await getAllUsers({ pageSize: 200 });
      setUsers(data);
    } catch (err) {
      setError(err?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Toast helper ──────────────────────────────────────────────────────────
  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  }

  // ── Toggle permission ─────────────────────────────────────────────────────
  const handleToggle = useCallback(async (uid, field, value) => {
    setUpdating(uid);
    // Optimistic update
    setUsers((prev) =>
      prev.map((u) => (u.id === uid ? { ...u, [field]: value } : u))
    );
    try {
      await updateUserPermissions(uid, { [field]: value });
      showToast(`${field === "isAdmin" ? "Admin role" : "Authorization"} ${value ? "granted" : "revoked"}.`);
    } catch (err) {
      // Rollback
      setUsers((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, [field]: !value } : u))
      );
      showToast("Update failed. Please try again.");
    } finally {
      setUpdating(null);
    }
  }, []);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteUserDocument(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      showToast(`User "${deleteTarget.displayName || deleteTarget.email}" deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      showToast("Delete failed: " + (err?.message || "Unknown error"));
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteTarget]);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = users;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.email?.toLowerCase().includes(q) ||
          u.displayName?.toLowerCase().includes(q) ||
          u.firstName?.toLowerCase().includes(q) ||
          u.lastName?.toLowerCase().includes(q)
      );
    }
    if (filter === "authorized")  list = list.filter((u) => u.isAuthorized);
    if (filter === "pending")     list = list.filter((u) => !u.isAuthorized);
    if (filter === "admin")       list = list.filter((u) => u.isAdmin);
    return list;
  }, [users, search, filter]);

  const counts = useMemo(() => ({
    all:        users.length,
    authorized: users.filter((u) => u.isAuthorized).length,
    pending:    users.filter((u) => !u.isAuthorized).length,
    admin:      users.filter((u) => u.isAdmin).length,
  }), [users]);

  const FILTER_TABS = [
    { key: "all",        label: "All",        count: counts.all        },
    { key: "authorized", label: "Authorized", count: counts.authorized },
    { key: "pending",    label: "Pending",    count: counts.pending    },
    { key: "admin",      label: "Admin",      count: counts.admin      },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isAdmin />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title="User Management" subtitle="Authorization and role control" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
                <Users size={20} className="text-[#FFB800]" />
                All Users
              </h2>
              <p className="text-sm text-[#64748B] mt-0.5">
                {counts.all} registered · {counts.pending} pending authorization
              </p>
            </div>
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#64748B] bg-white hover:bg-[#F8FAFC] transition-colors disabled:opacity-60 self-start sm:self-auto"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* ── Error ──────────────────────────────────────────── */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
              <XCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ── Search + Filter Bar ─────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm bg-white focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-xl p-1 overflow-x-auto flex-shrink-0">
              {FILTER_TABS.map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
                    ${filter === key
                      ? "bg-[#FFB800] text-[#0F172A] shadow-sm"
                      : "text-[#64748B] hover:text-[#0F172A]"
                    }
                  `}
                >
                  {label}
                  <span className={`text-[10px] font-bold ${filter === key ? "text-[#0F172A]/60" : "text-[#CBD5E1]"}`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Legend ─────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-4 text-xs text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[#FFB800]" />
              Authorized toggle — grants dashboard access
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-purple-500" />
              Admin toggle — grants /admin route access
            </div>
          </div>

          {/* ── Desktop Table ───────────────────────────────────── */}
          <div className="hidden sm:block bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-[#64748B]">
                {search ? `No users match "${search}".` : "No users found."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                    <tr>
                      {["User", "Type", "Authorized", "Admin", "Joined", ""].map((h) => (
                        <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        onToggle={handleToggle}
                        onDelete={setDeleteTarget}
                        updating={updating}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Mobile Cards ────────────────────────────────────── */}
          <div className="sm:hidden space-y-3">
            {loading ? (
              [...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center text-sm text-[#64748B]">No users found.</div>
            ) : (
              filtered.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onToggle={handleToggle}
                  onDelete={setDeleteTarget}
                  updating={updating}
                />
              ))
            )}
          </div>

          {/* ── Pagination hint ─────────────────────────────────── */}
          {!loading && filtered.length > 0 && (
            <p className="text-xs text-[#94A3B8] text-center pb-2">
              Showing {filtered.length} of {counts.all} users
            </p>
          )}
        </main>
      </div>

      {/* ── Delete Modal ────────────────────────────────────────── */}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {/* ── Toast ───────────────────────────────────────────────── */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 size={15} className="text-[#FFB800]" />
          {toastMsg}
        </div>
      )}
    </div>
  );
}