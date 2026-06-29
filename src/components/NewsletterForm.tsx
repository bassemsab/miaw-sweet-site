import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Loader2 } from "lucide-react";
import { subscribeNewsletter } from "@/lib/newsletter.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const subscribe = useServerFn(subscribeNewsletter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const result = await subscribe({ data: { email } });
      setStatus("success");
      setEmail("");
      setMessage(result.message);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not subscribe");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="newsletter-email" className="font-display text-sm">
          Email address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-full pl-10"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-foreground font-display font-semibold text-background hover:bg-foreground/90"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          "Join the newsletter"
        )}
      </Button>
      {message && (
        <p className={status === "error" ? "text-sm text-destructive" : "text-sm text-primary"}>{message}</p>
      )}
    </form>
  );
}
