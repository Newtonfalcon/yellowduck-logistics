"use client";

import { useState } from "react";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import {
  Users,
  Crown,
  Shield,
  User,
  Mail,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  X,
  Send,
} from "lucide-react";

// ─── Mock data ─────────────────────────────────────────────────────────────────
const MEMBERS = [
  { id: 1, name: "Chidi Okeke",   email: "chidi@example.com",   role: "Owner",  joined: "Jan 12, 2026", avatar: "CO" },
  { id: 2, name: "Amara Obi",     email: "amara@example.com",   role: "Admin",  joined: "Feb 3, 2026",  avatar: "AO" },
  { id: 3, name: "Marcus Webb",   email: "marcus@example.com",  role: "Member", joined: "Mar 18, 2026", avatar: "MW" },
  { id: 4, name: "Li Wei",        email: "liwei@example.com",   role: "Member", joined: "Apr 5, 2026",  avatar: "LW" },
  { id: 5, name: "Sarah Chen",    email: "sarah@example.com",   role: "Member", joined: "May 1, 2026",  avatar: "SC" },
];

const INVITATIONS = [
  { id: 1, email: "james@example.com",   role: "Member", sent: "May 20, 2026", expires: "Jun 3, 2026" },
  { id: 2, email: "fatima@example.com",  role: "Admin",  sent: "May 22, 2026", expires: "Jun 5, 2026" },
];

const ROLE_CONFIG = {
  Owner:  { icon: Crown, bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200" },
  Admin:  { icon: Shield, bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Member: { icon: User,   bg: "bg-slate-50",  text: "text-slate-600",  border: "border-slate-200" },
};

function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG["Member"];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold border px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <Icon size={10} />
      {role}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TeamsPage() {
  const [members, setMembers] = useState(MEMBERS);
  const [invitations, setInvitations] = useState(INVITATIONS);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [sent, setSent] = useState(false);

  const removeMember = (id) => setMembers((prev) => prev.filter((m) => m.id !== id));
  const cancelInvite = (id) => setInvitations((prev) => prev.filter((i) => i.id !== id));

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const newInvite = {
      id: Date.now(),
      email: inviteEmail.trim(),
      role: inviteRole,
      sent: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      expires: "—",
    };
    setInvitations((prev) => [newInvite, ...prev]);
    setInviteEmail("");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Team" subtitle="Manage members and invitations" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">Team Management</h2>
              <p className="text-sm text-[#64748B] mt-0.5">
                {members.length} member{members.length !== 1 ? "s" : ""} · {invitations.length} pending invitation{invitations.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Left: members + invitations */}
            <div className="xl:col-span-2 space-y-6">

              {/* Members */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center gap-2">
                  <Users size={14} className="text-[#64748B]" />
                  <h3 className="text-sm font-bold text-[#0F172A]">Members</h3>
                  <span className="ml-auto text-xs font-bold text-[#94A3B8]">{members.length}</span>
                </div>
                <div className="divide-y divide-[#F8FAFC]">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#F8FAFC] transition-colors group">
                      <div className="w-9 h-9 rounded-full bg-[#FFB800] flex items-center justify-center text-[#0F172A] text-xs font-bold flex-shrink-0">
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A] truncate">{member.name}</p>
                        <p className="text-xs text-[#64748B] truncate">{member.email}</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-[11px] text-[#94A3B8]">Joined {member.joined}</p>
                      </div>
                      <RoleBadge role={member.role} />
                      {member.role !== "Owner" && (
                        <button
                          onClick={() => removeMember(member.id)}
                          className="p-1.5 rounded-lg text-[#CBD5E1] hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove member"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Invitations */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center gap-2">
                  <Clock size={14} className="text-amber-500" />
                  <h3 className="text-sm font-bold text-[#0F172A]">Pending Invitations</h3>
                  {invitations.length > 0 && (
                    <span className="ml-auto text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      {invitations.length}
                    </span>
                  )}
                </div>
                {invitations.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-[#64748B]">No pending invitations.</div>
                ) : (
                  <div className="divide-y divide-[#F8FAFC]">
                    {invitations.map((inv) => (
                      <div key={inv.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#F8FAFC] group transition-colors">
                        <div className="w-9 h-9 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] flex-shrink-0">
                          <Mail size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0F172A] truncate">{inv.email}</p>
                          <p className="text-xs text-[#64748B]">Sent {inv.sent}</p>
                        </div>
                        <RoleBadge role={inv.role} />
                        <button
                          onClick={() => cancelInvite(inv.id)}
                          className="p-1.5 rounded-lg text-[#CBD5E1] hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          title="Cancel invitation"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Invite form */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
                <h3 className="text-sm font-bold text-[#0F172A] mb-1">Invite a Team Member</h3>
                <p className="text-xs text-[#64748B] mb-5">They'll receive an email with a link to join your team.</p>

                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">Email Address</label>
                    <input
                      type="email"
                      placeholder="colleague@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 transition-all placeholder:text-[#CBD5E1]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#FFB800] appearance-none"
                    >
                      <option value="Member">Member</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  {sent && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
                      <CheckCircle2 size={14} /> Invitation sent!
                    </div>
                  )}

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#FFB800] text-[#0F172A] text-sm font-bold hover:bg-[#F0AE00] active:scale-[0.98] transition-all"
                  >
                    <Send size={14} />
                    Send Invitation
                  </button>
                </form>
              </div>

              {/* Role explanations */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-[#0F172A]">Role Permissions</h3>
                {Object.entries(ROLE_CONFIG).map(([role, cfg]) => {
                  const Icon = cfg.icon;
                  const descriptions = {
                    Owner:  "Full access. Can manage billing, team, and all settings.",
                    Admin:  "Can create shipments, manage team members, and view all data.",
                    Member: "Can create and track their own shipments only.",
                  };
                  return (
                    <div key={role} className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                        <Icon size={13} className={cfg.text} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#0F172A]">{role}</p>
                        <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{descriptions[role]}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}