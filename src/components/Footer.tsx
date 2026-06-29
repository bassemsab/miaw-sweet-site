import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-muted/50 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} miaw.ovh — made with{" "}
          <Heart className="inline h-4 w-4 text-secondary" fill="currentColor" /> for cats everywhere.
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <a href="mailto:hello@miaw.ovh" className="hover:text-foreground">
            Contact
          </a>
          <span>·</span>
          <span>No real cats were taxed in this project.</span>
        </div>
      </div>
    </footer>
  );
}
