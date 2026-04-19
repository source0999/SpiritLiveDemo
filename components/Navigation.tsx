"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Music2,
  Film,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { useOverlayLock } from "@/components/OverlayLockContext";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "YTM Hub", icon: Music2, href: "/ytm" },
  { label: "Sovereign Cinema", icon: Film, href: "/cinema" },
  { label: "Research Lab", icon: FlaskConical, href: "/research" },
];

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function LogoMark() {
  return (
    <div className="pointer-events-none flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/20">
      <Zap size={14} className="text-violet-400" />
    </div>
  );
}

// Exported so AppShell can render this BEFORE the flex layout container,
// making the fixed overlays direct siblings of the layout div rather than
// descendants of it — eliminates any flex/stacking-context containment risk.
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { setNavDrawerOpen } = useOverlayLock();

  useEffect(() => {
    setNavDrawerOpen(open);
    return () => { setNavDrawerOpen(false); };
  }, [open, setNavDrawerOpen]);

  // Scroll-lock on html; does NOT create a new containing block for
  // position:fixed children the way body position:fixed does on iOS.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/*
        Header bar — backdrop-blur REMOVED.
        backdrop-filter on a fixed element forces WebKit into an off-screen
        render pass; under GPU memory pressure iOS simply drops the paint.
        Solid bg-zinc-950 is visually equivalent and always paints.
      */}
      <header className="fixed left-0 right-0 top-0 z-[99999] flex h-[60px] items-center justify-between border-b border-white/10 bg-zinc-950 px-4 md:hidden">
        <div className="pointer-events-none flex items-center gap-2.5">
          <LogoMark />
          <span className="text-sm font-semibold tracking-tight text-zinc-100">Spirit OS</span>
        </div>
        <button
          type="button"
          role="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className={cn(
            "relative flex h-11 w-11 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400",
            open ? "pointer-events-none opacity-50" : "pointer-events-auto active:bg-white/10",
          )}
        >
          <Menu size={18} className="pointer-events-none" aria-hidden />
        </button>
      </header>

      {/* Backdrop — no backdrop-blur; solid semi-opaque bg */}
      <div
        role="button"
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
        data-open={open}
        onClick={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(false);
          }
        }}
        className={cn(
          "fixed inset-0 z-[99997] touch-manipulation cursor-pointer bg-black/80 md:hidden",
          "transition-opacity duration-200 ease-out",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      />

      {/*
        Drawer — no backdrop-blur; h-[100dvh] instead of top-0/bottom-0 span.
        100dvh accounts for the iOS Safari URL bar collapsing/expanding, which
        causes 100vh to extend below the visible screen boundary.
      */}
      <nav
        data-open={open}
        aria-hidden={!open}
        className={cn(
          "fixed left-0 top-0 z-[99998] flex w-72 flex-col border-r border-white/10 bg-zinc-950 md:hidden",
          "h-[100dvh]",
          "transform-gpu transition-[opacity,transform] duration-200 ease-out",
          open ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-full pointer-events-none",
        )}
      >
        <div className="flex h-[60px] flex-shrink-0 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-sm font-semibold tracking-tight text-zinc-100">Spirit OS</span>
          </div>
          <button
            type="button"
            role="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="relative flex h-11 w-11 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 active:bg-white/10"
          >
            <X size={16} className="pointer-events-none" aria-hidden />
          </button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex cursor-pointer touch-manipulation items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
              >
                <Icon size={18} className="flex-shrink-0" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
        <div className="flex-shrink-0 border-t border-white/10 px-4 py-4">
          <p className="font-mono text-[10px] text-zinc-600">Source · Intuitive Wrld</p>
        </div>
      </nav>
    </>
  );
}

// Exported so AppShell can place this inside the flex layout row.
export function DesktopSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    // backdrop-blur-md REMOVED — replaced with solid bg-zinc-950.
    // h-[100dvh] instead of h-screen for correct height on iOS Safari.
    <aside
      style={{
        width: collapsed ? "72px" : "220px",
        transition: "width 200ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className="sticky top-0 hidden h-[100dvh] flex-shrink-0 self-start overflow-hidden border-r border-white/10 bg-zinc-950 md:flex md:flex-col"
    >
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-white/10 px-4 py-5">
        <LogoMark />
        <span
          className="whitespace-nowrap text-sm font-semibold tracking-tight text-zinc-100 overflow-hidden"
          style={{
            maxWidth: collapsed ? "0px" : "160px",
            opacity: collapsed ? 0 : 1,
            transition: "opacity 150ms ease-out, max-width 150ms ease-out",
          }}
        >
          Spirit OS
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="group relative flex cursor-pointer touch-manipulation items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
            >
              <Icon size={18} className="flex-shrink-0" />
              <span
                className="overflow-hidden whitespace-nowrap"
                style={{
                  maxWidth: collapsed ? "0px" : "160px",
                  opacity: collapsed ? 0 : 1,
                  transition: "opacity 150ms ease-out, max-width 150ms ease-out",
                }}
              >
                {item.label}
              </span>
              {collapsed && (
                <span className="pointer-events-none absolute left-14 z-50 whitespace-nowrap rounded-lg border border-white/10 bg-zinc-800 px-2 py-1 text-xs text-zinc-100 opacity-0 transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        role="button"
        onClick={() => setCollapsed((c) => !c)}
        className="relative z-10 mx-3 mb-4 flex h-11 w-11 flex-shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
      >
        {collapsed ? (
          <ChevronRight size={16} className="pointer-events-none" aria-hidden />
        ) : (
          <ChevronLeft size={16} className="pointer-events-none" aria-hidden />
        )}
      </button>
    </aside>
  );
}

// Kept for any existing imports; AppShell now uses the split exports directly.
export function Navigation() {
  return (
    <>
      <MobileNav />
      <DesktopSidebar />
    </>
  );
}
