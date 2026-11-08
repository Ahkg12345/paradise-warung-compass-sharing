import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_staff/pengguna")({
  beforeLoad: ({ context }) => {
    if (context.staff?.role !== "admin") throw redirect({ to: "/akses-ditolak" });
  },
  component: () => null,
  head: () => ({ meta: [{ title: "Pengguna | Kedai Paradise" }, { name: "description", content: "Pengguna Kedai Paradise." }, { property: "og:title", content: "Pengguna | Kedai Paradise" }, { property: "og:description", content: "Pengguna Kedai Paradise." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
});