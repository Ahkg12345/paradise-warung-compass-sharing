import { createFileRoute, Link } from "@tanstack/react-router";

import { id } from "@/lib/i18n/id";

export const Route = createFileRoute("/akses-ditolak")({
  component: () => (
    <main className="access-denied">
      <p>{id.accessDenied}</p>
      <Link to="/dasbor">{id.notFound.home}</Link>
    </main>
  ),
  head: () => ({ meta: [{ title: "Akses Ditolak | Kedai Paradise" }, { name: "description", content: "Akses Kedai Paradise." }, { property: "og:title", content: "Akses Ditolak | Kedai Paradise" }, { property: "og:description", content: "Akses Kedai Paradise." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
});