import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_staff/dasbor")({
  beforeLoad: ({ context }) => {
    if (!context.staff) throw redirect({ to: "/login" });
  },
  component: () => null,
  head: () => ({ meta: [{ title: "Dasbor | Kedai Paradise" }, { name: "description", content: "Dasbor Kedai Paradise." }, { property: "og:title", content: "Dasbor | Kedai Paradise" }, { property: "og:description", content: "Dasbor Kedai Paradise." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
});