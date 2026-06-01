import { signedAngleDifference } from './signedAngleDifference';

export function closeEnough(
  playerHeading: number,
  targetHeading: number,
  distance: number,
  maxDistance = 15,
  maxAngle = 6,
): boolean {
  const angleDiff = Math.abs(
    signedAngleDifference(playerHeading, targetHeading),
  );

  const isInDistance = distance <= maxDistance;
  const isInAngle = angleDiff <= maxAngle;

  return isInDistance && isInAngle;
}
