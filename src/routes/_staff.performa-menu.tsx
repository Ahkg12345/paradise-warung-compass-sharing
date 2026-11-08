import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_staff/performa-menu")({
  beforeLoad: ({ context }) => {
    if (context.staff?.role !== "admin") throw redirect({ to: "/akses-ditolak" });
  },
  component: () => null,
  head: () => ({ meta: [{ title: "Performa Menu | Kedai Paradise" }, { name: "description", content: "Performa menu Kedai Paradise." }, { property: "og:title", content: "Performa Menu | Kedai Paradise" }, { property: "og:description", content: "Performa menu Kedai Paradise." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
});