import { describe, expect, it } from "vitest";

import { hasSessionExpiredFromInactivity, SESSION_IDLE_TIMEOUT_MS } from "@/lib/session-timeout";

describe("session inactivity timeout", () => {
  it("expires a session at 30 minutes without activity", () => {
    expect(hasSessionExpiredFromInactivity(1_000, 1_000 + SESSION_IDLE_TIMEOUT_MS - 1)).toBe(false);
    expect(hasSessionExpiredFromInactivity(1_000, 1_000 + SESSION_IDLE_TIMEOUT_MS)).toBe(true);
  });
});
