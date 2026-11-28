#!/usr/bin/env bash
# Explicit local rollback to an existing public release, never deletes releases.
set -euo pipefail
[[ $# = 2 ]] || { echo "Usage: rollback-release.sh ROOT RELEASE_NAME"; exit 2; }
ROOT=$(realpath -e -- "$1")
[[ "$2" =~ ^[a-zA-Z0-9-]+-public$ ]]
[[ "$EUID" != 0 ]] || { echo "Do not run as root"; exit 2; }
[[ -L "$ROOT/current" && -d "$ROOT/releases" && ! -L "$ROOT/releases" && -d "$ROOT/manifests" && ! -L "$ROOT/manifests" && ! -L "$ROOT/.deploy.lock" ]]
HERE=$(dirname "$(realpath "$0")")
exec 9>"$ROOT/.deploy.lock"
flock -x 9
[[ ! -L "$ROOT/releases/$2" ]]
TARGET=$(realpath -e -- "$ROOT/releases/$2")
[[ "$(dirname "$TARGET")" = "$ROOT/releases" && -f "$TARGET/index.html" ]]
OLD=$(realpath -e -- "$ROOT/current")
[[ "$(dirname "$OLD")" = "$ROOT/releases" && -d "$OLD" ]]
[[ "$TARGET" != "$OLD" ]] || { echo "Already active"; exit 2; }
TARGET_MANIFEST="$ROOT/manifests/$2.json"
OLD_MANIFEST="$ROOT/manifests/$(basename "$OLD").json"
[[ -f "$TARGET_MANIFEST" && ! -L "$TARGET_MANIFEST" && -f "$OLD_MANIFEST" && ! -L "$OLD_MANIFEST" ]]
META=$(mktemp -d)
NEXT="$ROOT/.current.next.$$"
ACTIVE=0
cleanup() {
    rc=$?
    trap - EXIT
    if [[ $ACTIVE = 1 && $rc != 0 ]]; then
        rm -f -- "$NEXT"
        if ln -s -- "$OLD" "$NEXT" && mv -Tf -- "$NEXT" "$ROOT/current"; then
            python3 "$HERE/verify-release.py" "$META/old" --public-root "$OLD" --http || { echo "CRITICAL: restored release verification failed" >&2; rc=2; }
        else
            echo "CRITICAL: rollback pointer restoration failed" >&2
            rc=2
        fi
    fi
    rm -f -- "$NEXT"
    rm -rf -- "$META"
    exit "$rc"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
mkdir "$META/target" "$META/old"
cp -- "$TARGET_MANIFEST" "$META/target/release.json"
cp -- "$OLD_MANIFEST" "$META/old/release.json"
python3 "$HERE/verify-release.py" "$META/target" --public-root "$TARGET"
python3 "$HERE/verify-release.py" "$META/old" --public-root "$OLD" --http
ln -s -- "$TARGET" "$NEXT"
ACTIVE=1
mv -Tf -- "$NEXT" "$ROOT/current"
python3 "$HERE/verify-release.py" "$META/target" --public-root "$TARGET" --http
echo "ROLLBACK_PASS: $TARGET"
