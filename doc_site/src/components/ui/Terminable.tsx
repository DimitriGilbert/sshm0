"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { ScrollArea } from "#/components/ui/scroll-area";

// ── Types ────────────────────────────────────────────────────────────────────

export type OutputContent = {
  delay?: number;
  placeholder?: string | React.ReactNode;
  content: string | React.ReactNode;
};

export type DisplayEntry = {
  type: "command" | "output";
  content: string | React.ReactNode;
  done?: boolean;
  index?: number;
};

export type CommandEntry = {
  prompt: string | React.ReactNode | Array<string | React.ReactNode>;
  output?:
    | string
    | OutputContent
    | React.ReactNode
    | Array<string | OutputContent | React.ReactNode>;
  typingSpeed?: number;
  typingRandom?: number;
  delay?: number;
  outputDelay?: number;
  onDone?: () => void;
  onCopy?: () => void;
  onBeforeOutput?: () => void;
};

export type TitleBarVariant = "macos" | "windows" | "linux" | "minimal" | "none";

export type TerminableProps = {
  commands: CommandEntry[];
  defaultTypingSpeed?: number;
  defaultTypingRandom?: number;
  defaultOutputSpeed?: number;
  width?: string;
  height?: string;
  termPrompt?: string | React.ReactNode;
  startLine?: string | React.ReactNode;
  backgroundColor?: string;
  promptColor?: string;
  outputColor?: string;
  title?: string | React.ReactNode;
  commandDelay?: number;
  allowCopy?: boolean;
  start?: boolean;
  titleBarVariant?: TitleBarVariant;
  onError?: (error: Error) => void;
  onCopySuccess?: (text: string) => void;
  onCopyError?: (error: Error) => void;
  ref?: React.Ref<HTMLElement>;
};

// ── CSS custom property defaults ─────────────────────────────────────────────

const CSS_VAR_DEFAULTS: Record<string, string> = {
  "--terminable-bg": "#1a1b26",
  "--terminable-prompt": "#73daca",
  "--terminable-output": "#c0caf5",
  "--terminable-titlebar-bg": "#24283b",
  "--terminable-border": "#3b4261",
  "--terminable-dot-green": "#27c93f",
  "--terminable-dot-yellow": "#ffbd2e",
  "--terminable-dot-red": "#ff5f56",
  "--terminable-title-color": "#a9b1d6",
  "--terminable-hover-bg": "#292e42",
  "--terminable-cursor-color": "#c0caf5",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

type CommandProcessingState = {
  isProcessing: boolean;
  currentIndex: number;
};

function calculateTypingDelay(
  baseSpeed: number,
  randomFactor: number = 0,
): number {
  const randomVariation = Math.random() * (baseSpeed * (randomFactor / 100));
  return Math.max(
    10,
    baseSpeed + (Math.random() > 0.5 ? randomVariation : -randomVariation),
  );
}

function abortableDelay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for non-HTTPS contexts
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const ok = document.execCommand("copy");
    if (!ok) throw new Error("execCommand('copy') returned false");
  } finally {
    document.body.removeChild(textarea);
  }
}

// ── Title bar sub-components ─────────────────────────────────────────────────

function MacOSDots() {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: "var(--terminable-dot-green)" }}
      />
      <div
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: "var(--terminable-dot-yellow)" }}
      />
      <div
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: "var(--terminable-dot-red)" }}
      />
    </div>
  );
}

function WindowsButtons() {
  const btnBase: React.CSSProperties = {
    width: "12px",
    height: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    lineHeight: 1,
    color: "var(--terminable-title-color)",
    borderRadius: "2px",
  };

  return (
    <div className="flex items-center gap-1">
      <div style={btnBase}>─</div>
      <div style={btnBase}>□</div>
      <div style={btnBase}>✕</div>
    </div>
  );
}

