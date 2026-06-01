export function signedAngleDifference(
  current: number,
  target: number,
): number {
  let diff = target - current;

  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;

  return diff;
}
