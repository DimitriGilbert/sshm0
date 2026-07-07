#!/usr/bin/env bats
#
# Config round-trip tests: add/edit/remove/rename.
# These exercise the real bin/ commands (invoked directly, with SSHM0_* env
# exported by the sandbox). Contains regression tests for the bugs fixed in
# commit 3d42d9c (edit double-encryption, cd/exec_before loss).
#
# IMPORTANT: assertions use sshm0_load_server_field (sourcing the file back and
# comparing PARSED values), not raw byte comparison — because add and edit
# serialize arrays with slightly different whitespace.

load "../helpers/common"
load "../lib/bats-support/load"
load "../lib/bats-assert/load"

setup() { sshm0_setup_sandbox; }
teardown() { sshm0_teardown_sandbox; }

ADD="$SSHM0_TEST_ROOT/bin/add"
EDIT="$SSHM0_TEST_ROOT/bin/edit"
REMOVE="$SSHM0_TEST_ROOT/bin/remove"
RENAME="$SSHM0_TEST_ROOT/bin/rename"
UTILS="$SSHM0_TEST_ROOT/bin/utils"

# Helper: create a password-auth server via add (the normal path).
_create_server() {
  "$ADD" --force "$1" "${2:-10.0.0.1}" "${3:-bob}" \
    --auth password --password "${4:-secret}" \
    --port "${5:-22}" --tag "${6:-a,b}" --group "${7:-g}" --timeout "${8:-10}" \
    >/dev/null 2>&1
}

# ---------------------------------------------------------------------------
# add
# ---------------------------------------------------------------------------

@test "add writes all fields and they round-trip via load" {
  _create_server "srv" "10.0.0.5" "alice" "pw123" "2222" "web,db" "prod" "15"
  source "$UTILS"
  sshm0_load_server "srv"
  [ "$sshm0_server_ip" = "10.0.0.5" ]
  [ "$sshm0_server_user" = "alice" ]
  [ "$sshm0_server_port" = "2222" ]
  [ "$sshm0_server_auth" = "password" ]
  [ "$sshm0_server_timeout" = "15" ]
  [ "$sshm0_server_group" = "prod" ]
  [ "${#sshm0_server_tags[@]}" = "2" ]
  [ "${sshm0_server_tags[0]}" = "web" ]
  [ "${sshm0_server_tags[1]}" = "db" ]
}

@test "add encrypts the password (stored value is enc:-prefixed, not plaintext)" {
  _create_server "srv" "10.0.0.1" "bob" "mySecret"
  source "$UTILS"
  sshm0_load_server "srv"
  [[ "$sshm0_server_password" == enc:* ]]
  [ "$sshm0_server_password" != "mySecret" ]
  # and it decrypts back to the plaintext
  [ "$(sshm0_decrypt_password "$sshm0_server_password")" = "mySecret" ]
}

@test "add refuses to overwrite without --force" {
  _create_server "srv"
  # second add without --force should not clobber
  run "$ADD" "srv" "10.0.0.99" "eve" --auth password --password "x" --port 22
  # exits non-zero? (it logs an error and returns; check the file was untouched)
  source "$UTILS"
  sshm0_load_server "srv"
  [ "$sshm0_server_ip" = "10.0.0.1" ]
  [ "$sshm0_server_user" = "bob" ]
}

@test "add with --force overwrites an existing server" {
  _create_server "srv"
  run "$ADD" --force "srv" "10.0.0.99" "eve" --auth password --password "x" --port 22
  assert_success
  source "$UTILS"
  sshm0_load_server "srv"
  [ "$sshm0_server_ip" = "10.0.0.99" ]
  [ "$sshm0_server_user" = "eve" ]
}

# ---------------------------------------------------------------------------
# edit — REGRESSION TESTS (these are the bugs we fixed)
# ---------------------------------------------------------------------------

@test "REGRESSION: editing a non-password field does NOT re-encrypt the password" {
  # Before the fix, edit forwarded the enc: ciphertext as --password to add,
  # which encrypted it again -> next connect got back enc: garbage.
  _create_server "srv" "10.0.0.1" "bob" "mySecret"
  # snapshot the stored ciphertext
  _pw_before="$(grep '^sshm0_server_password=' "$SSHM0_CONFIG_DIR/servers/srv")"

  # edit something unrelated to the password
  run "$EDIT" "srv" --port 9999
  assert_success

  _pw_after="$(grep '^sshm0_server_password=' "$SSHM0_CONFIG_DIR/servers/srv")"
  # ciphertext must be byte-for-byte unchanged (NOT re-encrypted)
  [ "$_pw_before" = "$_pw_after" ]
}

