export const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000;

export function hasSessionExpiredFromInactivity(lastActivityAt: number, now: number): boolean {
  return now - lastActivityAt >= SESSION_IDLE_TIMEOUT_MS;
}
