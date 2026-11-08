import { describe, expect, it } from "vitest";

import { getLoginLockSeconds } from "@/lib/login-lockout";

describe("login lockout timing", () => {
  const now = Date.parse("2026-11-07T10:05:00.000Z");

  it("locks after five failures within 15 minutes and returns the remaining time", () => {
    const attempts = [
      "2026-11-07T10:00:00.000Z",
      "2026-11-07T10:01:00.000Z",
      "2026-11-07T10:02:00.000Z",
      "2026-11-07T10:03:00.000Z",
      "2026-11-07T10:04:00.000Z",
    ];

    expect(getLoginLockSeconds(attempts.slice(0, 4), now)).toBe(0);
    expect(getLoginLockSeconds(attempts, now)).toBe(600);
  });
});
