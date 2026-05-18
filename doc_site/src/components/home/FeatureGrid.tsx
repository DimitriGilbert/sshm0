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
    <section className="mt-16">
      <h2 className="display-title mb-8 text-2xl font-bold text-[var(--sea-ink)]">
        What it does
      </h2>
      <div className="columns-1 md:columns-2 gap-12">
        {FEATURES.map((feature) => (
          <article key={feature.title} className="break-inside-avoid mb-7">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="inline-block h-px w-5 flex-shrink-0 bg-[var(--lagoon)]" />
              <h3 className="text-sm font-semibold text-[var(--sea-ink)]">
                {feature.title}
              </h3>
            </div>
            <p className="m-0 pl-8 text-sm leading-relaxed text-[var(--sea-ink-soft)]">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
