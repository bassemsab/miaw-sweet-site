import { createFileRoute } from "@tanstack/react-router";
import { UploadForm } from "@/components/UploadForm";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload — miaw.ovh" },
      { name: "description", content: "Upload a cat photo to miaw.ovh and watch it grow a playful financial value." },
      { property: "og:title", content: "Upload — miaw.ovh" },
      { property: "og:description", content: "Upload a cat photo to miaw.ovh and watch it grow a playful financial value." },
      { property: "og:url", content: "/upload" },
    ],
    links: [{ rel: "canonical", href: "/upload" }],
  }),
  component: UploadPage,
});

function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <Button asChild variant="ghost" className="mb-4 rounded-full text-muted-foreground hover:text-foreground">
        <Link to="/gallery">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to gallery
        </Link>
      </Button>

      <div className="rounded-3xl bg-card p-6 shadow-cute md:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold text-card-foreground">Mint your cat asset</h1>
          <p className="mt-2 text-muted-foreground">
            Upload a photo and we'll assign it an initial market value. The more likes it gets, the more it grows.
          </p>
        </div>

        <UploadForm />
      </div>
    </div>
  );
}
