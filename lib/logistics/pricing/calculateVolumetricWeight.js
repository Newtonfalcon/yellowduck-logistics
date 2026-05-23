// Air freight divisor
const AIR_DIVISOR = 5000;

export function calculateVolumetricWeight({
  lengthCm,
  widthCm,
  heightCm
}) {
  return (
    (lengthCm * widthCm * heightCm) /
    AIR_DIVISOR
  );
}