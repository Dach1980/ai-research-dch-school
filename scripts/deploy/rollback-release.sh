#!/usr/bin/env bash
# Explicit local rollback to an existing public release, never deletes releases.
set -euo pipefail
[[ $# = 2 ]] || { echo "Usage: rollback-release.sh ROOT RELEASE_NAME"; exit 2; }
ROOT=$(realpath -e -- "$1")
[[ "$2" =~ ^[a-zA-Z0-9-]+-public$ ]]
[[ -L "$ROOT/current" ]]
exec 9>"$ROOT/.deploy.lock"
flock -x 9
TARGET=$(realpath -e -- "$ROOT/releases/$2")
[[ "$(dirname "$TARGET")" = "$ROOT/releases" && -f "$TARGET/index.html" ]]
OLD=$(realpath -e "$ROOT/current")
[[ "$(dirname "$OLD")" = "$ROOT/releases" ]]
NEXT="$ROOT/.current.next.$$"
trap 'rm -f -- "$NEXT"' EXIT
ln -s -- "$TARGET" "$NEXT"
mv -Tf -- "$NEXT" "$ROOT/current"
if ! (set -o pipefail; curl -fsS --max-time 15 http://127.0.0.1:8080/index.html | cmp -s - "$TARGET/index.html"); then
    ln -s -- "$OLD" "$NEXT"
    mv -Tf -- "$NEXT" "$ROOT/current"
    echo "Rollback verification failed; previous pointer restored" >&2
    exit 1
fi
echo "ROLLBACK_PASS: $TARGET"
