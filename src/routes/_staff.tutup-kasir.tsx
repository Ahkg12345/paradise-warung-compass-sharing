import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_staff/tutup-kasir")({
  component: () => null,
  head: () => ({ meta: [{ title: "Tutup Kasir | Kedai Paradise" }, { name: "description", content: "Tutup kasir Kedai Paradise." }, { property: "og:title", content: "Tutup Kasir | Kedai Paradise" }, { property: "og:description", content: "Tutup kasir Kedai Paradise." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
});