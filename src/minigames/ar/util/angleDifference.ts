export function angleDifference(a: number, b: number) {
  let diff = Math.abs(a - b);

  if (diff > 180) {
    diff = 360 - diff;
  }

  return diff;
}
