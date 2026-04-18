"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "YTM Hub", icon: Music2, href: "/ytm" },
  { label: "Sovereign Cinema", icon: Film, href: "/cinema" },
  { label: "Research Lab", icon: FlaskConical, href: "/research" },
];

function LogoMark() {
  return (
    <div className="pointer-events-none flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/20">
      <Zap size={14} className="text-violet-400" />
    </div>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [open]);

  return (
    <>
      {/* z-50 mobile chrome — matches layout audit; pointer-through when drawer is open so backdrop receives taps */}
      <header
        className={
          open
            ? "pointer-events-none fixed left-0 right-0 top-0 z-50 flex h-[60px] items-center justify-between border-b border-white/10 bg-zinc-950/95 px-4 backdrop-blur-md md:hidden"
            : "fixed left-0 right-0 top-0 z-50 flex h-[60px] items-center justify-between border-b border-white/10 bg-zinc-950/95 px-4 backdrop-blur-md md:hidden"
        }
      >
        <div className="pointer-events-none flex items-center gap-2.5">
          <LogoMark />
          <span className="text-sm font-semibold tracking-tight text-zinc-100">Spirit OS</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className={
            open
              ? "pointer-events-none relative flex h-11 w-11 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 opacity-50"
              : "pointer-events-auto relative flex h-11 w-11 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 active:bg-white/10"
          }
        >
          <Menu size={18} className="pointer-events-none" aria-hidden />
        </button>
      </header>

      {/* Do not mount drawer/backdrop until client — avoids Framer hydration mismatch locking the screen */}
      {mounted && (
        <>
          <motion.div
            aria-hidden={!open}
            className={`fixed inset-0 z-40 touch-manipulation bg-black/60 backdrop-blur-sm md:hidden ${open ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}`}
            animate={
              open
                ? { opacity: 1, display: "block" }
                : { opacity: 0, display: "none" }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              willChange: "transform, opacity",
            }}
            onClick={() => setOpen(false)}
          />

          <motion.nav
            aria-hidden={!open}
            className="fixed bottom-0 left-0 top-0 z-50 flex w-72 flex-col border-r border-white/10 bg-zinc-950 md:hidden"
            animate={
              open
                ? { opacity: 1, display: "flex", x: 0 }
                : { opacity: 0, display: "none", x: "-100%" }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              pointerEvents: open ? "auto" : "none",
              willChange: "transform, opacity",
            }}
          >
            <div className="flex h-[60px] flex-shrink-0 items-center justify-between border-b border-white/10 px-4">
              <div className="flex items-center gap-2.5">
                <LogoMark />
                <span className="text-sm font-semibold tracking-tight text-zinc-100">Spirit OS</span>
              </div>
              <button
                type="button"
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
          </motion.nav>
        </>
      )}
    </>
  );
}

function DesktopSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 220 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 hidden h-screen flex-shrink-0 self-start overflow-hidden border-r border-white/10 bg-zinc-950/80 backdrop-blur-md md:flex md:flex-col"
    >
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-white/10 px-4 py-5">
        <LogoMark />
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap text-sm font-semibold tracking-tight text-zinc-100"
            >
              Spirit OS
            </motion.span>
          )}
        </AnimatePresence>
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
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
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
        onClick={() => setCollapsed((c) => !c)}
        className="relative z-10 mx-3 mb-4 flex h-11 w-11 flex-shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
      >
        {collapsed ? (
          <ChevronRight size={16} className="pointer-events-none" aria-hidden />
        ) : (
          <ChevronLeft size={16} className="pointer-events-none" aria-hidden />
        )}
      </button>
    </motion.aside>
  );
}

export function Navigation() {
  return (
    <>
      <MobileNav />
      <DesktopSidebar />
    </>
  );
}
