/**
 * estimateRate
 * ─────────────────────────────────────────────────────────
 * Produces a price estimate for a shipment based on:
 *   • Chargeable weight (MAX of actual vs volumetric)
 *   • Service tier (EXPRESS / STANDARD / ECONOMY)
 *   • Origin → destination region pair
 *
 * IMPORTANT: These are placeholder rates for UI/MVP purposes.
 * In production, rates must come from a carrier rate-card API
 * (DHL Rate Finder, FedEx Rate API, etc.) or a negotiated
 * zone-based rate table stored in your database.
 *
 * Structure:
 *   Base rate (per-shipment) + Per-kg rate × chargeableWeight
 *   + fuel surcharge (%) + estimated duties (flat)
 */

/** Rate cards: [baseUSD, perKgUSD] */
const RATES = {
  EXPRESS:  { base: 35.00, perKg: 12.50, etaDays: "2–3",   fuelPct: 0.06 },
  STANDARD: { base: 18.00, perKg:  6.00, etaDays: "5–7",   fuelPct: 0.05 },
  ECONOMY:  { base:  9.00, perKg:  2.80, etaDays: "10–14", fuelPct: 0.04 },
};

const DUTY_ESTIMATES = {
  US: 0.035,  // 3.5% of declared value
  GB: 0.040,
  EU: 0.045,
  AE: 0.050,
  NG: 0.075,
  DEFAULT: 0.05,
};

/**
 * @param {{
 *   chargeableWeight: number,
 *   serviceCode: "EXPRESS" | "STANDARD" | "ECONOMY",
 *   declaredValueUSD: number,
 *   destinationCountryCode: string,
 * }} params
 * @returns {{
 *   freightUSD: number,
 *   fuelSurchargeUSD: number,
 *   estimatedDutiesUSD: number,
 *   totalUSD: number,
 *   etaDays: string,
 *   breakdown: Array<{ label: string, amount: number }>
 * }}
 */
export function estimateRate({
  chargeableWeight,
  serviceCode = "EXPRESS",
  declaredValueUSD = 0,
  destinationCountryCode = "",
}) {
  const rate = RATES[serviceCode] ?? RATES["EXPRESS"];
  const dutyRate = DUTY_ESTIMATES[destinationCountryCode.toUpperCase()] ?? DUTY_ESTIMATES.DEFAULT;

  const freightUSD        = Math.round((rate.base + rate.perKg * chargeableWeight) * 100) / 100;
  const fuelSurchargeUSD  = Math.round(freightUSD * rate.fuelPct * 100) / 100;
  const estimatedDutiesUSD = Math.round(declaredValueUSD * dutyRate * 100) / 100;
  const totalUSD           = Math.round((freightUSD + fuelSurchargeUSD + estimatedDutiesUSD) * 100) / 100;

  return {
    freightUSD,
    fuelSurchargeUSD,
    estimatedDutiesUSD,
    totalUSD,
    etaDays: rate.etaDays,
    breakdown: [
      { label: `${serviceCode} Freight (${chargeableWeight} kg)`, amount: freightUSD },
      { label: "Fuel Surcharge",    amount: fuelSurchargeUSD },
      { label: `Est. Duties (${destinationCountryCode || "—"})`, amount: estimatedDutiesUSD },
    ],
  };
}