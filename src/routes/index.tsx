import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, TrendingUp, Heart, Camera } from "lucide-react";
import { getPhotoStats, listPhotos } from "@/lib/photos.functions";
import { PhotoCard } from "@/components/PhotoCard";
import { UploadForm } from "@/components/UploadForm";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import heroCat from "@/assets/hero-cat.jpg";

const statsQueryOptions = queryOptions({
  queryKey: ["photos", "stats"],
  queryFn: () => getPhotoStats(),
});

const recentPhotosQueryOptions = queryOptions({
  queryKey: ["photos", "recent"],
  queryFn: () => listPhotos(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "miaw.ovh — cat photos that build value" },
      { name: "description", content: "Upload your cat photos and watch them grow a playful financial value on miaw.ovh." },
      { property: "og:title", content: "miaw.ovh — cat photos that build value" },
      { property: "og:description", content: "Upload your cat photos and watch them grow a playful financial value on miaw.ovh." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(statsQueryOptions);
    await context.queryClient.ensureQueryData(recentPhotosQueryOptions);
  },


  component: HomePage,
});

function HomePage() {
  const { data: stats } = useSuspenseQuery(statsQueryOptions);
  const { data: photos } = useSuspenseQuery(recentPhotosQueryOptions);
  const recent = photos.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Hero text */}
        <div className="flex flex-col justify-between rounded-3xl bg-primary p-6 text-primary-foreground md:col-span-2 lg:col-span-3 lg:row-span-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-medium">
              <TrendingUp className="h-3 w-3" />
              The cat economy is booming
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Where cat photos become valuable assets.
            </h1>
            <p className="mt-4 max-w-xl text-lg opacity-90">
              Upload your cat, watch the market react, and build a purr-folio everyone wants to pet.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="rounded-full bg-primary-foreground font-display font-semibold text-primary hover:bg-primary-foreground/90">
              <Link to="/upload">
                Upload a cat <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/invest">Invest in cats</Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-full text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/gallery">Browse gallery</Link>
            </Button>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative overflow-hidden rounded-3xl bg-secondary p-2 md:col-span-2 lg:col-span-1 lg:row-span-2">
          <img
            src={heroCat}
            alt="A happy cat surrounded by coins and growth arrows"
            className="h-full w-full rounded-2xl object-cover"
            width={1024}
            height={1024}
          />
        </div>

        {/* Upload card */}
        <div className="rounded-3xl bg-card p-6 shadow-cute md:col-span-2 lg:col-span-2">
          <h2 className="font-display text-xl font-semibold text-card-foreground">Mint a cat asset</h2>
          <p className="mt-1 text-sm text-muted-foreground">Every upload gets an initial market value.</p>
          <div className="mt-4">
            <UploadForm />
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col justify-between rounded-3xl bg-accent p-6 text-accent-foreground lg:col-span-2">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="font-display text-3xl font-bold">{stats.totalPhotos}</p>
              <p className="text-xs opacity-80">Cat assets</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold">{stats.totalLikes}</p>
              <p className="text-xs opacity-80">Likes</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold">${stats.totalValue.toFixed(2)}</p>
              <p className="text-xs opacity-80">Market cap</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm opacity-80">
            <Camera className="h-4 w-4" />
            <span>Values update as people like photos.</span>
          </div>
        </div>

        {/* Newsletter */}
        <div className="rounded-3xl bg-secondary p-6 md:col-span-2 lg:col-span-2">
          <h2 className="font-display text-xl font-semibold text-secondary-foreground">
            <Heart className="inline h-5 w-5 text-primary" fill="currentColor" /> Cat market news
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Get weekly updates on top cats and new features.</p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>

        {/* Recent gallery preview */}
        <div className="rounded-3xl bg-card p-6 shadow-cute md:col-span-2 lg:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-card-foreground">Freshly minted cats</h2>
            <Button asChild variant="ghost" className="rounded-full text-primary hover:text-primary/80">
              <Link to="/gallery">View all</Link>
            </Button>
          </div>
          {recent.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-muted p-8 text-center text-muted-foreground">
              No cats yet. Be the first to upload one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
