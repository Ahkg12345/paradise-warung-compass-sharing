export const LOGIN_FAILURE_LIMIT = 5;
export const LOGIN_LOCK_WINDOW_MS = 15 * 60 * 1000;

export function getLoginLockSeconds(attemptTimestamps: readonly string[], nowMs: number): number {
  const recent = attemptTimestamps
    .map((timestamp) => Date.parse(timestamp))
    .filter(
      (timestamp) =>
        Number.isFinite(timestamp) &&
        timestamp <= nowMs &&
        timestamp >= nowMs - LOGIN_LOCK_WINDOW_MS,
    )
    .sort((left, right) => right - left);

  if (recent.length < LOGIN_FAILURE_LIMIT) return 0;

  const unlockAt = recent[LOGIN_FAILURE_LIMIT - 1];
  if (unlockAt === undefined) return 0;
  return Math.max(0, Math.ceil((unlockAt + LOGIN_LOCK_WINDOW_MS - nowMs) / 1000));
}
