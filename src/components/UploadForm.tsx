import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Upload, Loader2 } from "lucide-react";
import { getSignedUploadUrl, createPhotoRecord } from "@/lib/photos.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const getUploadUrl = useServerFn(getSignedUploadUrl);
  const createRecord = useServerFn(createPhotoRecord);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setStatus("uploading");
    setMessage("");

    try {
      const { path, signedUrl } = await getUploadUrl({ data: { filename: file.name } });
      const uploadRes = await fetch(signedUrl, { method: "PUT", body: file });
      if (!uploadRes.ok) throw new Error("Upload failed");

      await createRecord({ data: { path, caption: caption.trim() } });
      setStatus("done");
      setFile(null);
      setCaption("");
      setMessage("Your cat is now a valuable asset! 🐱");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-dashed border-border bg-muted p-6 text-center transition-colors hover:border-primary">
        <input
          id="cat-photo"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <label htmlFor="cat-photo" className="flex cursor-pointer flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {file ? file.name : "Drop a cat photo or click to browse"}
          </span>
        </label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="caption" className="font-display text-sm">
          Caption (optional)
        </Label>
        <Textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Describe the asset..."
          maxLength={200}
          className="rounded-xl"
        />
      </div>

      <Button
        type="submit"
        disabled={!file || status === "uploading"}
        className="gradient-cute rounded-full font-display font-semibold text-primary-foreground"
      >
        {status === "uploading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload & mint value"
        )}
      </Button>

      {message && (
        <p className={status === "error" ? "text-sm text-destructive" : "text-sm text-primary"}>{message}</p>
      )}
    </form>
  );
}
