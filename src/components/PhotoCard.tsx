import { useState } from "react";
import { Heart } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { likePhoto } from "@/lib/photos.functions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Photo {
  id: string;
  storage_path: string;
  caption: string | null;
  value: number;
  likes: number;
  created_at: string;
  signed_url: string;
}

export function PhotoCard({ photo, className }: { photo: Photo; className?: string }) {
  const [likes, setLikes] = useState(photo.likes ?? 0);
  const [value, setValue] = useState(photo.value ?? 0);
  const [isLiking, setIsLiking] = useState(false);
  const like = useServerFn(likePhoto);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const updated = await like({ data: { id: photo.id } });
      setLikes(updated.likes ?? 0);
      setValue(updated.value ?? 0);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className={cn("group overflow-hidden rounded-2xl border border-border bg-card shadow-cute transition-transform hover:-translate-y-1", className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {photo.signed_url ? (
          <img
            src={photo.signed_url}
            alt={photo.caption || "A cat photo on miaw.ovh"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-display font-semibold text-card-foreground">
              {photo.caption || "Untitled cat asset"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Value: <span className="font-medium text-primary">${value.toFixed(2)}</span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
            className="shrink-0 gap-1 rounded-full text-muted-foreground hover:text-secondary"
            aria-label="Like this cat photo"
          >
            <Heart className="h-4 w-4" fill={likes > 0 ? "currentColor" : "none"} />
            <span className="text-xs">{likes}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