function LinuxButton() {
  return (
    <div className="flex items-center">
      <div
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: "var(--terminable-dot-red)" }}
      />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function Terminable({
  commands = [],
  defaultTypingSpeed = 50,
  defaultTypingRandom = 0,
  defaultOutputSpeed = 30,
  width = "w-full max-w-[800px]",
  height = "min-h-[300px] max-h-[500px]",
  termPrompt = "$ ",
  startLine = "",
  backgroundColor,
  promptColor,
  outputColor,
  title,
  commandDelay = 1000,
  allowCopy = true,
  start = true,
  titleBarVariant = "macos",
  onError,
  onCopySuccess,
  onCopyError,
  ref,
}: TerminableProps) {
  const [display, setDisplay] = useState<DisplayEntry[]>([
    { type: "output", content: startLine },
  ]);

  const processingStateRef = useRef<CommandProcessingState>({
    isProcessing: false,
    currentIndex: 0,
  });

  const abortRef = useRef<AbortController | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef<boolean>(false);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // ── CSS custom properties ────────────────────────────────────────────────

  // Build CSS custom properties — use Record<string, string> to allow
  // arbitrary --terminable-* keys that React.CSSProperties doesn't know about.
  const cssVars = { ...CSS_VAR_DEFAULTS } as Record<string, string>;
  if (backgroundColor) cssVars["--terminable-bg"] = backgroundColor;
  if (promptColor) cssVars["--terminable-prompt"] = promptColor;
  if (outputColor) cssVars["--terminable-output"] = outputColor;

  // ── Auto-scroll ──────────────────────────────────────────────────────────

  const getScrollViewport = useCallback(() => {
    return terminalRef.current?.querySelector<HTMLDivElement>(
      '[data-slot="scroll-area-viewport"]',
    );
  }, []);

  useEffect(() => {
    const viewport = getScrollViewport();
    if (viewport && !userScrolledRef.current) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [display, getScrollViewport]);

  const handleScroll = useCallback(() => {
    const viewport = getScrollViewport();
    if (!viewport) return;
    const { scrollTop, scrollHeight, clientHeight } = viewport;
    userScrolledRef.current = scrollHeight - scrollTop !== clientHeight;
  }, [getScrollViewport]);

  useEffect(() => {
    const viewport = getScrollViewport();
    if (!viewport) return;

    viewport.addEventListener("scroll", handleScroll);
    return () => {
      viewport.removeEventListener("scroll", handleScroll);
    };
  }, [getScrollViewport, handleScroll]);

  // ── Command output processing ────────────────────────────────────────────

  const processCommandOutput = useCallback(
    async (
      output:
        | string
        | React.ReactNode
        | OutputContent
        | Array<string | React.ReactNode | OutputContent>,
      defaultSpeed: number,
      signal: AbortSignal,
      onBeforeOutput?: () => void,
    ) => {
      const outputs = Array.isArray(output) ? output : [output];

      for (const line of outputs) {
        if (signal.aborted) return;
        if (line == null) continue;

        await abortableDelay(defaultSpeed, signal);

        // ReactNode directly (not string, not OutputContent)
        if (
          typeof line !== "string" &&
          !(typeof line === "object" && line !== null && "content" in line)
        ) {
          onBeforeOutput?.();
          setDisplay((prev) => [...prev, { type: "output", content: line }]);
          continue;
        }

        if (typeof line === "string") {
          onBeforeOutput?.();
          setDisplay((prev) => [...prev, { type: "output", content: line }]);
          continue;
        }

        // OutputContent
        onBeforeOutput?.();
        setDisplay((prev) => [
          ...prev,
          { type: "output", content: line.placeholder ?? "" },
        ]);

        if (line.delay) {
          await abortableDelay(line.delay, signal);
        }

        setDisplay((prev) => {
          const newDisplay = [...prev];
          const lastEntry = newDisplay[newDisplay.length - 1];
          if (lastEntry?.type === "output") {
            lastEntry.content = line.content;
          }
          return newDisplay;
        });
      }
    },
    [],
  );

  // ── Single command processing ────────────────────────────────────────────

  const processCommand = useCallback(
    async (cmd: CommandEntry, signal: AbortSignal) => {
      if (processingStateRef.current.isProcessing) return;

      try {
        processingStateRef.current.isProcessing = true;

        if (processingStateRef.current.currentIndex > 0) {
          await abortableDelay(cmd.delay ?? commandDelay, signal);
        }

        // Type a single prompt
        const typePrompt = async (prompt: string | React.ReactNode) => {
          const cmdIndex = processingStateRef.current.currentIndex;
          setDisplay((prev) => [
            ...prev,
            { type: "command", content: "", done: false, index: cmdIndex },
          ]);

          if (typeof prompt !== "string") {
            setDisplay((prev) => {
              const lastEntry = prev[prev.length - 1];
              if (lastEntry?.type === "command") {
                return [
                  ...prev.slice(0, -1),
                  { ...lastEntry, content: prompt, done: true },
                ];
              }
              return prev;
            });
            return;
          }

          const trimmedPrompt = prompt.trim();

          if (prefersReducedMotion) {
            setDisplay((prev) => {
              const lastEntry = prev[prev.length - 1];
              if (lastEntry?.type === "command") {
                return [
                  ...prev.slice(0, -1),
                  { ...lastEntry, content: trimmedPrompt, done: true },
                ];
              }
              return prev;
            });
            return;
          }

          let currentContent = "";

          for (const char of trimmedPrompt) {
            if (signal.aborted) return;
            const delay = calculateTypingDelay(
              cmd.typingSpeed ?? defaultTypingSpeed,
              cmd.typingRandom ?? defaultTypingRandom,
            );

            await abortableDelay(delay, signal);
            currentContent += char;

            setDisplay((prev) => {
              const lastEntry = prev[prev.length - 1];
              if (lastEntry?.type === "command") {
                return [
                  ...prev.slice(0, -1),
                  { ...lastEntry, content: currentContent },
                ];
              }
              return prev;
            });
          }

          // Mark done
          setDisplay((prev) => {
            const lastEntry = prev[prev.length - 1];
            if (lastEntry?.type === "command") {
              return [...prev.slice(0, -1), { ...lastEntry, done: true }];
            }
            return prev;
          });
        };

        // Process prompts
        if (Array.isArray(cmd.prompt)) {
          for (const p of cmd.prompt) {
            if (signal.aborted) return;
            await typePrompt(p);
          }
        } else {
          await typePrompt(cmd.prompt);
        }

        // Process outputs
        if (cmd.output) {
          if (cmd.outputDelay) {
            await abortableDelay(cmd.outputDelay, signal);
          }
          await processCommandOutput(
            cmd.output,
            defaultOutputSpeed,
            signal,
            cmd.onBeforeOutput,
          );
        }

        cmd.onDone?.();
        processingStateRef.current.currentIndex += 1;
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          // Silently ignore aborts
          return;
        }
        const err =
          error instanceof Error ? error : new Error(String(error));
        onError?.(err);
      } finally {
        processingStateRef.current.isProcessing = false;
      }
    },
    [
      commandDelay,
      defaultOutputSpeed,
      defaultTypingSpeed,
      defaultTypingRandom,
      onError,
      prefersReducedMotion,
      processCommandOutput,
    ],
  );

  // ── Main processing loop ─────────────────────────────────────────────────

  useEffect(() => {
    if (!start) {
      // Abort any running processing when start becomes false
      abortRef.current?.abort();
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;

    // Reset processing state for fresh start
    processingStateRef.current = { isProcessing: false, currentIndex: 0 };

    const run = async () => {
      // Reset display at the start of the async processing loop
      setDisplay([{ type: "output", content: startLine }]);

      try {
        while (
          processingStateRef.current.currentIndex < commands.length &&
          !signal.aborted
        ) {
          const cmd = commands[processingStateRef.current.currentIndex];
          if (cmd) {
            await processCommand(cmd, signal);
          } else {
            processingStateRef.current.currentIndex++;
          }
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        const err =
          error instanceof Error ? error : new Error(String(error));
        onError?.(err);
      }
    };

    void run();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- startLine is captured on mount; commands identity triggers re-run correctly
  }, [start, commands]);

  // ── Clipboard handler ────────────────────────────────────────────────────

  const handleCommandClick = useCallback(
    (entry: DisplayEntry) => {
      if (!allowCopy || !entry.done || typeof entry.content !== "string") {
        return;
      }

      const cmd = entry.index !== undefined ? commands[entry.index] : undefined;

      copyToClipboard(entry.content)
        .then(() => {
          cmd?.onCopy?.();
          onCopySuccess?.(entry.content as string);
        })
        .catch((error: unknown) => {
          const err =
            error instanceof Error ? error : new Error(String(error));
          onCopyError?.(err);
        });
    },
    [allowCopy, commands, onCopySuccess, onCopyError],
  );

  const handleCommandKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLSpanElement>, entry: DisplayEntry) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCommandClick(entry);
      }
    },
    [handleCommandClick],
  );

  // ── Title bar rendering ──────────────────────────────────────────────────

  const renderTitleBar = () => {
    if (titleBarVariant === "none") return null;

    const titleBarContent = (
      <div
        className="flex items-center px-2"
        style={{
          backgroundColor: "var(--terminable-titlebar-bg)",
          height: "28px",
        }}
      >
        {titleBarVariant === "macos" && <MacOSDots />}
        {titleBarVariant === "windows" && <WindowsButtons />}
        {titleBarVariant === "linux" && <LinuxButton />}
        <div
          className="flex-1 text-center text-sm"
          style={{ color: "var(--terminable-title-color)" }}
        >
          {title}
        </div>
        {/* Spacer to balance the title when buttons are on left */}
        {(titleBarVariant === "macos" ||
          titleBarVariant === "windows" ||
          titleBarVariant === "linux") && (
          <div style={{ width: titleBarVariant === "macos" ? "52px" : "40px" }} />
        )}
      </div>
    );

    return titleBarContent;
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <section
      ref={ref}
      role="region"
      aria-roledescription="terminal"
      aria-label="Terminal simulator"
      className={`mx-auto my-1 ${width} overflow-hidden rounded-lg font-mono`}
      style={{
        ...cssVars,
        backgroundColor: "var(--terminable-bg)",
        border: `1px solid var(--terminable-border)`,
      }}
    >
      {renderTitleBar()}
      <ScrollArea
        ref={terminalRef}
        className={`${height} overflow-hidden [&_[data-slot=scroll-area-viewport]]:max-h-[inherit] [&_[data-slot=scroll-area-viewport]]:min-h-[inherit] [&_[data-slot=scroll-area-viewport]]:overflow-x-hidden [&_[data-slot=scroll-area-viewport]]:overflow-y-auto`}
        style={{ color: "var(--terminable-prompt)" }}
        role="log"
        aria-live="polite"
      >
        <div className="p-5 whitespace-pre-wrap break-words">
          {display.map((entry, index) => (
            <div key={`${index}-${entry.type}`} className="my-1">
              {entry.type === "command" && (
                <div className="flex">
                  <span
                    className="mr-2"
                    style={{ color: "var(--terminable-prompt)" }}
                  >
                    {termPrompt}
                  </span>
                  <span
                    className={`cursor-pointer break-all rounded px-1 ${
                      !entry.done ? "animate-blink border-r-2" : ""
                    }${
                      allowCopy && entry.done && typeof entry.content === "string"
                        ? " focus:outline focus:outline-2 focus:outline-[var(--terminable-cursor-color)]"
                        : ""
                    }`}
                    style={{
                      borderColor: !entry.done
                        ? "var(--terminable-cursor-color)"
                        : undefined,
                    }}
                    onClick={() => handleCommandClick(entry)}
                    onKeyDown={
                      allowCopy && entry.done && typeof entry.content === "string"
                        ? (e) => handleCommandKeyDown(e, entry)
                        : undefined
                    }
                    tabIndex={
                      allowCopy && entry.done && typeof entry.content === "string"
                        ? 0
                        : undefined
                    }
                    aria-label={
                      allowCopy && entry.done && typeof entry.content === "string"
                        ? `Click to copy: ${entry.content}`
                        : undefined
                    }
                    role={
                      allowCopy && entry.done && typeof entry.content === "string"
                        ? "button"
                        : undefined
                    }
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.backgroundColor =
                        "var(--terminable-hover-bg)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.backgroundColor =
                        "";
                    }}
                  >
                    {entry.content}
                  </span>
                </div>
              )}
              {entry.type === "output" && (
                <div
                  className="ml-6 whitespace-pre-wrap break-all"
                  style={{ color: "var(--terminable-output)" }}
                >
                  {entry.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
