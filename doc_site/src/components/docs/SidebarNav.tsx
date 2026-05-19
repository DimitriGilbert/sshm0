const sections = [
  { id: "installation", label: "Installation" },
  { id: "quick-start", label: "Quick Start" },
  { id: "add", label: "Add" },
  { id: "connect", label: "Connect" },
  { id: "cp", label: "Copy Files" },
  { id: "rsync", label: "Rsync" },
  { id: "list", label: "List" },
  { id: "edit", label: "Edit" },
  { id: "remove", label: "Remove" },
  { id: "rename", label: "Rename" },
  { id: "show", label: "Show" },
  { id: "export", label: "Export" },
  { id: "ping", label: "Ping" },
  { id: "doctor", label: "Doctor" },
  { id: "plugin", label: "Plugin" },
  { id: "configuration", label: "Configuration" },
  { id: "shell-completion", label: "Shell Completion" },
  { id: "requirements", label: "Requirements" },
] as const;

export default function SidebarNav() {
  return (
    <nav
      aria-label="Documentation sections"
      className="hidden lg:block w-56 shrink-0"
    >
      <ol className="sticky top-20 list-none space-y-1">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="nav-link block rounded px-3 py-1.5 text-sm leading-snug text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]"
            >
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
