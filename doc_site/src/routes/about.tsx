import { createFileRoute } from '@tanstack/react-router'

import Layout from '#/components/Layout'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About — sshm0' },
      {
        name: 'description',
        content:
          'sshm0 is a lightweight SSH connection manager written in pure Bash. No daemons, no dependencies — just a config directory and a short memory.',
      },
    ],
  }),
  component: About,
})

function About() {
  return (
    <Layout className="py-12">
      <section className="island-shell mx-auto max-w-3xl rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">About</p>
        <h1 className="display-title mb-6 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          One command. One file per server.
        </h1>

        <div className="space-y-5 text-base leading-8 text-[var(--sea-ink-soft)]">
          <p>
            sshm0 is a command-line SSH connection manager built in pure Bash.
            You save servers with a name, an IP, and whatever auth details you
            need. After that, <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">sshm0 connect
            web1</code> drops you into a shell. No more digging through notes
            for that one IP address you use twice a month.
          </p>

          <p>
            The whole thing is just Bash scripts and plain-text config files —
            one file per server in <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">~/.config/sshm0/servers/</code>.
            There is no daemon running, no database, and nothing installed
            outside of your home directory. If you know your way around a
            terminal, you already know how to inspect, back up, or edit your
            config by hand.
          </p>

          <p>
            Argument parsing is handled by{' '}
            <a
              href="https://github.com/DimitriGilbert/parseArger"
              className="text-[var(--sea-ink-soft)] underline hover:text-[var(--sea-ink)]"
            >
              parseArger
            </a>
            , a Bash-native argument parser that generates flag handling from a
            declarative spec. The rest — config management, SSH invocation,
            tab completion — is straightforward shell scripting with no
            external dependencies beyond <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">ssh</code> and
            standard Unix tools.
          </p>

          <p>
            The source code lives on{' '}
            <a
              href="https://github.com/DimitriGilbert/sshm0"
              className="text-[var(--sea-ink-soft)] underline hover:text-[var(--sea-ink)]"
            >
              GitHub
            </a>
            . Issues and pull requests are welcome.
          </p>
        </div>
      </section>
    </Layout>
  )
}
