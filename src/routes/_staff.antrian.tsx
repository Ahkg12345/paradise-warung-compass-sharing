import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_staff/antrian")({
  component: () => null,
  head: () => ({ meta: [{ title: "Antrian | Kedai Paradise" }, { name: "description", content: "Antrian pesanan Kedai Paradise." }, { property: "og:title", content: "Antrian | Kedai Paradise" }, { property: "og:description", content: "Antrian pesanan Kedai Paradise." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
});