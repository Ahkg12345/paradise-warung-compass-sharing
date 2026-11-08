import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_staff/akun")({
  component: () => null,
  head: () => ({ meta: [{ title: "Akun | Kedai Paradise" }, { name: "description", content: "Akun staf Kedai Paradise." }, { property: "og:title", content: "Akun | Kedai Paradise" }, { property: "og:description", content: "Akun staf Kedai Paradise." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
});