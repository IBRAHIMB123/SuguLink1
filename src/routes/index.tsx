import { createFileRoute } from "@tanstack/react-router";
import { SuguLinkApp } from "@/sugulink/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SuguLink — Marché agricole connecté du Mali" },
      { name: "description", content: "SuguLink relie producteurs, commerçants, transporteurs et acheteurs agricoles au Mali." },
      { property: "og:title", content: "SuguLink — Marché agricole connecté" },
      { property: "og:description", content: "Producteurs, commerçants, transporteurs et acheteurs réunis sur une seule application." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SuguLinkApp,
});
