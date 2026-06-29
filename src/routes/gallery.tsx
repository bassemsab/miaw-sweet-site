import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listPhotos } from "@/lib/photos.functions";
import { PhotoCard } from "@/components/PhotoCard";
import { TrendingUp } from "lucide-react";

const photosQueryOptions = queryOptions({
  queryKey: ["photos", "all"],
  queryFn: () => listPhotos(),
});

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — miaw.ovh" },
      { name: "description", content: "Browse the growing collection of cat photos building financial value on miaw.ovh." },
      { property: "og:title", content: "Gallery — miaw.ovh" },
      { property: "og:description", content: "Browse the growing collection of cat photos building financial value on miaw.ovh." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(photosQueryOptions);
  },
  component: GalleryPage,
});

function GalleryPage() {
  const { data: photos } = useSuspenseQuery(photosQueryOptions);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          The cat marketplace
        </h1>
        <p className="mt-2 text-muted-foreground">
          Every photo is a tiny asset. Like the ones you love to increase their value.
        </p>
      </div>

      {photos.length > 0 ? (
        <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
          {photos.map((photo) => (
            <div key={photo.id} className="break-inside-avoid">
              <PhotoCard photo={photo} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-card p-12 text-center shadow-cute">
          <TrendingUp className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 font-display text-xl font-semibold text-card-foreground">The market is empty</h2>
          <p className="mt-2 text-muted-foreground">Upload the first cat photo to start the economy.</p>
        </div>
      )}
    </div>
  );
}
