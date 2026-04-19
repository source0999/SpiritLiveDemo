"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useOverlayLock } from "@/components/OverlayLockContext";
import {
  Zap, Clock, AlertTriangle, Flame, Terminal,
  Cpu, HardDrive, GitBranch,
  ExternalLink, ChevronRight, Send, X, Command,
  FolderGit2, Circle, Thermometer, ShieldCheck, ShieldAlert,
} from "lucide-react";

// ─── Utility ──────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── BentoCard ────────────────────────────────────────────────────────────────
//
// iOS Framer Motion fix:
//   Previous `initial: { y: 16, scale: 0.98 }` caused WebKit to miscalculate
//   the element's bounding box before paint, collapsing height to zero.
//   New initial state: opacity fade only — no transform that touches geometry.
//   `transform-gpu` promotes to compositing layer so opacity animates on GPU
//   without triggering layout recalculation.
//
function BentoCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("col-span-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col", className)}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-500 mb-1">
      {children}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. ORACLE ORB
// ─────────────────────────────────────────────────────────────────────────────
function OracleOrb({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <BentoCard className="md:col-span-4 items-center justify-center gap-4 py-8">
      <Label>Spirit · AI Core</Label>

      <div className="relative flex items-center justify-center my-3 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute w-44 h-44 rounded-full bg-violet-500/20 transform-gpu"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="pointer-events-none absolute w-32 h-32 rounded-full bg-violet-500/25 transform-gpu"
        />
        <motion.button
          type="button"
          role="button"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          onClick={onOpenChat}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto relative z-10 flex h-20 w-20 cursor-pointer touch-manipulation items-center justify-center rounded-full border border-violet-400/30 bg-gradient-to-br from-violet-500 to-violet-900 shadow-xl shadow-violet-900/70 transform-gpu"
          aria-label="Open Command Bar"
        >
          <Zap size={28} className="pointer-events-none text-violet-200" aria-hidden />
        </motion.button>
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold tracking-tight text-zinc-200">Oracle Orb</p>
        <p className="text-xs text-zinc-500 mt-0.5">Listening · Idle</p>
      </div>

      <div className="pointer-events-none flex h-5 items-end gap-[3px] mt-1">
        {Array.from({ length: 22 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: ["3px", `${6 + ((i * 41 + 7) % 12)}px`, "3px"] }}
            transition={{ duration: 0.7 + (i % 5) * 0.11, repeat: Infinity, delay: i * 0.045, ease: "easeInOut" }}
            className="w-[3px] rounded-full bg-violet-500/55 transform-gpu"
          />
        ))}
      </div>

      <button
        type="button"
        role="button"
        onClick={onOpenChat}
        className="pointer-events-auto relative z-[9999] mt-3 flex w-full cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-xl border border-violet-500/25 bg-violet-500/10 py-2.5 text-xs font-semibold text-violet-300 transition-transform active:scale-[0.98]"
      >
        <Command size={12} className="pointer-events-none shrink-0" aria-hidden /> Open Command Bar
      </button>
    </BentoCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. BRIEFING HUB
// ─────────────────────────────────────────────────────────────────────────────
const BRIEFING = [
  { tag: "Local LLM", title: "Llama 3.3 Q4_K_M quant benchmarks on consumer DDR5 — context window throughput.",         time: "06:02" },
  { tag: "Homelab",   title: "PCIe x1 riser bottleneck: TTFT degradation on 24GB VRAM models vs x16 ribbon cables.",    time: "06:04" },
  { tag: "Privacy",   title: "CCPA Q3 enforcement: brokers ignoring opt-outs face record seven-figure penalties.",       time: "06:06" },
  { tag: "Energy",    title: "Southern CA ToU shift: super off-peak window narrows to 11 PM – 5 AM next billing.",      time: "06:08" },
];

