# Usage

## sshm0

```
sshM0: A CLI ssh manager:
	target: what to do [one of 'list' 'add' 'edit' 'connect' 'remove' 'plugin' 'cp' 'cp']
	--config-dir <config-dir>: directory containing the configurations [default: ' $HOME/.config/sshm0 ']
Usage :
	sshm0 <target> [--config-dir <value>]
```

## sshm0 list

```
sshm0 sub command help
	
```

## sshm0 add

```
sshm0 sub command help
	
add a server:
	name: server name
	ip: ip address
	user: username
	-p, --password <password>: user password for the server
	-i, --key <key>: ssh private key
	--auth <auth>: authentication type [one of '' 'key' 'password']
	--port <port>: ssh port [default: ' 22 ']
	-f|--force|--no-force: force overwrite if server exists
Usage :
	sshm0 add <name> <ip> <user> [--password <value>] [--key <value>] [--auth <value>] [--port <value>] [--[no-]force]
```

## sshm0 edit

```
sshm0 sub command help
	
add a server:
	name: server name
	--ip <ip>: ip address
	--user <user>: username
	-p, --password <password>: user password for the server
	-i, --key <key>: ssh private key
	--auth <auth>: authentication type [one of '' 'key' 'password']
	--port <port>: ssh port
Usage :
	sshm0 edit <name> [--ip <value>] [--user <value>] [--password <value>] [--key <value>] [--auth <value>] [--port <value>]
```

## sshm0 connect

```
sshm0 sub command help
	
connect to a server:
	name: server name
	--cd <cd>: cd to directory
	--exec-before <exec-before>: commands to execute before the shell, repeatable
Usage :
	sshm0 connect <name> [--cd <value>] [--exec-before <value>]
```

## sshm0 remove

```
sshm0 sub command help
	
remove a server:
	name: server name
Usage :
	sshm0 remove <name>
```

## sshm0 plugin

```
sshm0 sub command help
	
run a plugin:
	plugin: plugin to execute: 
Usage :
	sshm0 plugin <plugin>
```

## sshm0 cp

```
sshm0 sub command help
	
scp:
	src: source
	dest: destination
Usage :
	sshm0 cp <src> <dest>
```

## sshm0 cp

```
sshm0 sub command help
	
scp:
	src: source
	dest: destination
Usage :
	sshm0 cp <src> <dest>
```


