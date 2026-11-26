#!/usr/bin/env bash
# Local activation only. Run as a trusted operator; never execute uploaded code.
set -euo pipefail
[[ $# = 2 ]] || { echo "Usage: deploy-release.sh ROOT ARTIFACT"; exit 2; }
ROOT=$(realpath -e -- "$1")
ART=$(realpath -e -- "$2")
HERE=$(dirname "$(realpath "$0")")
[[ "$EUID" != 0 ]] || { echo "Do not run as root"; exit 2; }
[[ -d "$ROOT/releases" && ! -L "$ROOT/releases" && -L "$ROOT/current" ]]
[[ -d "$ROOT/manifests" && ! -L "$ROOT/manifests" ]]
[[ ! -L "$ROOT/.deploy.lock" ]]
exec 9>"$ROOT/.deploy.lock"
flock -x 9
OLD=$(realpath -e "$ROOT/current")
[[ "$(dirname "$OLD")" = "$ROOT/releases" && -d "$OLD" ]]
SHA=$(python3 -c 'import json,sys,re; s=json.load(open(sys.argv[1]))["commit"]; assert re.fullmatch("[0-9a-f]{40}",s); print(s)' "$ART/release.json")
NEW="$ROOT/releases/$SHA-public"
[[ ! -e "$NEW" && ! -L "$NEW" ]]
[[ ! -e "$ROOT/manifests/$SHA-public.json" && ! -L "$ROOT/manifests/$SHA-public.json" ]]
python3 "$HERE/verify-release.py" "$ART"
STAGE=$(mktemp -d "$ROOT/releases/.stage.XXXXXXXX")
NEXT="$ROOT/.current.next.$$"
ACTIVE=0
cleanup() {
    rc=$?
    trap - EXIT
    if [[ $ACTIVE = 1 && $rc != 0 ]]; then
        echo "Activation failed; restoring $OLD" >&2
        rm -f -- "$NEXT"
        ln -s -- "$OLD" "$NEXT" && mv -Tf -- "$NEXT" "$ROOT/current" || { echo "CRITICAL: rollback failed" >&2; exit 2; }
        echo "ROLLBACK_POINTER_RESTORED"
        curl -fsS --max-time 15 http://127.0.0.1:8080/index.html | cmp -s - "$OLD/index.html" || { echo "CRITICAL: restored site verification failed" >&2; rc=2; }
    fi
    rm -f -- "$NEXT"
    if [[ -d "$STAGE" ]]; then rm -rf -- "$STAGE"; fi
    exit "$rc"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
cp -a -- "$ART/public" "$STAGE/public"
cp -- "$ART/release.json" "$STAGE/release.json"
find "$STAGE/public" -type d -exec chmod 0755 {} +
find "$STAGE/public" -type f -exec chmod 0644 {} +
python3 "$HERE/verify-release.py" "$STAGE"
mv -T -- "$STAGE/public" "$NEW"
ln -s -- "$NEW" "$NEXT"
ACTIVE=1
mv -Tf -- "$NEXT" "$ROOT/current"
python3 "$HERE/verify-release.py" "$STAGE" --http --public-root "$NEW"
cp -- "$STAGE/release.json" "$ROOT/manifests/$SHA-public.json"
echo "DEPLOY_PASS: $NEW"
