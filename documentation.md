# Usage

## sshm0

```
sshM0: A CLI ssh manager:
	target: what to do [one of 'list' 'add' 'config' 'connect' 'cp' 'edit' 'export' 'import' 'plugin' 'remove' 'rename' 'show' 'ping' 'rsync' 'doctor' 'history' 'tags' 'backup' 'exec' 'update']
	--config-dir <config-dir>: directory containing the configurations [default: ' $HOME/.config/sshm0 ']
Usage :
	sshm0 <target> [--config-dir <value>]
```

## sshm0 list

```
list servers:
	-t, --tag <tag>: filter by tag
	-f, --filter <filter>: filter by name pattern
	-l|--long|--no-long: show extended info
	-r|--recent|--no-recent: show recently connected servers first
	-g, --group <group>: filter by group
	--tree|--no-tree: show servers organized by groups
Usage :
	sshm0 list [--tag <value>] [--filter <value>] [--group <value>] [--[no-]long] [--[no-]recent] [--[no-]tree]
```

## sshm0 add

```
add a server:
	name: server name
	ip: ip address
	user: username
	-p, --password|--pass|--pwd <password>: user password for the server
	-i, --key <key>: ssh private key
	-a, --auth <auth>: authentication type [one of '' 'key' 'password']
	-P, --port <port>: ssh port [default: ' 22 ']
	-f|--force|--no-force: force overwrite if server exists
	-c|--connect|--no-connect: connect to server
	-t, --tag <tag>: comma-separated tags
	-J, --proxy <proxy>: proxy jump server name
	--timeout <timeout>: connection timeout in seconds [default: ' 10 ']
	-g, --group <group>: server group
Usage :
	sshm0 add <name> <ip> <user> [--password <value>] [--key <value>] [--auth <value>] [--port <value>] [--tag <value>] [--group <value>] [--proxy <value>] [--timeout <value>] [--[no-]force] [--[no-]connect]
```

## sshm0 connect

```
connect to a server:
	name: server name
	--cd <cd>: cd to directory
	--exec-before <exec-before>: commands to execute before the shell, repeatable
Usage :
	sshm0 connect <name> [--cd <value>] [--exec-before <value>]
```

## sshm0 cp

```
scp:
	src: source
	dest: destination
Usage :
	sshm0 cp <src> <dest>
```

## sshm0 rsync

```
rsync:
	src: source
	dest: destination
Usage :
	sshm0 rsync <src> <dest> [rsync-options]
```

## sshm0 edit

```
edit a server:
	name: server name
	--ip <ip>: ip address
	--user <user>: username
	-p, --password <password>: user password for the server
	-i, --key <key>: ssh private key
	--auth <auth>: authentication type [one of '' 'key' 'password']
	--port <port>: ssh port
	-c|--connect|--no-connect: connect to server
	-t, --tag <tag>: comma-separated tags
	-J, --proxy <proxy>: proxy jump server name
	--timeout <timeout>: connection timeout in seconds
	-g, --group <group>: server group
Usage :
	sshm0 edit <name> [--ip <value>] [--user <value>] [--password <value>] [--key <value>] [--auth <value>] [--port <value>] [--tag <value>] [--group <value>] [--proxy <value>] [--timeout <value>] [--[no-]connect]
```

## sshm0 plugin

```
run a plugin:
	plugin: plugin to execute: 
Usage :
	sshm0 plugin <plugin>
```

## sshm0 remove

```
remove a server:
	name: server name
	-y|--yes|--no-yes: skip confirmation prompt
Usage :
	sshm0 remove <name> [--[no-]yes]
```

## sshm0 rename

```
rename a server:
	old_name: current server name
	new_name: new server name
Usage :
	sshm0 rename <old_name> <new_name>
```

## sshm0 show

```
show a server's configuration:
	name: server name
Usage :
	sshm0 show <name>
```

## sshm0 export

```
export SSH config for all managed servers:
	-o, --output <output>: output file path [default: '$HOME/.ssh/config.d/sshm0']
	--merge|--no-merge: append to file instead of overwriting
Usage :
	sshm0 export [--output <value>] [--[no-]merge]
```

## sshm0 import

```
import servers from SSH config file:
	-f, --file <file>: input SSH config file path [default: '$HOME/.ssh/config']
	--force|--no-force: overwrite existing servers without asking
	--dry-run|--no-dry-run: preview what would be imported without writing files
	-t, --tag <tag>: comma-separated tags to add to all imported servers
Usage :
	sshm0 import [--file <value>] [--[no-]force] [--[no-]dry-run] [--tag <value>]
```

## sshm0 ping

```
test SSH connectivity to a server:
	name: server name
Usage :
	sshm0 ping <name>
```

## sshm0 doctor

```
run self-test checks on the sshm0 environment:
Usage :
	sshm0 doctor
```

## sshm0 tags

```
list all tags with counts:
	-l|--long|--no-long: show servers under each tag
Usage :
	sshm0 tags [--[no-]long]
```

## sshm0 history

```
show connection history:
	-n, --count <count>: limit number of entries
	-s, --server <server>: filter by server name
Usage :
	sshm0 history [--count <value>] [--server <value>]
```

## sshm0 config

```
view and edit global configuration:
	action: action to perform [one of 'list' 'get' 'set' 'plugins']
	key: config key (for get/set)
	value: config value (for set)
Usage :
	sshm0 config [action] [key] [value]
```

## sshm0 backup

```
backup and restore configuration:
	-o, --output <output>: custom output path for backup file
	--restore <restore>: path to backup file to restore from
	-y|--yes|--no-yes: skip confirmation prompt for restore
Usage :
	sshm0 backup [--output <value>] [--restore <value>] [--[no-]yes]
```

## sshm0 exec

```
execute a command on one or more servers:
	servers: comma-separated server names, or 'all'
	-t, --tag <tag>: run on all servers with this tag
	-g, --group <group>: run on all servers in this group
	-p|--parallel|--no-parallel: run in parallel
	-y|--yes|--no-yes: skip confirmation prompt
	--timeout <timeout>: per-command timeout in seconds [default: ' 30 ']
Usage :
	sshm0 exec <servers> [--tag <value>] [--group <value>] [--timeout <value>] [--[no-]parallel] [--[no-]yes] -- <command>
```

## sshm0 update

```
update sshm0 to the latest version:
	-c|--check|--no-check: only check for updates, do not update
	-f|--force|--no-force: force reinstall to latest
Usage :
	sshm0 update [--[no-]check] [--[no-]force]
```
