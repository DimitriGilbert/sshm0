# sshm0 completion                                         -*- shell-script -*-

# This bash completions script was generated by
# completely (https://github.com/dannyben/completely)
# Modifying it manually is not recommended

_sshm0_completions_filter() {
  local words="$1"
  local cur=${COMP_WORDS[COMP_CWORD]}
  local result=()

  if [[ "${cur:0:1}" == "-" ]]; then
    echo "$words"
  
  else
    for word in $words; do
      [[ "${word:0:1}" != "-" ]] && result+=("$word")
    done

    echo "${result[*]}"

  fi
}

_sshm0_completions() {
  local cur=${COMP_WORDS[COMP_CWORD]}
  local compwords=("${COMP_WORDS[@]:1:$COMP_CWORD-1}")
  local compline="${compwords[*]}"

  case "$compline" in
    'edit'*'--key')
      while read -r; do COMPREPLY+=( "$REPLY" ); done < <( compgen -W "$(_sshm0_completions_filter "$(/usr/bin/ls $HOME/.ssh)")" -- "$cur" )
      ;;

    'add'*'--key')
      while read -r; do COMPREPLY+=( "$REPLY" ); done < <( compgen -W "$(_sshm0_completions_filter "$(/usr/bin/ls $HOME/.ssh)")" -- "$cur" )
      ;;

    'connect'*)
      while read -r; do COMPREPLY+=( "$REPLY" ); done < <( compgen -W "$(_sshm0_completions_filter "$(/usr/bin/ls $HOME/.config/sshm0/servers) --cd --exec-before")" -- "$cur" )
      ;;

    'remove'*)
      while read -r; do COMPREPLY+=( "$REPLY" ); done < <( compgen -W "$(_sshm0_completions_filter "$(/usr/bin/ls $HOME/.config/sshm0/servers)")" -- "$cur" )
      ;;

    'edit'*)
      while read -r; do COMPREPLY+=( "$REPLY" ); done < <( compgen -W "$(_sshm0_completions_filter "$(/usr/bin/ls $HOME/.config/sshm0/servers) --ip --user --password -p --key -i --auth --port --connect --no-connect -c")" -- "$cur" )
      ;;

    'add'*)
      while read -r; do COMPREPLY+=( "$REPLY" ); done < <( compgen -W "$(_sshm0_completions_filter "--password --pass --pwd -p --key -i --auth -a --port -p --force --no-force -f --connect --no-connect -c")" -- "$cur" )
      ;;

    'cp'*)
      while read -r; do COMPREPLY+=( "$REPLY" ); done < <( compgen -A file -A file -- "$cur" )
      ;;

    *)
      while read -r; do COMPREPLY+=( "$REPLY" ); done < <( compgen -W "$(_sshm0_completions_filter "list add connect cp edit plugin remove remove --config-dir")" -- "$cur" )
      ;;

  esac
} &&
complete -F _sshm0_completions sshm0

# ex: filetype=sh
