import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_staff/menu")({
  beforeLoad: ({ context }) => {
    if (context.staff?.role !== "admin") throw redirect({ to: "/akses-ditolak" });
  },
  component: () => null,
  head: () => ({ meta: [{ title: "Menu | Kedai Paradise" }, { name: "description", content: "Manajemen menu Kedai Paradise." }, { property: "og:title", content: "Menu | Kedai Paradise" }, { property: "og:description", content: "Manajemen menu Kedai Paradise." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
});