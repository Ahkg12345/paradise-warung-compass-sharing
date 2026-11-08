import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_staff/laporan")({
  beforeLoad: ({ context }) => {
    if (context.staff?.role !== "admin") throw redirect({ to: "/akses-ditolak" });
  },
  component: () => null,
  head: () => ({ meta: [{ title: "Laporan | Kedai Paradise" }, { name: "description", content: "Laporan Kedai Paradise." }, { property: "og:title", content: "Laporan | Kedai Paradise" }, { property: "og:description", content: "Laporan Kedai Paradise." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
});