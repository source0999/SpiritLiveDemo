"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Send, Zap } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "user" | "spirit";
type SarcasmLevel = "chill" | "peer" | "unhinged";

interface Message {
  id: string;
  role: Role;
  text: string;
  ts: string;
}

// ─── Acoustic Marker Parser ───────────────────────────────────────────────────
//
// Scans Spirit output for XTTS v2 stage directions: [sigh], [scoffs], etc.
// Wraps matches in italic violet spans so they visually pop from monospace body.
//
function parseAcousticMarkers(text: string): (string | JSX.Element)[] {
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((part, i) => {
    if (/^\[[^\]]+\]$/.test(part)) {
      return (
        <span key={i} className="italic text-violet-500/70 not-italic">
          {part}
        </span>
      );
    }
    return part;
  });
}

// ─── Mock Conversation ────────────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "user",
    text: "Run a full threat assessment on the homelab network.",
    ts: "06:14",
  },
  {
    id: "2",
    role: "spirit",
    text: "[sighs] Alright. Scanning the usual suspects on your subnet — you really need to rotate those credentials, by the way. Running nmap passive fingerprint now.",
    ts: "06:14",
  },
  {
    id: "3",
    role: "user",
    text: "What's the verdict on the Ghost Node?",
    ts: "06:15",
  },
  {
    id: "4",
    role: "spirit",
    text: "[scoffs] The Pi 3 is running DNS over port 53 unencrypted. Cute. I'm also seeing an open port 22 with password auth enabled. [groan] This is fine, I guess, if you enjoy chaos.",
    ts: "06:15",
  },
  {
    id: "5",
    role: "user",
    text: "Fix it.",
    ts: "06:16",
  },
  {
    id: "6",
    role: "spirit",
    text: "On it. Generating hardened sshd_config now. You're welcome. [exhales] I'll also push DoH config to the Pi. This will take approximately 40 seconds. Try not to break anything else while you wait.",
    ts: "06:16",
  },
];

// ─── Sarcasm config ───────────────────────────────────────────────────────────

const SARCASM_LEVELS: { id: SarcasmLevel; label: string }[] = [
  { id: "chill",    label: "Chill"    },
  { id: "peer",     label: "Peer"     },
  { id: "unhinged", label: "Unhinged" },
];

