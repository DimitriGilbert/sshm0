# SSHM0 command documentation

## ./sshm0

```
sshM0: A CLI ssh manager:
	target: what to do [one of 'list' 'add' 'edit' 'connect' 'remove' 'plugin' 'cp']
	--config-dir <config-dir>: directory containing the configurations [default: ' /home/didi/.config/sshm0 ']
Usage :
	./sshm0 <target> [--config-dir <value>]
```

## ./bin

### ./bin/add

```
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
	./bin/add <name> <ip> <user> [--password <value>] [--key <value>] [--auth <value>] [--port <value>] [--[no-]force]
```

### ./bin/connect

```
connect to a server:
	name: server name
	--cd <cd>: cd to directory
	--exec-before <exec-before>: commands to execute before the shell, repeatable
Usage :
	./bin/connect <name> [--cd <value>] [--exec-before <value>]
```

### ./bin/cp

```
scp:
	src: source
	dest: destination
Usage :
	./bin/cp <src> <dest>
```

### ./bin/edit

```
add a server:
	name: server name
	--ip <ip>: ip address
	--user <user>: username
	-p, --password <password>: user password for the server
	-i, --key <key>: ssh private key
	--auth <auth>: authentication type [one of '' 'key' 'password']
	--port <port>: ssh port
Usage :
	./bin/edit <name> [--ip <value>] [--user <value>] [--password <value>] [--key <value>] [--auth <value>] [--port <value>]
```

### ./bin/plugin

```
run a plugin:
	plugin: plugin to execute: 
Usage :
	./bin/plugin <plugin>
```

### ./bin/remove

```
remove a server:
	name: server name
Usage :
	./bin/remove <name>
```


