import { Outlet, useRouteContext } from "@tanstack/react-router";

import { Header } from "@/components/layout/header";

export function StaffLayout() {
  const { staff } = useRouteContext({ from: "/_staff" });

  if (!staff) return null;

  return (
    <>
      <Header {...staff} />
      <main className="staff-placeholder">
        <Outlet />
      </main>
    </>
  );
}
