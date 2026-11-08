import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_staff/kasir")({
  component: () => null,
  head: () => ({ meta: [{ title: "Kasir | Kedai Paradise" }, { name: "description", content: "Kasir Kedai Paradise." }, { property: "og:title", content: "Kasir | Kedai Paradise" }, { property: "og:description", content: "Kasir Kedai Paradise." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
});