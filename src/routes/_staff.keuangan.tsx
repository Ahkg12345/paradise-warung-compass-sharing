import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_staff/keuangan")({
  beforeLoad: ({ context }) => {
    if (context.staff?.role !== "admin") throw redirect({ to: "/akses-ditolak" });
  },
  component: () => null,
  head: () => ({ meta: [{ title: "Keuangan | Kedai Paradise" }, { name: "description", content: "Keuangan Kedai Paradise." }, { property: "og:title", content: "Keuangan | Kedai Paradise" }, { property: "og:description", content: "Keuangan Kedai Paradise." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
});