/**
 * calculateChargeableWeight
 * ─────────────────────────────────────────────────────────
 * Returns the weight carriers use to compute freight charges.
 *
 * Formula:
 *   Chargeable Weight = MAX(actualWeight, volumetricWeight)
 *
 * This is the single most important formula in courier pricing.
 *
 * Examples:
 *   • Actual: 2 kg / Volumetric: 5 kg → Chargeable: 5 kg (bulky box)
 *   • Actual: 8 kg / Volumetric: 3 kg → Chargeable: 8 kg (dense parcel)
 *   • Actual: 4 kg / Volumetric: 4 kg → Chargeable: 4 kg (perfect cube)
 *
 * Without applying this, your pricing engine undercharges on large,
 * lightweight shipments and loses revenue per package.
 */

/**
 * @param {{ actualWeight: number, volumetricWeight: number }} params
 * @returns {{ chargeableWeight: number, basis: "actual" | "volumetric" | "equal" }}
 */
export function calculateChargeableWeight({ actualWeight, volumetricWeight }) {
  if (typeof actualWeight !== "number" || actualWeight < 0) actualWeight = 0;
  if (typeof volumetricWeight !== "number" || volumetricWeight < 0) volumetricWeight = 0;

  const chargeableWeight = Math.max(actualWeight, volumetricWeight);

  let basis;
  if (actualWeight > volumetricWeight)   basis = "actual";
  else if (volumetricWeight > actualWeight) basis = "volumetric";
  else                                   basis = "equal";

  return { chargeableWeight, basis };
}