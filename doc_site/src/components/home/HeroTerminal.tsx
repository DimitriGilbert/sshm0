import Terminable from '#/components/ui/Terminable'

import type { CommandEntry } from '#/components/ui/Terminable'

const DEMO_COMMANDS: CommandEntry[] = [
  {
    prompt: 'sshm0 add web1 192.168.1.25 deploy --auth key --key ~/.ssh/id_rsa',
    output: '\u2713 Server "web1" saved.',
    typingSpeed: 38,
    delay: 600,
  },
  {
    prompt: 'sshm0 add staging 10.0.0.5 root --auth password --port 2222',
    output: '\u2713 Server "staging" saved.',
    typingSpeed: 38,
    delay: 500,
  },
  {
    prompt: 'sshm0 list --long',
    output: [
      '  NAME       HOST           USER     AUTH      TAGS',
      '  staging    10.0.0.5       root     password',
      '  web1       192.168.1.25   deploy   key',
    ],
    typingSpeed: 42,
    delay: 500,
  },
  {
    prompt: 'sshm0 connect web1',
    output: 'Connecting to deploy@192.168.1.25...',
    typingSpeed: 42,
    delay: 400,
  },
]

export default function HeroTerminal() {
  return (
    <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
      <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />

      <p className="island-kicker mb-3">SSH Connection Manager</p>
      <h1 className="display-title mb-4 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
        Remember servers, not IP addresses.
      </h1>
      <p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
        Store your server configs. Connect by name. Copy files. Organize with
        tags. Export straight to ~/.ssh/config.
      </p>

      <Terminable
        commands={DEMO_COMMANDS}
        titleBarVariant="macos"
        title="terminal"
        height="min-h-[280px] max-h-[400px]"
        defaultTypingSpeed={38}
        commandDelay={700}
      />
    </section>
  )
}
