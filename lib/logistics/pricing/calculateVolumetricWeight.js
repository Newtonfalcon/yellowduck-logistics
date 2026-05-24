/**
 * calculateVolumetricWeight
 * ─────────────────────────────────────────────────────────
 * Computes the volumetric (dimensional) weight of a package.
 *
 * Standard industry formula:
 *   Volumetric Weight (kg) = (L × W × H) / Divisor
 *
 * Divisors by carrier/mode:
 *   Air freight (IATA standard): 6,000 cm³/kg
 *   Courier / express (DHL, FedEx, UPS): 5,000 cm³/kg  ← we use this
 *   Road / ground freight: 3,000 cm³/kg
 *
 * All major express carriers (DHL, FedEx, UPS, Aramex) use 5,000.
 * This is the Yellowduck default for international express.
 *
 * WHY THIS EXISTS:
 * A large, lightweight box (e.g. pillows, foam) occupies aircraft
 * cargo space disproportionate to its actual weight. Carriers charge
 * based on whichever is greater: actual weight or volumetric weight.
 * Without volumetric pricing, couriers would lose money on bulky
 * lightweight freight.
 */

/** cm³ per kg — industry-standard courier divisor */
const DIVISOR_COURIER = 5000;

/** cm³ per kg — IATA air freight divisor */
const DIVISOR_AIR_FREIGHT = 6000;

/**
 * @param {{ lengthCm: number, widthCm: number, heightCm: number, mode?: "courier" | "air" }} params
 * @returns {number} Volumetric weight in kg, rounded to 2 decimal places
 */
export function calculateVolumetricWeight({
  lengthCm,
  widthCm,
  heightCm,
  mode = "courier",
}) {
  if (
    typeof lengthCm !== "number" || lengthCm <= 0 ||
    typeof widthCm  !== "number" || widthCm  <= 0 ||
    typeof heightCm !== "number" || heightCm <= 0
  ) {
    return 0;
  }

  const divisor = mode === "air" ? DIVISOR_AIR_FREIGHT : DIVISOR_COURIER;
  const raw = (lengthCm * widthCm * heightCm) / divisor;

  return Math.round(raw * 100) / 100;
}