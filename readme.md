# sshm0 (ssh manager 0)

A simple CLI ssh server manager.

Prounouce "ssshhmeu" ( [like in the nexö rocket from Copenhagen Suborbital](https://copenhagensuborbitals.com/a-walkthrough-of-the-nexo-ii-rocket-part-i/) ) or "[ssshhmoo](https://avedictionary.com/schmoo/)" (if you are more of an AvE fan ;))

## TLDR

```bash
git clone https://github.com/DimitriGilbert/sshm0;
cd sshm0;
# add a server
./sshm0 add <server name> <server ip> <user> [...]
# edit a server
./sshm0 edit <server name> --<config to edit> <new value> [ --<config to edit 2> <new value 2>]
# connect to a server
./sshm0 connect <server name>
```

## Configs

The main config file is stored in `$HOME/.config/sshm0/config` file by default.

Server configurations are in `$HOME/.config/sshm0/servers/` folder by default.

You can use `--config-dir "/your/own/config/directory"` on every command to use a different config directory.

## Usage

general usage :

```bash
sshm0 <command> [--config-dir <value>] [arguments]
```

### add a server

```bash
sshm0 add <name> <ip> <user> [--password <value>] [--key <value>] [--auth <value>] [--port <value>] [--[no-]force]
```

* name: server name
* ip: ip address
* user: username
* -p, --password "password": user password for the server
* -i, --key "key": ssh private key path
* --auth "auth": authentication type [one of '' 'key' 'password']
* --port "port": ssh port [default: ' 22 ']
* -f|--force|--no-force: force overwrite if server exists

### edit a server

```bash
sshm0 edit <name> --<config to edit> <new value> [...]
# change user
sshm0 edit <name> --user "newUser"
# change user and password
sshm0 edit <name> --user "newUser" --password "My new password"
```

### connect to a server

```bash
sshm0 connect <name> [--cd "directory to cd on connect" ] [--exec-before "command to exec before" [--exec-before "..."]] [command to execute]
```

* name: server name
* --cd "/directory/to/cd": cd to directory
* --exec-before "my-command \"and\" args ": commands to execute before the shell, repeatable, will execute in given order

### copy to/from a server (scp)

```bash
sshm0 cp <source> <destination>

# local source to server
sshm0 cp /my/local/file <serverName>:/remote/file/path

# remote source to local
sshm0 cp <serverName>:/remote/file/path /my/local/file 
```

* source: source file
* destination: destination file

## Plugins

### Add a plugin

```bash
echo 'shm0_plugins["plugin_name"]="/path/to/plugin"' > "$HOME/.config/sshm0/config";
```

### Use a plugin

```bash
sshm0 plugin plugin_name [plugin arguments]
```

### Building a plugin

`sshm0` exports `$SSHM0_CONFIG_DIR` and `$SSHM0_ROOT_DIR` so you have access to all info sshm0 has.

sshm0 uses another library to generate the argument parsing code in bash : [parseArger](https://github.com/DimitriGilbert/parseArger), this could be a good starting point, but I don't see why you could not use your favorite scripting language to do stuff ;).
