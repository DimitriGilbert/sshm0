const FEATURES = [
  {
    title: 'One Command Connect',
    description:
      'Run sshm0 connect name and you are in. No digging through notes or remembering IPs.',
  },
  {
    title: 'SCP Wrapper',
    description:
      'Copy files between local and remote with sshm0 cp. Uses the same server names you already defined.',
  },
  {
    title: 'Tag & Filter',
    description:
      'Assign tags to servers, then list or filter by tag. Keep production, staging, and dev separate.',
  },
  {
    title: 'SSH Config Export',
    description:
      'Export all managed servers to ~/.ssh/config. Works with any SSH client, no lock-in.',
  },
  {
    title: 'Interactive Mode',
    description:
      'Run sshm0 add with no arguments and answer prompts. No flags to memorize for quick setup.',
  },
  {
    title: 'Tab Completion',
    description:
      'Bash completion for commands, server names, and flags. Installed and sourced automatically.',
  },
]

export default function FeatureGrid() {
  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((feature, index) => (
        <article
          key={feature.title}
          className="island-shell feature-card rise-in rounded-2xl p-5"
          style={{ animationDelay: `${index * 90 + 80}ms` }}
        >
          <h2 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
            {feature.title}
          </h2>
          <p className="m-0 text-sm text-[var(--sea-ink-soft)]">
            {feature.description}
          </p>
        </article>
      ))}
    </section>
  )
}
