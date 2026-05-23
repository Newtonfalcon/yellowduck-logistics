export function calculateChargeableWeight({
  actualWeight,
  volumetricWeight
}) {
  return Math.max(
    actualWeight,
    volumetricWeight
  );
}