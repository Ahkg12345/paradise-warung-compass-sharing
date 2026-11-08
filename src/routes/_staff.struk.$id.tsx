import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_staff/struk/$id")({
  component: () => null,
  head: () => ({ meta: [{ title: "Struk | Kedai Paradise" }, { name: "description", content: "Struk transaksi Kedai Paradise." }, { property: "og:title", content: "Struk | Kedai Paradise" }, { property: "og:description", content: "Struk transaksi Kedai Paradise." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
});