import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Moon, Sun, Plus, ScrollText, Map as MapIcon, Heart } from "lucide-react";
import type { Campaign } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

function D20Icon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <path d="M16 3 L28 10 V22 L16 29 L4 22 V10 Z" />
      <path d="M16 3 L16 29" />
      <path d="M4 10 L16 16 L28 10" />
      <path d="M4 22 L16 16 L28 22" />
    </svg>
  );
}

export function Sidebar({
  theme,
  onToggleTheme,
}: {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  const [location] = useLocation();
  const { data: campaigns } = useQuery<Campaign[]>({ queryKey: ["/api/campaigns"] });

  return (
    <aside className="hidden md:flex w-60 flex-col bg-sidebar border-r border-sidebar-border shrink-0">
      {/* Brand */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <D20Icon className="text-primary" />
          <span className="font-serif text-base font-bold text-sidebar-foreground">
            D&D Companion
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-3 space-y-3">
          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm no-underline transition-colors ${
              location === "/"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Dashboard
          </Link>

          <div className="pt-2">
            <div className="px-3 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Campaigns
            </div>
            <div className="space-y-0.5">
              {campaigns?.length === 0 && (
                <p className="px-3 py-1.5 text-xs text-muted-foreground/60">
                  No campaigns yet
                </p>
              )}
              {campaigns?.map((c) => (
                <Link
                  key={c.id}
                  href={`/campaigns/${c.id}`}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm no-underline transition-colors ${
                    location === `/campaigns/${c.id}`
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <ScrollText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </ScrollArea>

      {/* Ko-fi support link */}
      <div className="px-3 pt-3">
        <a href="https://ko-fi.com/thewarhammerwarroom" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm no-underline text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors" data-testid="link-kofi">
          <Heart className="w-4 h-4" />
          Support on Ko-fi
        </a>
      </div>

      {/* Theme toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground"
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4 mr-2" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 mr-2" />
              Dark Mode
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
