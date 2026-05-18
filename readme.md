# sshm0

A CLI SSH connection manager. Store server configs, connect by name, copy files, organize with tags, export to `~/.ssh/config`. Pronounced "ssshhmeu" (like the Nexø rocket) or "ssshhmoo" — your pick.

Built with [parseArger](https://github.com/DimitriGilbert/parseArger).

## Features

- Add/edit/remove/rename servers by name
- Connect with a single command (`sshm0 connect <name>`)
- Copy files via scp wrapper (`sshm0 cp`)
- Interactive mode — run `sshm0 add` with no args for a prompt
- Tag servers and filter by tag
- Connection history with `--recent` sort
- Export all servers to SSH config format
- Ping connectivity check
- Doctor self-test for environment issues
- Plugin system for extending functionality
- Tab completion for Bash
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

sshm0 add db1 db.example.com admin --tag production,database
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
| `-f, --force` | Overwrite if server exists |
| `-c, --connect` | Connect immediately after adding |

Run `sshm0 add` with no arguments for interactive mode — it will prompt for each field.

```bash
sshm0 add web1 192.168.1.25 deploy --auth key --key ~/.ssh/id_ed25519
sshm0 add web1 192.168.1.25 deploy --force
sshm0 add db db.example.com admin --port 3306 --tag prod,db -c
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

Uses scp under the hood. Prefix server paths with `<name>>`:

```bash
sshm0 cp ./localfile.conf web1:/etc/myapp/config.conf
sshm0 cp web1:/var/log/app.log ./app.log
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

```bash
sshm0 list
sshm0 list --long
sshm0 list --tag production --long
sshm0 list --filter web --recent
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
| `-c, --connect` | Connect after editing |

```bash
sshm0 edit web1 --port 2222
sshm0 edit web1 --user deploy --tag prod,web
```

### remove

```bash
sshm0 remove <name>
```

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

### ping

```bash
sshm0 ping <name>
```

Tests SSH connectivity to a managed server.

### doctor

```bash
sshm0 doctor
```

Runs self-test checks on the sshm0 environment — verifies config directory, server files, required tools.

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

sshm0 ships with [completely](https://github.com/DannyBen/completely)-based Bash completion. The installer sources `sshm0.rc`, which loads `completely.bash`. This provides tab completion for:

- All subcommands
- Server names (from your config)
- SSH key paths
- Flags and options

No additional setup required after installation.

## Requirements

- Bash 4.0+ (uses associative arrays)
- `ssh` / `scp`
- Standard Unix tools (`date`, `mktemp`, `setsid`)
