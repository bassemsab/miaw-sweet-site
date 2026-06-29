import { Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground">
          <PawPrint className="h-6 w-6 text-primary" />
          <span className="text-gradient">miaw.ovh</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link
            to="/"
            activeProps={{ className: "text-primary font-semibold" }}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/gallery"
            activeProps={{ className: "text-primary font-semibold" }}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Gallery
          </Link>
          <Link
            to="/upload"
            activeProps={{ className: "text-primary font-semibold" }}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Upload
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
