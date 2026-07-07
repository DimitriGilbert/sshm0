# shellcheck shell=bash
# Shared test helpers for the sshm0 bats suite.
#
# Each .bats file's setup() should call `sshm0_setup_sandbox` and teardown()
# should call `sshm0_teardown_sandbox`. This gives every test an isolated
# SSHM0_CONFIG_DIR with a pre-seeded encryption key (so crypto tests are
# hermetic — otherwise the key is derived from hostname+whoami and written
# into the config as a side effect, making tests machine/order dependent).

# Resolve the repo root from this helper's own location: test/helpers/ -> ../..
SSHM0_TEST_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd -P)"

# A fixed encryption key so encrypt/decrypt tests are deterministic and do not
# mutate the seeded config file. (Real openssl; constant key.)
SSHM0_TEST_KEY="deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"

# Create an isolated sandbox and export the env vars sshm0 needs.
# Sets: $SSHM0_SANDBOX (the temp config dir), SSHM0_ROOT_DIR, SSHM0_CONFIG_DIR.
sshm0_setup_sandbox() {
  SSHM0_SANDBOX="$(mktemp -d)"
  export SSHM0_ROOT_DIR="$SSHM0_TEST_ROOT"
  export SSHM0_CONFIG_DIR="$SSHM0_SANDBOX"
  mkdir -p "$SSHM0_SANDBOX/servers"
  # Seed a valid v2 config with a fixed encryption key.
  {
    cat "$SSHM0_TEST_ROOT/config.dist"
    printf 'sshm0_config_encryption_key=%s\n' "$SSHM0_TEST_KEY"
  } > "$SSHM0_SANDBOX/config"
}

sshm0_teardown_sandbox() {
  [ -n "${SSHM0_SANDBOX:-}" ] && [ -d "$SSHM0_SANDBOX" ] && rm -rf "$SSHM0_SANDBOX"
}

# Load a server config and print ONE resolved field value.
# Usage: sshm0_load_server_field <name> <field>
# e.g.  sshm0_load_server_field myserver sshm0_server_port
# This sources the file (re-evaluating printf %q escaping) and echoes the
# parsed variable — so callers assert on the VALUE, not the raw serialized
# bytes (which differ in trivial ways between `add` and `edit`, e.g. trailing
# spaces in arrays).
sshm0_load_server_field() {
  local _name="$1" _field="$2"
  local _path="$SSHM0_CONFIG_DIR/servers/$_name"
  # shellcheck source=/dev/null
  ( source "$_path" && printf '%s' "${!_field}" )
}

# Load a server config into the CURRENT shell (so array fields are accessible).
# Usage: source <(sshm0_source_server myserver)  OR use sshm0_load_server_field_array.
sshm0_load_server_field_array_count() {
  # Prints the element count of an array field on a server.
  # Usage: sshm0_load_server_field_array_count <name> <array_field>
  local _name="$1" _field="$2"
  local _path="$SSHM0_CONFIG_DIR/servers/$_name"
  # shellcheck source=/dev/null
  ( source "$_path" && eval "printf '%s' \"\${#${_field}[@]}\"" )
}

# Convenience: path to the vendored bats binary.
sshm0_bats_bin() {
  printf '%s/test/lib/bats-core/bin/bats' "$SSHM0_TEST_ROOT"
}
