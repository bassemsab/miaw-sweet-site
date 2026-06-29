import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listPhotos } from "@/lib/photos.functions";
import { PhotoCard } from "@/components/PhotoCard";
import { TrendingUp, Wallet } from "lucide-react";

const photosQueryOptions = queryOptions({
  queryKey: ["photos", "invest"],
  queryFn: () => listPhotos(),
});

export const Route = createFileRoute("/invest")({
  head: () => ({
    meta: [
      { title: "Invest — miaw.ovh" },
      { name: "description", content: "Concept-only marketplace for investing in cat photo shares on miaw.ovh." },
      { property: "og:title", content: "Invest — miaw.ovh" },
      { property: "og:description", content: "Concept-only marketplace for investing in cat photo shares on miaw.ovh." },
      { property: "og:url", content: "/invest" },
    ],
    links: [{ rel: "canonical", href: "/invest" }],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(photosQueryOptions);
  },
  component: InvestPage,
});

function InvestPage() {
  const { data: photos } = useSuspenseQuery(photosQueryOptions);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-8 rounded-3xl bg-card p-6 shadow-cute md:p-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 font-display text-3xl font-bold text-card-foreground md:text-4xl">
              <TrendingUp className="h-8 w-8 text-primary" />
              Cat stock market
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Buy concept shares in cat photos. Every like drives the value up, and you can build a purr-folio.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-accent-foreground">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium">Demo mode — no real payments</span>
          </div>
        </div>
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-card p-12 text-center shadow-cute">
          <TrendingUp className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 font-display text-xl font-semibold text-card-foreground">The market is closed for meows</h2>
          <p className="mt-2 text-muted-foreground">Upload a cat to list the first asset.</p>
        </div>
      )}
    </div>
  );
}
