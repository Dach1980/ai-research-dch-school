#!/usr/bin/env bash
# Explicit local rollback to an existing public release, never deletes releases.
set -euo pipefail
[[ $# = 2 ]] || { echo "Usage: rollback-release.sh ROOT RELEASE_NAME"; exit 2; }
ROOT=$(realpath -e -- "$1")
[[ "$2" =~ ^[a-zA-Z0-9-]+-public$ ]]
[[ "$EUID" != 0 ]] || { echo "Do not run as root"; exit 2; }
[[ -L "$ROOT/current" && ! -L "$ROOT/releases" && ! -L "$ROOT/manifests" && ! -L "$ROOT/.deploy.lock" ]]
HERE=$(dirname "$(realpath "$0")")
exec 9>"$ROOT/.deploy.lock"
flock -x 9
TARGET=$(realpath -e -- "$ROOT/releases/$2")
[[ "$(dirname "$TARGET")" = "$ROOT/releases" && -f "$TARGET/index.html" ]]
OLD=$(realpath -e "$ROOT/current")
[[ "$(dirname "$OLD")" = "$ROOT/releases" ]]
META=$(mktemp -d)
cp -- "$ROOT/manifests/$2.json" "$META/release.json"
python3 "$HERE/verify-release.py" "$META" --public-root "$TARGET"
NEXT="$ROOT/.current.next.$"
trap 'rm -f -- "$NEXT"; rm -rf -- "$META"' EXIT
ln -s -- "$TARGET" "$NEXT"
mv -Tf -- "$NEXT" "$ROOT/current"
if ! python3 "$HERE/verify-release.py" "$META" --public-root "$TARGET" --http; then
    ln -s -- "$OLD" "$NEXT"
    mv -Tf -- "$NEXT" "$ROOT/current"
    echo "Rollback verification failed; previous pointer restored" >&2
    exit 1
fi
echo "ROLLBACK_PASS: $TARGET"
