import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_staff/riwayat")({
  component: () => null,
  head: () => ({ meta: [{ title: "Riwayat | Kedai Paradise" }, { name: "description", content: "Riwayat pesanan Kedai Paradise." }, { property: "og:title", content: "Riwayat | Kedai Paradise" }, { property: "og:description", content: "Riwayat pesanan Kedai Paradise." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
});