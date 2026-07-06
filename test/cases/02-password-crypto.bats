#!/usr/bin/env bats
#
# Password encrypt/decrypt tests. The sandbox seeds a fixed encryption key
# (see helpers/common.bash) so these are hermetic and deterministic regardless
# of the host's hostname/whoami. Uses real openssl.

load "../helpers/common"
load "../lib/bats-support/load"
load "../lib/bats-assert/load"

setup() { sshm0_setup_sandbox; }
teardown() { sshm0_teardown_sandbox; }

UTILS="$SSHM0_TEST_ROOT/bin/utils"

@test "encrypt then decrypt round-trips a password" {
  source "$UTILS"
  _enc="$(sshm0_encrypt_password "mySecret123")"
  _dec="$(sshm0_decrypt_password "$_enc")"
  [ "$_dec" = "mySecret123" ]
}

@test "encrypt then decrypt round-trips a password with special chars" {
  source "$UTILS"
  _pw='p@ss w0rd!#$%'
  _enc="$(sshm0_encrypt_password "$_pw")"
  _dec="$(sshm0_decrypt_password "$_enc")"
  [ "$_dec" = "$_pw" ]
}

@test "encrypt produces an enc:-prefixed ciphertext (not plaintext)" {
  source "$UTILS"
  _enc="$(sshm0_encrypt_password "mySecret123")"
  [[ "$_enc" == enc:* ]]
  [ "$_enc" != "mySecret123" ]
}

@test "encrypt of empty input returns empty" {
  source "$UTILS"
  [ "$(sshm0_encrypt_password "")" = "" ]
}

@test "decrypt of empty input returns empty" {
  source "$UTILS"
  [ "$(sshm0_decrypt_password "")" = "" ]
}

@test "decrypt passes through plaintext that is not enc:-prefixed" {
  source "$UTILS"
  [ "$(sshm0_decrypt_password "justplaintext")" = "justplaintext" ]
}

@test "decrypt passes through plaintext that happens to be a password" {
  source "$UTILS"
  [ "$(sshm0_decrypt_password "hunter2")" = "hunter2" ]
}

@test "decrypt of a value encrypted with the test key returns the plaintext" {
  source "$UTILS"
  _enc="$(sshm0_encrypt_password "roundtrip")"
  # the ciphertext must differ from the plaintext
  [ "$_enc" != "roundtrip" ]
  [ "$(sshm0_decrypt_password "$_enc")" = "roundtrip" ]
}
