#!/usr/bin/env bats
#
# Pure helper unit tests: sshm0_server_config_path and sshm0_validate_server.
# These have no filesystem/network side effects, so they need only a sandbox
# for SSHM0_CONFIG_DIR (path tests reference it) and the utils source.

load "../helpers/common"
load "../lib/bats-support/load"
load "../lib/bats-assert/load"

setup() { sshm0_setup_sandbox; }
teardown() { sshm0_teardown_sandbox; }

# utils is a sourced (non-executable) library
UTILS="$SSHM0_TEST_ROOT/bin/utils"

# ---------------------------------------------------------------------------
# sshm0_server_config_path
# ---------------------------------------------------------------------------

@test "sshm0_server_config_path echoes path for a valid name" {
  source "$UTILS"
  run sshm0_server_config_path "my-server_1.2"
  assert_success
  assert_output "$SSHM0_CONFIG_DIR/servers/my-server_1.2"
}

@test "sshm0_server_config_path rejects a name with a space" {
  source "$UTILS"
  run sshm0_server_config_path "bad name"
  assert_failure
}

@test "sshm0_server_config_path rejects path traversal (../x)" {
  source "$UTILS"
  run sshm0_server_config_path "../etc/passwd"
  assert_failure
}

@test "sshm0_server_config_path rejects a name with a slash" {
  source "$UTILS"
  run sshm0_server_config_path "a/b"
  assert_failure
}

@test "sshm0_server_config_path rejects a name with a colon" {
  source "$UTILS"
  run sshm0_server_config_path "a:b"
  assert_failure
}

# ---------------------------------------------------------------------------
# sshm0_validate_server  args: ip port user auth key timeout
# ---------------------------------------------------------------------------

@test "validate_server accepts a fully valid key-auth server" {
  source "$UTILS"
  run sshm0_validate_server "10.0.0.1" "22" "bob" "key" "/home/bob/.ssh/id_rsa" "10"
  assert_success
}

@test "validate_server accepts a password-auth server without a key" {
  source "$UTILS"
  run sshm0_validate_server "host.example.com" "2222" "alice" "password" "" "5"
  assert_success
}

@test "validate_server rejects an empty ip" {
  source "$UTILS"
  run sshm0_validate_server "" "22" "bob" "key" "/k" "10"
  assert_failure
}

@test "validate_server rejects a non-numeric port" {
  source "$UTILS"
  run sshm0_validate_server "10.0.0.1" "abc" "bob" "key" "/k" "10"
  assert_failure
}

@test "validate_server rejects port 0 (out of range)" {
  source "$UTILS"
  run sshm0_validate_server "10.0.0.1" "0" "bob" "key" "/k" "10"
  assert_failure
}

@test "validate_server rejects port 99999 (out of range)" {
  source "$UTILS"
  run sshm0_validate_server "10.0.0.1" "99999" "bob" "key" "/k" "10"
  assert_failure
}

@test "validate_server rejects an empty user" {
  source "$UTILS"
  run sshm0_validate_server "10.0.0.1" "22" "" "key" "/k" "10"
  assert_failure
}

@test "validate_server rejects auth=key with an empty key path" {
  source "$UTILS"
  run sshm0_validate_server "10.0.0.1" "22" "bob" "key" "" "10"
  assert_failure
}

@test "validate_server rejects an empty timeout" {
  source "$UTILS"
  run sshm0_validate_server "10.0.0.1" "22" "bob" "key" "/k" ""
  assert_failure
}

@test "validate_server rejects a non-positive timeout" {
  source "$UTILS"
  run sshm0_validate_server "10.0.0.1" "22" "bob" "key" "/k" "0"
  assert_failure
}