const SARCASM_ACTIVE: Record<SarcasmLevel, string> = {
  chill:    "border-zinc-600   bg-zinc-700/60  text-zinc-200",
  peer:     "border-violet-500/40 bg-violet-500/20 text-violet-300",
  unhinged: "border-red-500/40  bg-red-500/15  text-red-300",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SovereignChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [sarcasm, setSarcasm] = useState<SarcasmLevel>("peer");
  const [thinking, setThinking] = useState(false);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // Auto-resize textarea (max 160px ≈ 6 lines)
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  };

  const nowHHMM = () =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const send = async () => {
    const text = input.trim();
    if (!text || thinking) return;

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg: Message = { id: Date.now().toString(), role: "user", text, ts: nowHHMM() };
    setMessages((m) => [...m, userMsg]);
    setThinking(true);

    try {
      const res = await fetch("/api/spirit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, sarcasm }),
      });
      const data = await res.json().catch(() => ({}));
      const reply: string = (data as { reply?: string }).reply ?? "";

      setMessages((m) => [
        ...m,
        {
          id: (Date.now() + 1).toString(),
          role: "spirit",
          text: reply || "[silence] Nothing came back. Suspicious.",
          ts: nowHHMM(),
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: (Date.now() + 1).toString(),
          role: "spirit",
          text: "[sighs] Network error. The irony of a homelab failing its own AI.",
          ts: nowHHMM(),
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    /*
      h-[calc(100dvh-60px)]: subtract the fixed mobile header (60px).
      md:h-[100dvh]: desktop — sidebar is sticky, main has no padding-top.
      No h-screen, no backdrop-blur, no overflow-hidden on any ancestor.
    */
    <div className="flex h-[calc(100dvh-60px)] flex-col bg-zinc-950 md:h-[100dvh]">

      {/* ── Chat Header ──────────────────────────────────────────────────── */}
      <header className="flex flex-shrink-0 items-center justify-between border-b border-white/[0.07] px-4 py-3">

        {/* Model status pill */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10">
            <Zap size={12} className="text-violet-400" />
            {/* Ping dot: CSS-only, no Framer Motion */}
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-400" />
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate font-mono text-xs font-semibold leading-none text-zinc-100">
              Llama-3-Abliterated
            </p>
            <p className="mt-0.5 text-[10px] font-semibold text-emerald-500">Online</p>
          </div>
        </div>

        {/* Sarcasm Level toggle */}
        <div className="flex items-center gap-1.5">
          <span className="mr-1 hidden text-[10px] font-semibold uppercase tracking-widest text-zinc-600 sm:block">
            Sarcasm
          </span>
          {SARCASM_LEVELS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSarcasm(id)}
              className={[
                "rounded-lg border px-2.5 py-1 text-[11px] font-semibold touch-manipulation transition-colors",
                sarcasm === id
                  ? SARCASM_ACTIVE[id]
                  : "border-white/[0.07] bg-transparent text-zinc-600 hover:text-zinc-400",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Message Arena ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={["flex flex-col", msg.role === "user" ? "items-end" : "items-start"].join(" ")}
            >
              {/* Role label */}
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                {msg.role === "user" ? "Source" : "Spirit"}
              </p>

              {/* Message body */}
              {msg.role === "user" ? (
                /*
                  User: clean right-aligned bubble.
                  Dark zinc-900 bg, subtle border, sans-serif.
                */
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-white/[0.07] bg-zinc-900 px-4 py-3 text-sm leading-relaxed text-zinc-100 sm:max-w-xl">
                  {msg.text}
                </div>
              ) : (
                /*
                  Spirit: raw mono output — no bubble, no background.
                  Feels like direct terminal output from the AI core.
                  Acoustic markers ([sigh], [scoffs]) rendered in violet italic.
                */
                <div className="max-w-[90%] font-mono text-sm leading-relaxed text-zinc-300 sm:max-w-2xl">
                  {parseAcousticMarkers(msg.text)}
                </div>
              )}

              {/* Timestamp */}
              <p className="mt-1.5 text-[10px] text-zinc-700">{msg.ts}</p>
            </div>
          ))}

          {/* Thinking indicator — CSS cursor blink, no Framer Motion */}
          {thinking && (
            <div className="flex flex-col items-start">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                Spirit
              </p>
              <p className="font-mono text-sm text-zinc-500">
                <span className="italic text-violet-500/60">[processing]</span>
                {" "}
                <span className="animate-pulse text-violet-400">▌</span>
              </p>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input Matrix ─────────────────────────────────────────────────── */}
      {/*
        paddingBottom: max(12px, env(safe-area-inset-bottom))
        Prevents the iOS home indicator bar from obscuring the input.
        Cannot express env() in Tailwind without a plugin, so inline style is used.
      */}
      <div
        className="flex-shrink-0 border-t border-white/[0.07] px-4 pt-3"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2 rounded-2xl border border-white/[0.07] bg-zinc-900 px-3 py-2.5">

            {/* Attachment button */}
            <button
              type="button"
              aria-label="Attach file"
              className="mb-0.5 flex h-8 w-8 flex-shrink-0 touch-manipulation items-center justify-center rounded-xl text-zinc-600 transition-colors hover:text-zinc-400 active:scale-95"
            >
              <Paperclip size={16} className="pointer-events-none" aria-hidden />
            </button>

            {/* Auto-expand textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Issue a directive..."
              rows={1}
              className="min-h-[36px] flex-1 resize-none bg-transparent py-1 font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-700"
              style={{ maxHeight: "160px" }}
            />

            {/* Send button */}
            <button
              type="button"
              onClick={() => void send()}
              disabled={!input.trim() || thinking}
              aria-label="Send"
              className="mb-0.5 flex h-9 w-9 flex-shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/20 text-violet-300 transition-colors hover:bg-violet-500/30 disabled:opacity-30 active:scale-95"
            >
              <Send size={14} className="pointer-events-none" aria-hidden />
            </button>
          </div>

          {/* Footer metadata */}
          <p className="mt-2 text-center font-mono text-[10px] text-zinc-700">
            Spirit · Llama-3-Abliterated · XTTS v2 · Sarcasm:{" "}
            <span
              className={
                sarcasm === "chill"
                  ? "text-zinc-500"
                  : sarcasm === "peer"
                  ? "text-violet-600"
                  : "text-red-700"
              }
            >
              {sarcasm}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