function BriefingHub() {
  return (
    <BentoCard className="md:col-span-8">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="min-w-0">
          <Label>Intelligence Briefing · 06:00</Label>
          <h2 className="text-base font-semibold tracking-tight text-zinc-100">Daily Briefing Hub</h2>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 bg-white/5 border border-white/10 rounded-lg px-2 py-1 flex-shrink-0 whitespace-nowrap">
          Next: 03:00 AM
        </span>
      </div>
      <div className="space-y-2">
        {BRIEFING.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-lg px-2 py-0.5 mt-0.5 whitespace-nowrap flex-shrink-0">
              {item.tag}
            </span>
            <p className="text-xs text-zinc-300 flex-1 leading-snug min-w-0">{item.title}</p>
            <p className="text-[10px] text-zinc-600 whitespace-nowrap mt-0.5 flex-shrink-0 hidden sm:block">{item.time}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-zinc-600 mt-3 text-center">
        — SearXNG (local) · GPT-Researcher · No Google pings —
      </p>
    </BentoCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROJECT HUB
// ─────────────────────────────────────────────────────────────────────────────
const PROJECTS = [
  { name: "spirit-os-dashboard",  branch: "main",          completion: 38, todos: 14, lastCommit: "2h ago",  status: "active" as const },
  { name: "toxic-grader-agent",   branch: "feat/langfuse", completion: 61, todos: 6,  lastCommit: "5h ago",  status: "active" as const },
  { name: "cinema-engine-config", branch: "main",          completion: 82, todos: 2,  lastCommit: "1d ago",  status: "idle"   as const },
  { name: "ghost-node-setup",     branch: "dns-pihole",    completion: 20, todos: 9,  lastCommit: "3d ago",  status: "idle"   as const },
];

function ProjectHub() {
  return (
    <BentoCard className="md:col-span-7">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Label>Project Hub · Architecture 6</Label>
          <h2 className="text-base font-semibold tracking-tight text-zinc-100">Active Repositories</h2>
        </div>
        <FolderGit2 size={14} className="text-zinc-600 flex-shrink-0" />
      </div>
      <div className="space-y-2.5">
        {PROJECTS.map((proj, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group">
            <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", proj.status === "active" ? "bg-emerald-400" : "bg-zinc-600")} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-xs font-mono font-medium text-zinc-200 truncate">{proj.name}</p>
                <span className="hidden sm:flex text-[10px] text-zinc-600 items-center gap-1 flex-shrink-0">
                  <GitBranch size={9} />{proj.branch}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${proj.completion}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.08, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full transform-gpu",
                      proj.completion >= 70 ? "bg-emerald-500/70" :
                      proj.completion >= 40 ? "bg-violet-500/70" : "bg-amber-500/60"
                    )}
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 w-8 text-right flex-shrink-0">{proj.completion}%</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0 hidden md:block">
              <p className="text-[10px] text-zinc-600">{proj.todos} TODOs</p>
              <p className="text-[10px] text-zinc-600">{proj.lastCommit}</p>
            </div>
            <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[10px] font-semibold">
              <ExternalLink size={10} /> IDE
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
        <Circle size={10} className="text-zinc-600 flex-shrink-0" />
        <p className="text-[11px] text-zinc-500 truncate">Spirit scans TODOs vs README · auto-computes completion %</p>
        <button className="flex items-center gap-1 text-[10px] text-violet-400 flex-shrink-0 font-semibold ml-auto">
          <ChevronRight size={12} /> All
        </button>
      </div>
    </BentoCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. LOCAL DRIVE HEALTH — actual hardware only
// ─────────────────────────────────────────────────────────────────────────────
type SmartStatus = "Healthy" | "Warning" | "Unknown";
interface Drive { label: string; type: "SSD" | "HDD"; total: number; used: number; temp: number; smart: SmartStatus; }

const DRIVES: { node: string; drives: Drive[] }[] = [
  {
    node: "spiritdesktop · Node 1",
    drives: [
      { label: "250GB SSD", type: "SSD", total: 250,  used: 147, temp: 38, smart: "Healthy" },
      { label: "1TB HDD",   type: "HDD", total: 1000, used: 412, temp: 34, smart: "Healthy" },
      { label: "2TB HDD",   type: "HDD", total: 2000, used: 880, temp: 36, smart: "Healthy" },
    ],
  },
  {
    node: "spirit (Dell) · Node 2",
    drives: [
      { label: "Dell SSD",  type: "SSD", total: 512,  used: 198, temp: 41, smart: "Healthy" },
    ],
  },
];

function SmartBadge({ status }: { status: SmartStatus }) {
  if (status === "Healthy") return <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400"><ShieldCheck size={10} /> Healthy</span>;
  if (status === "Warning")  return <span className="flex items-center gap-1 text-[10px] font-medium text-amber-400"><ShieldAlert size={10} /> Warning</span>;
  return <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-500"><ShieldAlert size={10} /> Unknown</span>;
}

function DriveHealthWidget() {
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)} TB` : `${n} GB`;

  return (
    <BentoCard className="md:col-span-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Label>Local Drive Health</Label>
          <h2 className="text-base font-semibold tracking-tight text-zinc-100">Storage</h2>
        </div>
        <HardDrive size={14} className="text-zinc-600 flex-shrink-0" />
      </div>
      <div className="space-y-5">
        {DRIVES.map((section) => (
          <div key={section.node}>
            <p className="text-[10px] font-mono font-semibold text-violet-400 mb-2.5">{section.node}</p>
            <div className="space-y-3">
              {section.drives.map((drive, di) => {
                const pct = Math.round((drive.used / drive.total) * 100);
                return (
                  <div key={di}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0",
                          drive.type === "SSD" ? "bg-sky-500/15 text-sky-400 border border-sky-500/20" : "bg-zinc-700/60 text-zinc-400 border border-white/10"
                        )}>
                          {drive.type}
                        </span>
                        <span className="text-xs text-zinc-300 font-medium truncate">{drive.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 flex-shrink-0 ml-2">
                        {fmt(drive.used)} / {fmt(drive.total)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + di * 0.08, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-full transform-gpu",
                          pct >= 85 ? "bg-red-500/70" : pct >= 65 ? "bg-amber-500/65" : "bg-violet-500/65"
                        )}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <SmartBadge status={drive.smart} />
                      <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <Thermometer size={9} className="text-zinc-600" />
                        {drive.temp}°C
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 bg-zinc-900/60 border border-white/10 rounded-xl px-3 py-2">
        <AlertTriangle size={11} className="text-zinc-600 flex-shrink-0" />
        <p className="text-[10px] text-zinc-500">Wire to <span className="font-mono text-zinc-400">smartctl</span> on Node 2 for live readings. Values are mock.</p>
      </div>
    </BentoCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SYSTEM STATS
// ─────────────────────────────────────────────────────────────────────────────
const STATS = [
  {
    node: "spiritdesktop", sub: "Ryzen AM5 · XFX · DDR5",
    rows: [
      { label: "CPU · Ryzen AM5", value: 12,   display: "12%",     max: 100 },
      { label: "RAM · 16GB DDR5", value: 7.2,  display: "7.2 GB",  max: 16  },
      { label: "GPU · XFX",       value: 8,    display: "8%",      max: 100 },
    ],
    alert: { color: "sky" as const, text: "RAM bottleneck on 3-monitor Cursor workflow. Target: 32GB DDR5." },
  },
  {
    node: "spirit (Dell)", sub: "i7-6700 · 16GB DDR4",
    rows: [
      { label: "CPU · i7-6700",   value: 34,   display: "34%",     max: 100 },
      { label: "RAM · 16GB DDR4", value: 11.2, display: "11.2 GB", max: 16  },
    ],
    alert: null,
  },
  {
    node: "Ghost Node", sub: "Pi 3 · 1GB LPDDR2",
    rows: [
      { label: "CPU · ARM",        value: 22,   display: "22%",     max: 100 },
      { label: "RAM · 1GB LPDDR2", value: 0.54, display: "0.54 GB", max: 1   },
    ],
    alert: { color: "amber" as const, text: "FLIRC case pending. Watch for thermal throttle under DNS load." },
  },
];

function SystemStats() {
  return (
    <BentoCard className="md:col-span-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Label>Node Vitals</Label>
          <h2 className="text-base font-semibold tracking-tight text-zinc-100">System Stats</h2>
        </div>
        <Cpu size={14} className="text-zinc-600 flex-shrink-0" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {STATS.map((section, si) => (
          <div key={section.node}>
            <p className="text-[10px] font-mono font-semibold text-violet-400 mb-0.5 truncate">{section.node}</p>
            <p className="text-[10px] text-zinc-600 mb-2 truncate">{section.sub}</p>
            <div className="space-y-3">
              {section.rows.map((row, ri) => (
                <div key={ri}>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-[11px] text-zinc-500 truncate">{row.label}</p>
                    <p className="text-[11px] font-mono text-zinc-200 ml-2 flex-shrink-0">{row.display}</p>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(row.value / row.max) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.45 + si * 0.06 + ri * 0.05, ease: "easeOut" }}
                      className="h-full rounded-full bg-violet-500/70 transform-gpu"
                    />
                  </div>
                </div>
              ))}
            </div>
            {section.alert && (
              <div className={cn("mt-3 rounded-xl px-2.5 py-1.5 flex items-start gap-1.5", section.alert.color === "amber" ? "bg-amber-500/10 border border-amber-500/20" : "bg-sky-500/10 border border-sky-500/20")}>
                <AlertTriangle size={11} className={cn("flex-shrink-0 mt-0.5", section.alert.color === "amber" ? "text-amber-400" : "text-sky-400")} />
                <p className={cn("text-[10px] leading-snug", section.alert.color === "amber" ? "text-amber-300" : "text-sky-300")}>{section.alert.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </BentoCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ENERGY MATRIX
// ─────────────────────────────────────────────────────────────────────────────
const NODES = [
  { name: "spiritdesktop", sub: "Ryzen AM5 · XFX GPU",     wattage: 148, state: "active"  as const },
  { name: "spirit",        sub: "Dell i7-6700 · 16GB DDR4", wattage: 198, state: "active"  as const },
  { name: "Ghost Node",    sub: "Raspberry Pi 3 · 2017",    wattage: 4,   state: "active"  as const },
  { name: "Tesla P40",     sub: "24GB VRAM · Awaiting PSU", wattage: 0,   state: "pending" as const },
];

function EnergyMatrix() {
  const total = NODES.reduce((s, n) => s + n.wattage, 0);
  const costHr = ((total / 1000) * 0.11).toFixed(4);

  return (
    <BentoCard className="md:col-span-4">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="min-w-0">
          <Label>Energy Matrix · Node 5</Label>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
            {total}<span className="text-sm text-zinc-500 font-normal ml-1">W</span>
          </h2>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-mono font-semibold text-emerald-400">$0.11<span className="text-xs text-zinc-500 font-normal">/kWh</span></p>
          <p className="text-[10px] text-emerald-600 font-medium">Super Off-Peak</p>
          <p className="text-xs text-zinc-500">${costHr}/hr</p>
        </div>
      </div>
      <div className="space-y-3">
        {NODES.map((node, i) => {
          const pct = total > 0 ? (node.wattage / total) * 100 : 0;
          const isPending = node.state === "pending";
          return (
            <div key={i}>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", isPending ? "bg-amber-500" : "bg-emerald-400")} />
                <span className="text-xs font-mono text-zinc-300 truncate flex-1 min-w-0">{node.name}</span>
                <span className={cn("text-xs font-mono flex-shrink-0", isPending ? "text-amber-500" : "text-zinc-400")}>
                  {isPending ? "PENDING" : `${node.wattage}W`}
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isPending ? "0%" : `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.07, ease: "easeOut" }}
                  className="h-full rounded-full bg-violet-500/70 transform-gpu"
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
        <Clock size={12} className="text-amber-400 flex-shrink-0" />
        <p className="text-xs text-amber-300">Peak (2 PM – 7 PM) in <span className="font-semibold">6h 14m</span>. Heavy compute queued.</p>
      </div>
    </BentoCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TOXIC GRADER
// ─────────────────────────────────────────────────────────────────────────────
const ROAST = [
  { pre: "GRADER >", text: "Querying Langfuse DB... pulling your last 24h of sessions.", color: "text-violet-400" },
  { pre: "GRADER >", text: "You fixed the same null reference error four consecutive times. Spectacular.", color: "text-amber-400" },
  { pre: "GRADER >", text: "Prompt efficiency: 34%. You are an expensive rubber duck with a standing desk.", color: "text-red-400" },
  { pre: "GRADER >", text: "47 minutes on one flexbox issue. Three lines of CSS. I have nothing to add.", color: "text-red-400" },
  { pre: "GRADE   >", text: "D+  —  Functional. Barely. Like a 2004 Civic with a cracked manifold.", color: "text-orange-300" },
  { pre: "SYSTEM  >", text: "Ready. Click [GRADE ME] when your ego has recovered.", color: "text-zinc-500" },
];

function ToxicGrader() {
  return (
    <BentoCard className="md:col-span-8 bg-zinc-950/90 border-red-900/25">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <p className="text-[11px] font-mono text-zinc-600 ml-1 hidden sm:block">toxic-grader · langfuse-hook</p>
        </div>
        <div className="flex items-center gap-1">
          <Flame size={11} className="text-red-400" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400">Roast Wall</p>
        </div>
      </div>
      <div className="font-mono text-[11px] space-y-1.5 mb-4">
        {ROAST.map((line, i) => (
          <div key={i} className="flex gap-2 leading-snug">
            <span className="text-zinc-700 select-none w-[60px] flex-shrink-0">{line.pre}</span>
            <span className={cn(line.color, "break-words min-w-0")}>{line.text}</span>
          </div>
        ))}
        <div className="flex gap-2">
          <span className="text-zinc-700 select-none w-[60px] flex-shrink-0">GRADER {">"}</span>
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.1, repeat: Infinity }} className="text-zinc-400">█</motion.span>
        </div>
      </div>
      <button className="w-full py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
        <Terminal size={13} />
        GRADE ME — IF YOU DARE
      </button>
    </BentoCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMAND BAR
// ─────────────────────────────────────────────────────────────────────────────
type ChatMsg = { role: "user" | "spirit"; text: string };
const INIT_MSGS: ChatMsg[] = [{ role: "spirit", text: "Source. Command bar online. What do you need?" }];

type SpiritStatus = "online" | "error";

function CommandBar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>(INIT_MSGS);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [status, setStatus] = useState<SpiritStatus>("online");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, thinking]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const send = async () => {
    const text = draft.trim();
    if (!text || thinking) return;
    setDraft("");
    setMsgs((m) => [...m, { role: "user", text }]);
    setThinking(true);
    setStatus("online");
    try {
      const res = await fetch("/api/spirit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : `Request failed (${res.status})`;
        setStatus("error");
        setMsgs((m) => [...m, { role: "spirit", text: errMsg }]);
        return;
      }
      const reply =
        typeof data === "object" &&
        data !== null &&
        "reply" in data &&
        typeof (data as { reply: unknown }).reply === "string"
          ? (data as { reply: string }).reply
          : "";
      if (!reply) {
        setStatus("error");
        setMsgs((m) => [...m, { role: "spirit", text: "Empty reply from Spirit API." }]);
        return;
      }
      setStatus("online");
      setMsgs((m) => [...m, { role: "spirit", text: reply }]);
    } catch (e) {
      setStatus("error");
      const message = e instanceof Error ? e.message : "Network error";
      setMsgs((m) => [...m, { role: "spirit", text: `Spirit API error: ${message}` }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <>
      {/*
        Backdrop — opacity transition replaces visibility.
        visibility:hidden is cached by the iOS GPU compositor; the layer
        may never be promoted to visible even after state change.
        opacity:0 + pointer-events:none is fully hardware-accelerated on iOS.
      */}
      {/*
        Backdrop — backdrop-blur-sm REMOVED.
        backdrop-filter triggers an off-screen WebKit render pass; iOS drops
        the paint silently when GPU memory is constrained or the stacking tree
        is complex. Solid bg-black/80 is visually equivalent and always paints.
      */}
      <div
        data-open={open}
        aria-hidden={!open}
        role="button"
        tabIndex={open ? 0 : -1}
        className={cn(
          "fixed inset-0 z-[99998] touch-manipulation cursor-pointer bg-black/80",
          "transition-opacity duration-200 ease-out",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClose();
          }
        }}
      />
      {/* Panel — backdrop-blur-xl REMOVED; solid bg-zinc-900; 65dvh for iOS URL bar */}
      <div
        data-open={open}
        aria-hidden={!open}
        className={cn(
          "fixed bottom-0 inset-x-0 z-[99999] transform-gpu sm:bottom-6 sm:left-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:px-4",
          "transition-[opacity,transform] duration-200 ease-out",
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-full pointer-events-none",
        )}
      >
        <div
          className="flex flex-col overflow-hidden border-t border-white/10 bg-zinc-900 shadow-2xl sm:rounded-2xl sm:border"
          style={{ maxHeight: "65dvh" }}
        >
              <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="pointer-events-none flex h-5 w-5 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/20">
                    <Zap size={10} className="text-violet-400" />
                  </div>
                  <p className="text-xs font-semibold text-zinc-300 font-mono">Spirit · Command Bar</p>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px]",
                      status === "error"
                        ? "border-red-500/30 bg-red-500/10 text-red-300"
                        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
                    )}
                  >
                    {status === "error" ? "Error" : "Online"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="pointer-events-auto relative z-[9999] min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
                  aria-label="Close command bar"
                >
                  <X size={16} className="pointer-events-none" aria-hidden />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {msgs.map((msg, i) => (
                  <div key={i} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
                    {msg.role === "spirit" && (
                      <div className="pointer-events-none mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/20">
                        <Zap size={9} className="text-violet-400" />
                      </div>
                    )}
                    <div className={cn("max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed", msg.role === "user" ? "bg-violet-500/20 border border-violet-500/25 text-zinc-200 rounded-tr-sm" : "bg-white/5 border border-white/10 text-zinc-300 rounded-tl-sm font-mono")}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex gap-2">
                    <div className="pointer-events-none flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/20">
                      <Zap size={9} className="text-violet-400" />
                    </div>
                    <div className="px-3 py-2.5 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 flex items-center gap-1">
                      {[0, 1, 2].map((d) => (
                        <motion.span key={d} animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.18 }} className="w-1.5 h-1.5 rounded-full bg-violet-400 block transform-gpu" />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="px-3 py-3 border-t border-white/10 flex items-center gap-2 flex-shrink-0">
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  placeholder="Issue a command to Spirit..."
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-violet-500/40 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => void send()}
                  disabled={!draft.trim() || thinking}
                  className="pointer-events-auto relative z-[9999] flex h-11 w-11 flex-shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/20 text-violet-300 transition-all hover:bg-violet-500/30 disabled:opacity-30 active:scale-95"
                >
                  <Send size={13} className="pointer-events-none" aria-hidden />
                </button>
              </div>
            </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const { setCommandBarOpen } = useOverlayLock();

  useEffect(() => {
    setCommandBarOpen(chatOpen);
    return () => {
      setCommandBarOpen(false);
    };
  }, [chatOpen, setCommandBarOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setChatOpen((o) => !o); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div className="relative p-4 md:p-6">
      {/* Page header — trigger must win hit-testing on iOS (above scroll/compositor quirks) */}
      <div className="relative z-[1] mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-100 truncate">Trinity Dashboard</h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-0.5 truncate">
            Source · Intuitive Wrld · <span className="text-emerald-400 font-medium">All nodes nominal</span>
          </p>
        </div>
        <button
          type="button"
          role="button"
          onClick={() => setChatOpen(true)}
          className="pointer-events-auto relative z-[9999] flex min-h-[44px] shrink-0 touch-manipulation cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-400 transition-transform active:scale-95"
        >
          <Command size={13} className="pointer-events-none shrink-0" aria-hidden />
          <span className="hidden sm:inline">Command Bar</span>
          <kbd className="hidden md:inline text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </button>
      </div>

      {/*
        BENTO GRID
        `transform-gpu` on the grid container forces a GPU compositing layer
        for the entire grid subtree — prevents iOS from deferring paint on
        children that have opacity animations.

        All cards are col-span-12 (full width) on mobile by default.
        Desktop overrides via md:col-span-X.
      */}
      <div className="grid grid-cols-12 gap-4">
        <OracleOrb onOpenChat={() => setChatOpen(true)} />
        <BriefingHub />
        <ProjectHub />
        <DriveHealthWidget />
        <SystemStats />
        <EnergyMatrix />
        <ToxicGrader />
      </div>

      <CommandBar open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
