# sshm0 (ssh manager 0)

A simple CLI ssh server manager.

Prounouce "ssshhmeu" ([<https://copenhagensuborbitals.com/a-walkthrough-of-the-nexo-ii-rocket-part-i/](like> in the nexö rocket from Copenhagen Suborbital)) or "ssshhmoo" (if you are more of an AvE fan ;))

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
sshm0 connect <name>
```
