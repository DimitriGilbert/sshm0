#compdef sshm0

_sshm0_zsh_completions() {
  local curcontext="$curcontext" state line
  typeset -A opt_args

  _sshm0_get_servers() {
    local dir="${SSHM0_CONFIG_DIR:-$HOME/.config/sshm0}/servers"
    if [[ -d "$dir" ]]; then
      ls "$dir" 2>/dev/null
    fi
  }

  _sshm0_get_ssh_keys() {
    local dir="$HOME/.ssh"
    if [[ -d "$dir" ]]; then
      ls "$dir" 2>/dev/null
    fi
  }

  _arguments -C \
    '1:subcommand:->subcommand' \
    '*::arg:->args' && return 0

  case "$state" in
    subcommand)
      _values 'sshm0 subcommand' \
        'list:List servers' \
        'add:Add a new server' \
        'connect:Connect to a server' \
        'cp:Copy server config' \
        'edit:Edit server config' \
        'export:Export servers' \
        'import:Import servers' \
        'plugin:Manage plugins' \
        'remove:Remove a server' \
        'rename:Rename a server' \
        'show:Show server details' \
        'ping:Ping a server' \
        'rsync:Rsync with a server' \
        'doctor:Run diagnostics' \
        'tags:List tags' \
        'history:Show connection history' \
        'backup:Backup or restore configs' \
        'config:Manage configuration' \
        'exec:Execute command on server' \
        'update:Update sshm0'
      return
      ;;
    args)
      case "${words[1]}" in
        list)
          _arguments \
            '--tag[Filter by tag]:tag:' \
            '-t[Filter by tag]:tag:' \
            '--filter[Filter servers]:filter:' \
            '-f[Filter servers]:filter:' \
            '--long[Long listing format]' \
            '-l[Long listing format]' \
            '--recent[Sort by recent]' \
            '-r[Sort by recent]' \
            '--group[Group by tag]:group:' \
            '-g[Group by tag]:group:' \
            '--tree[Tree view]' \
            '--no-tree[No tree view]'
          ;;
        add)
          _arguments \
            '--password[Password auth]' \
            '--pass[Password auth]' \
            '--pwd[Password auth]' \
            '-p[Password auth]' \
            '--key[SSH key path]:key:_sshm0_get_ssh_keys' \
            '-i[SSH key path]:key:_sshm0_get_ssh_keys' \
            '--auth[Auth method]:auth:' \
            '-a[Auth method]:auth:' \
            '--port[SSH port]:port:' \
            '-P[SSH port]:port:' \
            '--force[Force overwrite]' \
            '--no-force[No force overwrite]' \
            '-f[Force overwrite]' \
            '--connect[Connect after add]' \
            '--no-connect[No connect after add]' \
            '-c[Connect after add]' \
            '--tag[Tag]:tag:' \
            '-t[Tag]:tag:' \
            '--group[Group]:group:' \
            '-g[Group]:group:' \
            '--proxy[Proxy jump]:proxy:' \
            '-J[Proxy jump]:proxy:' \
            '--timeout[Timeout]:timeout:'
          ;;
        connect)
          _arguments \
            '1:server:_sshm0_get_servers' \
            '--cd[Change directory after connect]:dir:' \
            '--exec-before[Execute command before connect]:cmd:'
          ;;
        cp)
          _arguments \
            '1:source server:_sshm0_get_servers' \
            '2:dest server:_sshm0_get_servers'
          ;;
        edit)
          _arguments \
            '1:server:_sshm0_get_servers' \
            '--ip[IP address]:ip:' \
            '--user[Username]:user:' \
            '--password[Password auth]' \
            '-p[Password auth]' \
            '--key[SSH key path]:key:_sshm0_get_ssh_keys' \
            '-i[SSH key path]:key:_sshm0_get_ssh_keys' \
            '--auth[Auth method]:auth:' \
            '--port[SSH port]:port:' \
            '--connect[Connect after edit]' \
            '--no-connect[No connect after edit]' \
            '-c[Connect after edit]' \
            '--tag[Tag]:tag:' \
            '-t[Tag]:tag:' \
            '--group[Group]:group:' \
            '-g[Group]:group:' \
            '--proxy[Proxy jump]:proxy:' \
            '-J[Proxy jump]:proxy:' \
            '--timeout[Timeout]:timeout:'
          ;;
        export)
          _arguments \
            '--output[Output file]:file:_files' \
            '-o[Output file]:file:_files' \
            '--merge[Merge with existing]'
          ;;
        import)
          _arguments \
            '--file[Input file]:file:_files' \
            '-f[Input file]:file:_files' \
            '--force[Force overwrite]' \
            '--no-force[No force overwrite]' \
            '--dry-run[Dry run]' \
            '--no-dry-run[No dry run]' \
            '--tag[Tag]:tag:' \
            '-t[Tag]:tag:'
          ;;
        remove)
          _arguments \
            '1:server:_sshm0_get_servers' \
            '--yes[Skip confirmation]' \
            '--no-yes[Require confirmation]' \
            '-y[Skip confirmation]'
          ;;
        rename)
          _arguments \
            '1:old name:_sshm0_get_servers' \
            '2:new name:_sshm0_get_servers'
          ;;
        show)
          _arguments \
            '1:server:_sshm0_get_servers'
          ;;
        ping)
          _arguments \
            '1:server:_sshm0_get_servers'
          ;;
        rsync)
          _arguments \
            '1:server:_sshm0_get_servers'
          ;;
        doctor)
          ;;
        plugin)
          ;;
        tags)
          _arguments \
            '--long[Long listing format]' \
            '-l[Long listing format]'
          ;;
        history)
          _arguments \
            '--count[Number of entries]:count:' \
            '-n[Number of entries]:count:' \
            '--server[Filter by server]:server:_sshm0_get_servers' \
            '-s[Filter by server]:server:_sshm0_get_servers'
          ;;
        config)
          _values 'config subcommand' 'list' 'get' 'set' 'plugins'
          ;;
        backup)
          _arguments \
            '--output[Output file]:file:_files' \
            '-o[Output file]:file:_files' \
            '--restore[Restore from backup]' \
            '--yes[Skip confirmation]' \
            '--no-yes[Require confirmation]' \
            '-y[Skip confirmation]'
          ;;
        exec)
          _arguments \
            '1:server:_sshm0_get_servers' \
            '--tag[Filter by tag]:tag:' \
            '--group[Filter by group]:group:' \
            '--parallel[Run in parallel]' \
            '--yes[Skip confirmation]' \
            '--timeout[Timeout]:seconds:'
          ;;
        update)
          _arguments \
            '--check[Check for updates]' \
            '-c[Check for updates]' \
            '--force[Force update]' \
            '-f[Force update]'
          ;;
      esac
      ;;
  esac
}

compdef _sshm0_zsh_completions sshm0
