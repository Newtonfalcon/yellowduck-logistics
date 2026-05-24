/**
 * services/shipment.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Complete Firestore service layer for Yellowduck shipment operations.
 *
 * Firestore Data Model:
 *   /shipments/{shipmentId}                  ← shipment document
 *   /shipments/{shipmentId}/events/{eventId} ← immutable event log
 *
 * All functions exported:
 *   createShipment()         — write new shipment doc
 *   createShipmentEvent()    — append immutable status event
 *   getShipment()            — fetch single shipment by Firestore doc ID
 *   getShipments()           — paginated list, filterable by status
 *   updateShipmentStatus()   — update currentStatus + updatedAt atomically
 */

import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";

// ─── Constants ─────────────────────────────────────────────────────────────────
const COLLECTION = "shipments";

// ─────────────────────────────────────────────────────────────────────────────
// createShipment
// Creates a new shipment document and returns the Firestore DocumentReference.
// The caller is responsible for immediately following up with createShipmentEvent
// to write the initial LABEL_CREATED audit event.
//
// @param  {Object} data  — fully assembled shipment payload
// @returns {Promise<DocumentReference>}
// ─────────────────────────────────────────────────────────────────────────────
export async function createShipment(data) {
  return await addDoc(
    collection(db, COLLECTION),
    {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// createShipmentEvent
// Appends an IMMUTABLE event to /shipments/{shipmentId}/events.
// Never edit events — only append. This is your audit trail and legal record.
//
// @param  {{ shipmentId, status, location, description, author? }} params
// @returns {Promise<void>}
// ─────────────────────────────────────────────────────────────────────────────
export async function createShipmentEvent({
  shipmentId,
  status,
  location,
  description,
  author = "System",
}) {
  const eventRef = collection(
    db,
    COLLECTION,
    shipmentId,
    "events"
  );

  await addDoc(eventRef, {
    status,
    location,
    description,
    author,
    timestamp: serverTimestamp(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// getShipment
// Fetches a single shipment document by its Firestore document ID.
// Returns the full shipment object with `id` injected, or null if not found.
//
// Usage:
//   const shipment = await getShipment("abc123");
//   if (!shipment) return notFound();
//
// @param  {string} shipmentId  — Firestore document ID
// @returns {Promise<Object|null>}
// ─────────────────────────────────────────────────────────────────────────────
export async function getShipment(shipmentId) {
  if (!shipmentId) return null;

  const ref  = doc(db, COLLECTION, shipmentId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// getShipments
// Returns a paginated, optionally filtered list of shipments.
//
// Options:
//   statusFilter  — one of the SHIPMENT_STATUS values, or null for all
//   pageSize      — number of results per page (default 20)
//   lastDoc       — the last DocumentSnapshot from the previous page,
//                   pass null/undefined for the first page
//
// Returns:
//   { shipments: Array, lastDoc: DocumentSnapshot|null, hasMore: boolean }
//
// Pagination pattern (cursor-based — correct for Firestore):
//   Page 1:  const { shipments, lastDoc } = await getShipments({});
//   Page 2:  const { shipments } = await getShipments({ lastDoc });
//
// Required Firestore composite index:
//   Collection: shipments
//   Fields:     currentStatus ASC, createdAt DESC
//   (Create in Firebase Console → Firestore → Indexes)
//
// @param  {{ statusFilter?, pageSize?, lastDoc? }} opts
// @returns {Promise<{ shipments: Object[], lastDoc: any, hasMore: boolean }>}
// ─────────────────────────────────────────────────────────────────────────────
export async function getShipments({
  statusFilter = null,
  pageSize     = 20,
  lastDoc      = null,
} = {}) {
  const ref = collection(db, COLLECTION);

  // Build query constraints progressively — avoids undefined in array
  const constraints = [];

  if (statusFilter) {
    constraints.push(where("currentStatus", "==", statusFilter));
  }

  constraints.push(orderBy("createdAt", "desc"));
  constraints.push(limit(pageSize + 1)); // fetch one extra to detect hasMore

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const q    = query(ref, ...constraints);
  const snap = await getDocs(q);

  const hasMore   = snap.docs.length > pageSize;
  const docs      = hasMore ? snap.docs.slice(0, pageSize) : snap.docs;
  const lastSnap  = docs.length > 0 ? docs[docs.length - 1] : null;

  const shipments = docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return {
    shipments,
    lastDoc: lastSnap,   // pass this back as `lastDoc` for the next page
    hasMore,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// getUserShipments
// Returns shipments scoped to a user by `customerId` or by authenticated sender email.
// This enables each user to only see their own shipment workflow in the dashboard.
//
// @param  {{ userId?, userEmail?, statusFilter?, pageSize?, lastDoc? }} opts
// @returns {Promise<{ shipments: Object[], lastDoc: any, hasMore: boolean }>}
export async function getUserShipments({
  userId       = null,
  userEmail    = null,
  statusFilter = null,
  pageSize     = 20,
  lastDoc      = null,
} = {}) {
  if (!userId && !userEmail) {
    throw new Error("getUserShipments requires a userId or userEmail");
  }

  const ref = collection(db, COLLECTION);

  const buildConstraints = (fieldName, fieldValue) => {
    const constraints = [];

    if (fieldName && fieldValue) {
      constraints.push(where(fieldName, "==", fieldValue));
    }

    if (statusFilter) {
      constraints.push(where("currentStatus", "==", statusFilter));
    }

    constraints.push(orderBy("createdAt", "desc"));
    constraints.push(limit(pageSize + 1));

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    return constraints;
  };

  let snap;

  if (userId) {
    snap = await getDocs(query(ref, ...buildConstraints("customerId", userId)));

    if (snap.docs.length === 0 && userEmail) {
      snap = await getDocs(query(ref, ...buildConstraints("sender.email", userEmail)));
    }
  } else {
    snap = await getDocs(query(ref, ...buildConstraints("sender.email", userEmail)));
  }

  const hasMore = snap.docs.length > pageSize;
  const docs = hasMore ? snap.docs.slice(0, pageSize) : snap.docs;
  const lastSnap = docs.length > 0 ? docs[docs.length - 1] : null;

  const shipments = docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return {
    shipments,
    lastDoc: lastSnap,
    hasMore,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// updateShipmentStatus
// Atomically updates `currentStatus` and `updatedAt` on a shipment document.
// Does NOT write an event — callers must call createShipmentEvent separately
// so that the event is always authored and described correctly.
//
// Pattern enforced by this separation:
//   await updateShipmentStatus({ shipmentId, status: "IN_TRANSIT" });
//   await createShipmentEvent({ shipmentId, status: "IN_TRANSIT", ... });
//
// Why keep them separate?
//   updateShipmentStatus is a fast document field write.
//   createShipmentEvent is an immutable sub-collection append.
//   Bundling them would hide the event authorship from callers.
//
// @param  {{ shipmentId: string, status: string, extraFields?: Object }} params
// @returns {Promise<void>}
// ─────────────────────────────────────────────────────────────────────────────
export async function updateShipmentStatus({
  shipmentId,
  status,
  extraFields = {},
}) {
  if (!shipmentId) throw new Error("updateShipmentStatus: shipmentId is required");
  if (!status)     throw new Error("updateShipmentStatus: status is required");

  const ref = doc(db, COLLECTION, shipmentId);

  await updateDoc(ref, {
    currentStatus: status,
    updatedAt:     serverTimestamp(),
    ...extraFields,        // allows callers to co-update e.g. assignedFacility
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// getShipmentEvents
// Returns all events for a shipment from its sub-collection,
// ordered by timestamp ascending (oldest first = correct timeline order).
//
// Required Firestore index:
//   Collection group: events
//   Field:            timestamp ASC
//
// @param  {string} shipmentId
// @returns {Promise<Object[]>}
// ─────────────────────────────────────────────────────────────────────────────
export async function getShipmentEvents(shipmentId) {
  if (!shipmentId) return [];

  const ref  = collection(db, COLLECTION, shipmentId, "events");
  const q    = query(ref, orderBy("timestamp", "asc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}