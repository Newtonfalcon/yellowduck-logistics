/**
 * generateTrackingNumber
 * ─────────────────────────────────────────────────────────
 * Produces a human-readable, sortable Yellowduck tracking ID.
 *
 * Format:  YDK-INTL-XXXXXX
 *          YDK   = Yellowduck
 *          INTL  = International (future: DOMX for domestic)
 *          XXXXX = 6-digit zero-padded random number
 *
 * These IDs are:
 *   • Customer-facing (shown in emails, SMS, receipts)
 *   • Operationally searchable (dispatchers query by ID)
 *   • Support-referenceable (short enough to read over the phone)
 *
 * NOTE: In production, tracking numbers should be generated
 * server-side or via a Firestore transaction to guarantee
 * global uniqueness across concurrent writes. This client-side
 * version is sufficient for prototyping and low-volume MVP use.
 */

/**
 * @param {"INTL" | "DOMX" | "FRET"} [serviceCode="INTL"]
 * @returns {string}  e.g. "YDK-INTL-084291"
 */
export function generateTrackingNumber(serviceCode = "INTL") {
  const validCodes = ["INTL", "DOMX", "FRET"];
  const code = validCodes.includes(serviceCode) ? serviceCode : "INTL";

  // 6-digit zero-padded integer in range [100000, 999999]
  const numeric = Math.floor(100000 + Math.random() * 900000);

  return `YDK-${code}-${numeric}`;
}