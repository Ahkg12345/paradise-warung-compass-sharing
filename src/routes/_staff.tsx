import { createFileRoute, redirect } from "@tanstack/react-router";

import { StaffLayout } from "@/components/layout/staff-layout";
import { getStaffAccess } from "@/lib/access.functions";

export const Route = createFileRoute("/_staff")({
  beforeLoad: async ({ location }) => {
    let staff;
    try {
      staff = await getStaffAccess();
    } catch (error) {
      if (error instanceof Error && /unauthorized/i.test(error.message)) {
        throw redirect({ to: "/login", search: { redirect: location.href } });
      }
      throw error;
    }
    if (!staff) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
    return { staff };
  },
  component: StaffLayout,
});
