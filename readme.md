# sshm0

A CLI SSH connection manager. Store server configs, connect by name, copy files, organize with tags, export to `~/.ssh/config`. Pronounced "ssshhmeu" (like the Nexø rocket) or "ssshhmoo" — your pick.

Built with [parseArger](https://github.com/DimitriGilbert/parseArger).

## Features

- Add/edit/remove/rename servers by name
- Connect with a single command (`sshm0 connect <name>`)
- Copy files via scp wrapper (`sshm0 cp`)
- Sync files via rsync wrapper (`sshm0 rsync`)
- Interactive mode — run `sshm0 add` with no args for a prompt
- Tag servers and filter by tag
- Connection history with `--recent` sort
- Export all servers to SSH config format
- Import servers from SSH config (`sshm0 import`)
- Tags listing with `sshm0 tags`
- Connection history with `sshm0 history`
- Global config management with `sshm0 config`
- Server groups for organization
- Per-server connection timeout
- SSH ProxyJump / bastion host support
- Backup and restore (`sshm0 backup`)
- Execute commands on multiple servers (`sshm0 exec`)
- Self-update command (`sshm0 update`)
- Password encryption at rest (openssl)
- Zsh completion support
- Ping connectivity check
- Doctor self-test for environment issues
- Input validation on add/edit
- Plugin system for extending functionality
- Tab completion for Bash and Zsh
- Key and password authentication
- Run remote commands or `cd` before shell starts
- Custom config directory via `--config-dir`

## Installation

```bash
curl -s https://raw.githubusercontent.com/DimitriGilbert/sshm0/main/utils/get_sshm0 -O
chmod +x get_sshm0
./get_sshm0 --install
source ~/.bashrc
```

The installer clones the repo and appends shell integration to your bashrc. Run `./get_sshm0 --help` for other options (custom directory, SSH clone, specific branch).

Manual install:

```bash
git clone https://github.com/DimitriGilbert/sshm0.git
cd sshm0
echo "export SSHM0_ROOT_DIR=\"$(pwd)\"" >> ~/.bashrc
echo "source \"$(pwd)/sshm0.rc\"" >> ~/.bashrc
source ~/.bashrc
```

## Quick Start

```bash
sshm0 add web1 192.168.1.25 deploy --auth key --key ~/.ssh/id_rsa
sshm0 connect web1

sshm0 add staging 10.0.0.5 root --auth password --password secret --port 2222
sshm0 connect staging

sshm0 add db1 db.example.com admin --tag production,database --group production
sshm0 list --tag production --long
```

## Usage

```
sshm0 <command> [--config-dir <path>] [arguments]
```

### add

```bash
sshm0 add <name> <ip> <user> [options]
```

| Flag | Description |
|------|-------------|
| `-p, --password` | Password for the server |
| `-i, --key` | Path to SSH private key |
| `-a, --auth` | Auth type: `key` or `password` |
| `-P, --port` | SSH port (default: 22) |
| `-t, --tag` | Comma-separated tags |
| `-g, --group` | Server group |
| `-J, --proxy` | ProxyJump server name (bastion host) |
| `--timeout` | Connection timeout in seconds (default: 10) |
| `-f, --force` | Overwrite if server exists |
| `-c, --connect` | Connect immediately after adding |

Run `sshm0 add` with no arguments for interactive mode — it will prompt for each field.

```bash
sshm0 add web1 192.168.1.25 deploy --auth key --key ~/.ssh/id_ed25519
sshm0 add web1 192.168.1.25 deploy --force
sshm0 add db db.example.com admin --port 3306 --tag prod,db --group production -c
sshm0 add bastion 10.0.0.1 jumpuser --proxy gateway
```

### connect

```bash
sshm0 connect <name> [--cd <dir>] [--exec-before <cmd>] [command...]
```

| Flag | Description |
|------|-------------|
| `--cd` | Remote directory to cd into |
| `--exec-before` | Command(s) to run before shell (repeatable) |

Any trailing arguments are passed as the remote command.

```bash
sshm0 connect web1
sshm0 connect web1 --cd /var/log
sshm0 connect web1 ls -la /tmp
sshm0 connect web1 --exec-before "mkdir -p /opt/deploy" --cd /opt/deploy
```

### cp

```bash
sshm0 cp <source> <destination>
```

Uses scp under the hood. Prefix server paths with `<name>:`:

```bash
sshm0 cp ./localfile.conf web1:/etc/myapp/config.conf
sshm0 cp web1:/var/log/app.log ./app.log
```

### rsync

```bash
sshm0 rsync <source> <destination> [rsync-options]
```

Uses rsync under the hood with `-avz` defaults. Prefix server paths with `<name>:`. Any trailing arguments are passed to rsync.

```bash
sshm0 rsync ./src pi:~/project/src
sshm0 rsync pi:~/project/src ./src --exclude node_modules
sshm0 rsync . pi:~/project --exclude node_modules/.cache --delete
```

### list

```bash
sshm0 list [options]
```

| Flag | Description |
|------|-------------|
| `-t, --tag` | Filter by tag |
| `-f, --filter` | Filter by name (case-insensitive substring) |
| `-l, --long` | Show IP, user, and tags |
| `-r, --recent` | Sort by last connected |
| `-g, --group` | Filter by group |
| `--tree` | Show servers organized by groups |

```bash
sshm0 list
sshm0 list --long
sshm0 list --tag production --long
sshm0 list --filter web --recent
sshm0 list --group production --tree
```

### edit

```bash
sshm0 edit <name> [options]
```

| Flag | Description |
|------|-------------|
| `--ip` | New IP address |
| `--user` | New username |
| `-p, --password` | New password |
| `-i, --key` | New key path |
| `--auth` | New auth type |
| `--port` | New port |
| `-t, --tag` | New tags |
| `-g, --group` | New group |
| `-J, --proxy` | ProxyJump server name |
| `--timeout` | Connection timeout |
| `-c, --connect` | Connect after editing |

```bash
sshm0 edit web1 --port 2222
sshm0 edit web1 --user deploy --tag prod,web --group production
sshm0 edit web1 --proxy bastion --timeout 30
```

### remove

```bash
sshm0 remove <name> [-y]
```

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip confirmation prompt |

### rename

```bash
sshm0 rename <old_name> <new_name>
```

### show

```bash
sshm0 show <name>
```

Displays the full stored configuration for a server.

### export

```bash
sshm0 export [options]
```

| Flag | Description |
|------|-------------|
| `-o, --output` | Output file path (default: `~/.ssh/config.d/sshm0`) |
| `--merge` | Append instead of overwriting |

Generates a standard SSH config file from all managed servers. Key-auth servers include `IdentityFile`; password-auth servers get a comment noting to use `sshm0 connect`.

```bash
sshm0 export
sshm0 export -o ~/.ssh/config --merge
```

Include it in your main SSH config:

```
Include config.d/*
```

### import

```bash
sshm0 import [options]
```

| Flag | Description |
|------|-------------|
| `-f, --file` | Input SSH config file (default: `~/.ssh/config`) |
| `--force` | Overwrite existing servers without asking |
| `--dry-run` | Preview what would be imported without writing files |
| `-t, --tag` | Tags to add to all imported servers |

Imports server entries from a standard SSH config file into sshm0.

```bash
sshm0 import
sshm0 import --file ~/.ssh/config --tag imported --dry-run
sshm0 import --force
```

### ping

```bash
sshm0 ping <name>
```

Tests SSH connectivity to a managed server.

### doctor

```bash
sshm0 doctor
```

Runs self-test checks on the sshm0 environment — verifies config directory, server files, required tools, and optional tools (openssl for password encryption).

### tags

```bash
sshm0 tags [options]
```

| Flag | Description |
|------|-------------|
| `-l, --long` | Show servers under each tag |

Lists all tags across your servers with counts.

```bash
sshm0 tags
sshm0 tags --long
```

### history

```bash
sshm0 history [options]
```

| Flag | Description |
|------|-------------|
| `-n, --count` | Limit number of entries (default: 20) |
| `-s, --server` | Filter by server name |

Shows connection history with timestamps.

```bash
sshm0 history
sshm0 history --count 5
sshm0 history --server web1
```

### config

```bash
sshm0 config [action] [key] [value]
```

Actions: `list`, `get`, `set`, `plugins`

```bash
sshm0 config list
sshm0 config get version
sshm0 config set default_timeout 15
sshm0 config plugins
```

### backup

```bash
sshm0 backup [options]
```

| Flag | Description |
|------|-------------|
| `-o, --output` | Custom output path for backup file |
| `--restore` | Path to backup file to restore from |
| `-y, --yes` | Skip confirmation prompt for restore |

Creates a tarball of your config directory, or restores from a previous backup.

```bash
sshm0 backup
sshm0 backup --output /tmp/sshm0-backup.tar.gz
sshm0 backup --restore /tmp/sshm0-backup.tar.gz
sshm0 backup --restore /tmp/sshm0-backup.tar.gz -y
```

### exec

```bash
sshm0 exec <servers> [options] -- <command>
```

| Flag | Description |
|------|-------------|
| `-t, --tag` | Run on all servers with this tag |
| `-g, --group` | Run on all servers in this group |
| `-p, --parallel` | Run in parallel |
| `-y, --yes` | Skip confirmation prompt |
| `--timeout` | Per-command timeout in seconds (default: 30) |

Execute a command on one or more servers. Use comma-separated names or `all`.

```bash
sshm0 exec web1,web2 -- uptime
sshm0 exec all -- df -h
sshm0 exec all --tag production --parallel -- uptime
sshm0 exec web1 --timeout 60 -- "apt update && apt upgrade -y"
```

### update

```bash
sshm0 update [options]
```

| Flag | Description |
|------|-------------|
| `-c, --check` | Only check for updates, do not update |
| `-f, --force` | Force reinstall to latest |

```bash
sshm0 update --check
sshm0 update
sshm0 update --force
```

### plugin

```bash
sshm0 plugin <plugin_name> [arguments]
```

Runs a registered plugin. Plugins are external scripts declared in the config file.

## Configuration

All config lives in `~/.config/sshm0/` by default. Override with `--config-dir` on any command.

```
~/.config/sshm0/
  config          # Global config (plugin declarations, version)
  servers/        # One file per server
  history         # Connection timestamps
```

### Server config format

Each server is a file in `servers/` named after the server. Contents are shell variables:

```bash
sshm0_server_ip=192.168.1.25
sshm0_server_user=deploy
sshm0_server_port=22
sshm0_server_auth=key
sshm0_server_password=
sshm0_server_key=/home/you/.ssh/id_rsa
sshm0_server_cd=
sshm0_server_exec_before=()
sshm0_server_tags=(production web)
sshm0_server_group=production
sshm0_server_timeout=10
sshm0_server_proxy=bastion
```

### Global config

```bash
sshm0_config_version=2
declare -A sshm0_plugins
# sshm0_plugins["myplugin"]="/path/to/plugin/script"
```

### Plugins

Plugins are scripts that receive `$SSHM0_CONFIG_DIR` and `$SSHM0_ROOT_DIR` as environment variables. Register them in `~/.config/sshm0/config`:

```bash
sshm0_plugins["backup"]="/usr/local/bin/sshm0-backup"
```

Then run:

```bash
sshm0 plugin backup --all
```

The plugin script can be written in any language. [parseArger](https://github.com/DimitriGilbert/parseArger) can generate the argument parsing for Bash plugins.

## Shell Completion

sshm0 ships with [completely](https://github.com/DannyBen/completely)-based Bash completion and native Zsh completion. The installer sources `sshm0.rc`, which detects your shell and loads the appropriate completion file. This provides tab completion for:

- All subcommands
- Server names (from your config)
- SSH key paths
- Flags and options

No additional setup required after installation.

## Requirements

- Bash 4.0+ (uses associative arrays)
- `ssh` / `scp` / `rsync`
- Standard Unix tools (`date`, `mktemp`, `setsid`)
- `openssl` (optional, for password encryption at rest)
