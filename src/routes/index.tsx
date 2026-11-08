import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
  component: () => null,
  head: () => ({
    meta: [
      { title: "Kedai Paradise" },
      { name: "description", content: "Sistem Kasir & Rekap Keuangan Kedai Paradise." },
      { property: "og:title", content: "Kedai Paradise" },
      { property: "og:description", content: "Sistem Kasir & Rekap Keuangan Kedai Paradise." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