@test "REGRESSION: edit preserves cd and exec_before fields" {
  # Before the fix, edit round-tripped through add, which has no options for
  # cd/exec_before and always wrote them empty -> every edit wiped them.
  _create_server "srv"
  # add can't set cd/exec_before, so seed them directly (as a hand-edited config would)
  source "$UTILS"
  sshm0_load_server "srv"
  {
    printf '# sshm0 server config\n'
    printf 'sshm0_server_ip=%s\n' "$(printf '%q' "$sshm0_server_ip")"
    printf 'sshm0_server_user=%s\n' "$(printf '%q' "$sshm0_server_user")"
    printf 'sshm0_server_port=%s\n' "$(printf '%q' "$sshm0_server_port")"
    printf 'sshm0_server_auth=%s\n' "$(printf '%q' "$sshm0_server_auth")"
    printf 'sshm0_server_password=%s\n' "$(printf '%q' "$sshm0_server_password")"
    printf 'sshm0_server_key=%s\n' "$(printf '%q' "$sshm0_server_key")"
    printf 'sshm0_server_timeout=%s\n' "$(printf '%q' "${sshm0_server_timeout:-10}")"
    printf 'sshm0_server_cd=%s\n' "$(printf '%q' "/var/www")"
    printf 'sshm0_server_exec_before=(%s)\n' "$(printf '%q' "export FOO=bar")"
    printf 'sshm0_server_tags=()\n'
    printf 'sshm0_server_group=%s\n' "$(printf '%q' "$sshm0_server_group")"
    printf 'sshm0_server_proxy=%s\n' "$(printf '%q' "$sshm0_server_proxy")"
  } > "$SSHM0_CONFIG_DIR/servers/srv"

  # edit an unrelated field
  run "$EDIT" "srv" --port 8888
  assert_success

  # cd and exec_before must survive
  [ "$(sshm0_load_server_field "srv" "sshm0_server_cd")" = "/var/www" ]
  [ "$(sshm0_load_server_field_array_count "srv" "sshm0_server_exec_before")" = "1" ]
  # and the exec_before content
  _eb="$(source "$SSHM0_CONFIG_DIR/servers/srv" && printf '%s' "${sshm0_server_exec_before[0]}")"
  [ "$_eb" = "export FOO=bar" ]
}

@test "edit changes a field and it persists" {
  _create_server "srv" "10.0.0.1" "bob" "pw" "22"
  run "$EDIT" "srv" --port 7777
  assert_success
  [ "$(sshm0_load_server_field "srv" "sshm0_server_port")" = "7777" ]
}

@test "edit changing the password re-encrypts it and it decrypts correctly" {
  _create_server "srv" "10.0.0.1" "bob" "oldPassword"
  source "$UTILS"
  sshm0_load_server "srv"
  _old_pw_field="$sshm0_server_password"

  run "$EDIT" "srv" --password "newPassword"
  assert_success

  sshm0_load_server "srv"
  # ciphertext changed
  [ "$sshm0_server_password" != "$_old_pw_field" ]
  # and decrypts to the NEW password
  [ "$(sshm0_decrypt_password "$sshm0_server_password")" = "newPassword" ]
}

@test "edit preserves tags when no --tag is supplied" {
  _create_server "srv" "10.0.0.1" "bob" "pw" "22" "alpha,beta"
  run "$EDIT" "srv" --port 1
  assert_success
  [ "$(sshm0_load_server_field_array_count "srv" "sshm0_server_tags")" = "2" ]
}

# ---------------------------------------------------------------------------
# remove
# ---------------------------------------------------------------------------

@test "remove -y deletes a server" {
  _create_server "srv"
  run "$REMOVE" -y "srv"
  assert_success
  [ ! -f "$SSHM0_CONFIG_DIR/servers/srv" ]
}

@test "remove reports when server does not exist" {
  run "$REMOVE" -y "ghost"
  # exits and reports not found (exit code may be 0, but message present)
  assert_output --partial "not found"
}

# ---------------------------------------------------------------------------
# rename
# ---------------------------------------------------------------------------

@test "rename moves a server and preserves its content" {
  _create_server "old" "10.0.0.1" "bob" "pw" "2222"
  run "$RENAME" "old" "new"
  assert_success
  [ ! -f "$SSHM0_CONFIG_DIR/servers/old" ]
  [ -f "$SSHM0_CONFIG_DIR/servers/new" ]
  [ "$(sshm0_load_server_field "new" "sshm0_server_port")" = "2222" ]
}

@test "rename refuses to overwrite an existing server" {
  _create_server "old"
  _create_server "existing"
  run "$RENAME" "old" "existing"
  assert_failure
  assert_output --partial "already exists"
  # original must be untouched
  [ -f "$SSHM0_CONFIG_DIR/servers/old" ]
  [ -f "$SSHM0_CONFIG_DIR/servers/existing" ]
}

@test "rename fails when source does not exist" {
  run "$RENAME" "ghost" "newname"
  assert_failure
}
