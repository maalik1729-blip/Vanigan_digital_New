import { createFileRoute } from "@tanstack/react-router";
import { LoadingPage } from "@/components/LoadingPage";

export const Route = createFileRoute("/loading")({
  head: () => ({
    meta: [
      { title: "Loading · Tamil Nadu Vanigargalin Sangamam" },
      { name: "description", content: "Loading the traders portal..." },
    ],
  }),
  component: LoadingPage,
});
