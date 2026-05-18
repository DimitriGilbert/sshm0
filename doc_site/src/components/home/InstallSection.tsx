import { Link } from '@tanstack/react-router'

import Terminable from '#/components/ui/Terminable'

import type { CommandEntry } from '#/components/ui/Terminable'

const INSTALL_COMMANDS: CommandEntry[] = [
  {
    prompt: 'curl -s https://raw.githubusercontent.com/DimitriGilbert/sshm0/main/utils/get_sshm0 -O',
    output: '',
    typingSpeed: 28,
    delay: 400,
  },
  {
    prompt: 'chmod +x get_sshm0',
    output: '',
    typingSpeed: 32,
    delay: 300,
  },
  {
    prompt: './get_sshm0 --install',
    output: 'Installed sshm0. Source your shell to get started.',
    typingSpeed: 32,
    delay: 400,
  },
  {
    prompt: 'source ~/.bashrc',
    output: '',
    typingSpeed: 32,
    delay: 300,
  },
]

export default function InstallSection() {
  return (
    <section className="mt-16 pb-4">
      <h2 className="mb-1 text-2xl font-bold text-[var(--sea-ink)]">
        Running in under a minute
      </h2>
      <p className="mb-5 text-sm leading-relaxed text-[var(--sea-ink-soft)]">
        Download the installer, run it, reload your shell. That is the whole
        process.
      </p>

      <Terminable
        commands={INSTALL_COMMANDS}
        titleBarVariant="macos"
        title="install"
        height="min-h-[180px] max-h-[300px]"
        defaultTypingSpeed={28}
        commandDelay={500}
      />

      <div className="mt-6">
        <Link
          to="/docs"
          className="text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:text-[#246f76]"
        >
          View full docs &rarr;
        </Link>
      </div>
    </section>
  )
}
