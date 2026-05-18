import { createFileRoute } from "@tanstack/react-router";

import Layout from "#/components/Layout";
import CommandSection from "#/components/docs/CommandSection";
import SidebarNav from "#/components/docs/SidebarNav";
import {
  quickStartDemo,
  addDemo,
  connectDemo,
  listDemo,
  exportDemo,
} from "#/components/docs/terminal-demos";
import Terminable from "#/components/ui/Terminable";
import type { CommandEntry } from "#/components/ui/Terminable";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — sshm0" },
      {
        name: "description",
        content:
          "Complete CLI reference for sshm0. Installation, commands, flags, and examples for every subcommand.",
      },
    ],
  }),
  component: Docs,
});

const cpDemo: CommandEntry[] = [
  {
    prompt: "sshm0 cp ./localfile.conf web1:/etc/myapp/config.conf",
    output: "Copying ./localfile.conf -> web1:/etc/myapp/config.conf",
    typingSpeed: 35,
    delay: 800,
  },
  {
    prompt: "sshm0 cp web1:/var/log/app.log ./app.log",
    output: "Copying web1:/var/log/app.log -> ./app.log",
    typingSpeed: 35,
    delay: 800,
  },
];

function Docs() {
  return (
    <Layout className="pt-20">
      <div className="mx-auto flex max-w-7xl gap-8">
        <SidebarNav />

        <div className="min-w-0 flex-1">
          <div className="prose prose-neutral max-w-none">
            {/* ── Installation ─────────────────────────────────────── */}
            <CommandSection id="installation" title="Installation">
              <p>
                Download and run the installer, then reload your shell:
              </p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>{`curl -s https://raw.githubusercontent.com/DimitriGilbert/sshm0/main/utils/get_sshm0 -O
chmod +x get_sshm0
./get_sshm0 --install
source ~/.bashrc`}</code>
              </pre>
              <p>
                The installer clones the repo and appends shell integration to
                your bashrc. Run{" "}
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                  ./get_sshm0 --help
                </code>{" "}
                for other options (custom directory, SSH clone, specific
                branch).
              </p>
              <p className="mb-0">Manual install:</p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>{`git clone https://github.com/DimitriGilbert/sshm0.git
cd sshm0
echo 'export SSHM0_ROOT_DIR="$(pwd)"' >> ~/.bashrc
echo 'source "$(pwd)/sshm0.rc"' >> ~/.bashrc
source ~/.bashrc`}</code>
              </pre>
            </CommandSection>

            {/* ── Quick Start ──────────────────────────────────────── */}
            <CommandSection id="quick-start" title="Quick Start">
              <p>
                Add a server and connect. That's it.
              </p>
              <Terminable
                commands={quickStartDemo}
                titleBarVariant="macos"
                title="terminal"
                height="min-h-[180px] max-h-[320px]"
              />
              <p className="mb-0">
                You can also tag servers and filter them later:
              </p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>{`sshm0 add staging 10.0.0.5 root --auth password --password secret --port 2222
sshm0 connect staging

sshm0 add db1 db.example.com admin --tag production,database
sshm0 list --tag production --long`}</code>
              </pre>
            </CommandSection>

            {/* ── Add ──────────────────────────────────────────────── */}
            <CommandSection id="add" title="add">
              <p>
                Save a new server configuration. Run with no arguments for
                interactive mode — it prompts for each field.
              </p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>sshm0 add &lt;name&gt; &lt;ip&gt; &lt;user&gt; [options]</code>
              </pre>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Flag</th>
                    <th className="text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td>
                      <code>-p, --password</code>
                    </td>
                    <td>Password for the server</td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <code>-i, --key</code>
                    </td>
                    <td>Path to SSH private key</td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <code>-a, --auth</code>
                    </td>
                    <td>Auth type: key or password</td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <code>-P, --port</code>
                    </td>
                    <td>SSH port (default: 22)</td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <code>-t, --tag</code>
                    </td>
                    <td>Comma-separated tags</td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <code>-f, --force</code>
                    </td>
                    <td>Overwrite if server exists</td>
                  </tr>
                  <tr>
                    <td>
                      <code>-c, --connect</code>
                    </td>
                    <td>Connect immediately after adding</td>
                  </tr>
                </tbody>
              </table>
              <Terminable
                commands={addDemo}
                titleBarVariant="macos"
                title="terminal"
                height="min-h-[180px] max-h-[320px]"
              />
            </CommandSection>

            {/* ── Connect ──────────────────────────────────────────── */}
            <CommandSection id="connect" title="connect">
              <p>Open an SSH session to a saved server.</p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>{`sshm0 connect <name> [--cd <dir>] [--exec-before <cmd>] [command...]`}</code>
              </pre>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Flag</th>
                    <th className="text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td>
                      <code>--cd</code>
                    </td>
                    <td>Remote directory to cd into</td>
                  </tr>
                  <tr>
                    <td>
                      <code>--exec-before</code>
                    </td>
                    <td>Command(s) to run before shell (repeatable)</td>
                  </tr>
                </tbody>
              </table>
              <p className="mb-0">
                Trailing arguments are passed as the remote command.
              </p>
              <Terminable
                commands={connectDemo}
                titleBarVariant="macos"
                title="terminal"
                height="min-h-[200px] max-h-[360px]"
              />
            </CommandSection>

            {/* ── cp ────────────────────────────────────────────────── */}
            <CommandSection id="cp" title="cp">
              <p>
                Copy files between local and remote. Uses scp under the hood.
                Prefix server paths with{" "}
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                  &lt;name&gt;:
                </code>
                .
              </p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>sshm0 cp &lt;source&gt; &lt;destination&gt;</code>
              </pre>
              <Terminable
                commands={cpDemo}
                titleBarVariant="macos"
                title="terminal"
                height="min-h-[160px] max-h-[300px]"
              />
            </CommandSection>

            {/* ── List ──────────────────────────────────────────────── */}
            <CommandSection id="list" title="list">
              <p>Show saved servers. Filter by tag or name.</p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>sshm0 list [options]</code>
              </pre>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Flag</th>
                    <th className="text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td>
                      <code>-t, --tag</code>
                    </td>
                    <td>Filter by tag</td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <code>-f, --filter</code>
                    </td>
                    <td>Filter by name (case-insensitive substring)</td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <code>-l, --long</code>
                    </td>
                    <td>Show IP, user, and tags</td>
                  </tr>
                  <tr>
                    <td>
                      <code>-r, --recent</code>
                    </td>
                    <td>Sort by last connected</td>
                  </tr>
                </tbody>
              </table>
              <Terminable
                commands={listDemo}
                titleBarVariant="macos"
                title="terminal"
                height="min-h-[240px] max-h-[420px]"
              />
            </CommandSection>

            {/* ── Edit ──────────────────────────────────────────────── */}
            <CommandSection id="edit" title="edit">
              <p>Change fields on a saved server.</p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>sshm0 edit &lt;name&gt; [options]</code>
              </pre>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Flag</th>
                    <th className="text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td>
                      <code>--ip</code>
                    </td>
                    <td>New IP address</td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <code>--user</code>
                    </td>
                    <td>New username</td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <code>-p, --password</code>
                    </td>
                    <td>New password</td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <code>-i, --key</code>
                    </td>
                    <td>New key path</td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <code>--auth</code>
                    </td>
                    <td>New auth type</td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <code>--port</code>
                    </td>
                    <td>New port</td>
                  </tr>
                  <tr className="border-b">
                    <td>
                      <code>-t, --tag</code>
                    </td>
                    <td>New tags</td>
                  </tr>
                  <tr>
                    <td>
                      <code>-c, --connect</code>
                    </td>
                    <td>Connect after editing</td>
                  </tr>
                </tbody>
              </table>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>{`sshm0 edit web1 --port 2222
sshm0 edit web1 --user deploy --tag prod,web`}</code>
              </pre>
            </CommandSection>

            {/* ── Remove ────────────────────────────────────────────── */}
            <CommandSection id="remove" title="remove">
              <p>Delete a saved server.</p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>sshm0 remove &lt;name&gt;</code>
              </pre>
            </CommandSection>

            {/* ── Rename ────────────────────────────────────────────── */}
            <CommandSection id="rename" title="rename">
              <p>Rename a saved server.</p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>sshm0 rename &lt;old_name&gt; &lt;new_name&gt;</code>
              </pre>
            </CommandSection>

            {/* ── Show ──────────────────────────────────────────────── */}
            <CommandSection id="show" title="show">
              <p>
                Display the full stored configuration for a server.
              </p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>sshm0 show &lt;name&gt;</code>
              </pre>
            </CommandSection>

            {/* ── Export ────────────────────────────────────────────── */}
            <CommandSection id="export" title="export">
              <p>
                Generate a standard SSH config file from all managed servers.
                Key-auth servers include{" "}
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                  IdentityFile
                </code>
                ; password-auth servers get a comment noting to use{" "}
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                  sshm0 connect
                </code>
                .
              </p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>sshm0 export [options]</code>
              </pre>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Flag</th>
                    <th className="text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td>
                      <code>-o, --output</code>
                    </td>
                    <td>
                      Output file path (default:{" "}
                      <code>~/.ssh/config.d/sshm0</code>)
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>--merge</code>
                    </td>
                    <td>Append instead of overwriting</td>
                  </tr>
                </tbody>
              </table>
              <Terminable
                commands={exportDemo}
                titleBarVariant="macos"
                title="terminal"
                height="min-h-[240px] max-h-[420px]"
              />
              <p className="mb-0">
                Include it in your main SSH config:
              </p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>Include config.d/*</code>
              </pre>
            </CommandSection>

            {/* ── Ping ──────────────────────────────────────────────── */}
            <CommandSection id="ping" title="ping">
              <p>Test SSH connectivity to a managed server.</p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>sshm0 ping &lt;name&gt;</code>
              </pre>
            </CommandSection>

            {/* ── Doctor ────────────────────────────────────────────── */}
            <CommandSection id="doctor" title="doctor">
              <p>
                Run self-test checks on the sshm0 environment — verifies config
                directory, server files, and required tools.
              </p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>sshm0 doctor</code>
              </pre>
            </CommandSection>

            {/* ── Plugin ────────────────────────────────────────────── */}
            <CommandSection id="plugin" title="plugin">
              <p>
                Run a registered plugin. Plugins are external scripts declared
                in the config file.
              </p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>sshm0 plugin &lt;plugin_name&gt; [arguments]</code>
              </pre>
            </CommandSection>

            {/* ── Configuration ─────────────────────────────────────── */}
            <CommandSection id="configuration" title="Configuration">
              <p>
                All config lives in{" "}
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                  ~/.config/sshm0/
                </code>{" "}
                by default. Override with{" "}
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                  --config-dir
                </code>{" "}
                on any command.
              </p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>{`~/.config/sshm0/
  config          # Global config (plugin declarations, version)
  servers/        # One file per server
  history         # Connection timestamps`}</code>
              </pre>

              <h3>Server config format</h3>
              <p>
                Each server is a file in{" "}
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                  servers/
                </code>{" "}
                named after the server. Contents are shell variables:
              </p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>{`sshm0_server_ip=192.168.1.25
sshm0_server_user=deploy
sshm0_server_port=22
sshm0_server_auth=key
sshm0_server_password=
sshm0_server_key=/home/you/.ssh/id_rsa
sshm0_server_cd=
sshm0_server_exec_before=()
sshm0_server_tags=(production web)`}</code>
              </pre>

              <h3>Global config</h3>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>{`sshm0_config_version=2
declare -A sshm0_plugins
# sshm0_plugins["myplugin"]="/path/to/plugin/script"`}</code>
              </pre>

              <h3>Plugins</h3>
              <p>
                Plugins receive{" "}
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                  $SSHM0_CONFIG_DIR
                </code>{" "}
                and{" "}
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                  $SSHM0_ROOT_DIR
                </code>{" "}
                as environment variables. Register them in{" "}
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                  ~/.config/sshm0/config
                </code>
                :
              </p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>{`sshm0_plugins["backup"]="/usr/local/bin/sshm0-backup"`}</code>
              </pre>
              <p className="mb-0">Then run:</p>
              <pre className="not-prose overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
                <code>sshm0 plugin backup --all</code>
              </pre>
              <p>
                Plugin scripts can be written in any language.{" "}
                <a
                  href="https://github.com/DimitriGilbert/parseArger"
                  className="text-[var(--sea-ink-soft)] underline hover:text-[var(--sea-ink)]"
                >
                  parseArger
                </a>{" "}
                can generate the argument parsing for Bash plugins.
              </p>
            </CommandSection>

            {/* ── Shell Completion ──────────────────────────────────── */}
            <CommandSection id="shell-completion" title="Shell Completion">
              <p>
                sshm0 ships with{" "}
                <a
                  href="https://github.com/DannyBen/completely"
                  className="text-[var(--sea-ink-soft)] underline hover:text-[var(--sea-ink)]"
                >
                  completely
                </a>
                -based Bash completion. The installer sources{" "}
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                  sshm0.rc
                </code>
                , which loads{" "}
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                  completely.bash
                </code>
                . This provides tab completion for:
              </p>
              <ul>
                <li>All subcommands</li>
                <li>Server names (from your config)</li>
                <li>SSH key paths</li>
                <li>Flags and options</li>
              </ul>
              <p className="mb-0">
                No additional setup required after installation.
              </p>
            </CommandSection>

            {/* ── Requirements ──────────────────────────────────────── */}
            <CommandSection id="requirements" title="Requirements">
              <ul>
                <li>
                  Bash 4.0+ (uses associative arrays)
                </li>
                <li>
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                    ssh
                  </code>{" "}
                  /{" "}
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                    scp
                  </code>
                </li>
                <li>
                  Standard Unix tools (
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                    date
                  </code>
                  ,{" "}
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                    mktemp
                  </code>
                  ,{" "}
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                    setsid
                  </code>
                  )
                </li>
              </ul>
            </CommandSection>
          </div>
        </div>
      </div>
    </Layout>
  );
}
