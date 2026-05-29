/**
 * services/user.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firestore service layer for user management operations.
 *
 * NOTE ON USER DELETION:
 *   The Firebase client SDK can only delete Firestore *documents*.
 *   Deleting a Firebase Auth account (the authentication record) requires
 *   either: (a) the Firebase Admin SDK (server-side), or (b) the user
 *   deleting their own account via user.delete().
 *
 *   This service deletes the /users/{uid} Firestore document. The Firebase
 *   Auth record is left intact but the user will be blocked by AuthorizationGate
 *   since their profile no longer exists (isAuthorized will be false by default).
 *
 *   For production: add a Next.js API route /api/admin/delete-user that uses
 *   the Firebase Admin SDK to fully purge the Auth account.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const USERS_COL = "users";

// ─────────────────────────────────────────────────────────────────────────────
// getAllUsers
// Returns all users from /users, ordered by createdAt desc, with pagination.
// ─────────────────────────────────────────────────────────────────────────────
export async function getAllUsers({ pageSize = 50, lastDoc = null } = {}) {
  const ref = collection(db, USERS_COL);
  const constraints = [orderBy("createdAt", "desc"), limit(pageSize + 1)];
  if (lastDoc) constraints.push(startAfter(lastDoc));

  const q    = query(ref, ...constraints);
  const snap = await getDocs(q);

  const hasMore  = snap.docs.length > pageSize;
  const docs     = hasMore ? snap.docs.slice(0, pageSize) : snap.docs;
  const lastSnap = docs.length > 0 ? docs[docs.length - 1] : null;

  return {
    users: docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: lastSnap,
    hasMore,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// getUsersCount
// Returns total user count from /users collection.
// ─────────────────────────────────────────────────────────────────────────────
export async function getUsersCount() {
  const snap = await getCountFromServer(collection(db, USERS_COL));
  return snap.data().count;
}

// ─────────────────────────────────────────────────────────────────────────────
// getUserById
// Fetches a single user document by their uid.
// ─────────────────────────────────────────────────────────────────────────────
export async function getUserById(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, USERS_COL, uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// ─────────────────────────────────────────────────────────────────────────────
// updateUserPermissions
// Toggles isAuthorized and/or isAdmin on a user document.
// Only the fields passed in the `fields` object are updated.
// ─────────────────────────────────────────────────────────────────────────────
export async function updateUserPermissions(uid, fields) {
  if (!uid) throw new Error("updateUserPermissions: uid is required");
  const allowed = {};
  if (typeof fields.isAuthorized === "boolean") allowed.isAuthorized = fields.isAuthorized;
  if (typeof fields.isAdmin      === "boolean") allowed.isAdmin      = fields.isAdmin;
  if (Object.keys(allowed).length === 0) return;

  await updateDoc(doc(db, USERS_COL, uid), {
    ...allowed,
    updatedAt: serverTimestamp(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// deleteUserDocument
// Deletes the Firestore /users/{uid} document.
// See service-level note above regarding Auth record deletion.
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteUserDocument(uid) {
  if (!uid) throw new Error("deleteUserDocument: uid is required");
  await deleteDoc(doc(db, USERS_COL, uid));
}

// ─────────────────────────────────────────────────────────────────────────────
// updateUserProfile
// Updates the current user's own profile fields.
// Only whitelisted fields are allowed to prevent privilege escalation.
// ─────────────────────────────────────────────────────────────────────────────
export async function updateUserProfile(uid, fields) {
  if (!uid) throw new Error("updateUserProfile: uid is required");

  // Whitelist — users cannot self-assign admin/authorized
  const ALLOWED_FIELDS = [
    "displayName", "firstName", "lastName",
    "phone", "company", "bio", "avatarUrl",
  ];

  const safe = {};
  for (const key of ALLOWED_FIELDS) {
    if (fields[key] !== undefined) safe[key] = fields[key];
  }

  if (Object.keys(safe).length === 0) return;

  await updateDoc(doc(db, USERS_COL, uid), {
    ...safe,
    // Keep displayName in sync with firstName + lastName if both provided
    ...(safe.firstName && safe.lastName
      ? { displayName: `${safe.firstName} ${safe.lastName}`.trim() }
      : {}),
    updatedAt: serverTimestamp(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// updateNotificationPreferences
// Saves the user's notification preference flags.
// ─────────────────────────────────────────────────────────────────────────────
export async function updateNotificationPreferences(uid, prefs) {
  if (!uid) throw new Error("updateNotificationPreferences: uid required");
  await updateDoc(doc(db, USERS_COL, uid), {
    notificationPrefs: prefs,
    updatedAt: serverTimestamp(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// getAdminDashboardStats
// Returns aggregate counts for the admin overview dashboard.
// Runs parallel queries to minimise latency.
// ─────────────────────────────────────────────────────────────────────────────
export async function getAdminDashboardStats() {
  const shipmentsCol = collection(db, "shipments");
  const usersCol     = collection(db, USERS_COL);

  const [
    totalUsers,
    totalShipments,
    inTransit,
    delivered,
    exceptions,
    customsHolds,
    pendingAuth,
  ] = await Promise.all([
    getCountFromServer(usersCol).then((s) => s.data().count),
    getCountFromServer(shipmentsCol).then((s) => s.data().count),
    getCountFromServer(query(shipmentsCol, where("currentStatus", "==", "IN_TRANSIT"))).then((s) => s.data().count),
    getCountFromServer(query(shipmentsCol, where("currentStatus", "==", "DELIVERED"))).then((s) => s.data().count),
    getCountFromServer(query(shipmentsCol, where("currentStatus", "==", "EXCEPTION"))).then((s) => s.data().count),
    getCountFromServer(query(shipmentsCol, where("currentStatus", "==", "CUSTOMS_CLEARANCE"))).then((s) => s.data().count),
    getCountFromServer(query(usersCol, where("isAuthorized", "==", false))).then((s) => s.data().count),
  ]);

  return {
    totalUsers,
    totalShipments,
    inTransit,
    delivered,
    exceptions,
    customsHolds,
    pendingAuth,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// getRecentShipmentsAdmin
// Returns the most recent N shipments for the admin dashboard feed.
// ─────────────────────────────────────────────────────────────────────────────
export async function getRecentShipmentsAdmin({ pageSize = 10 } = {}) {
  const ref = collection(db, "shipments");
  const q   = query(ref, orderBy("createdAt", "desc"), limit(pageSize));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}