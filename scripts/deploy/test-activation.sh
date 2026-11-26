#!/usr/bin/env bash
# Disposable integration fixture; never uses /var/www or remote access.
set -euo pipefail
HERE=$(dirname "$(realpath "$0")")
TMP=$(mktemp -d)
PID=""
cleanup() { if [[ -n "$PID" ]]; then kill "$PID" 2>/dev/null || true; wait "$PID" 2>/dev/null || true; fi; rm -rf -- "$TMP"; }
trap cleanup EXIT
ROOT="$TMP/site"
mkdir -p "$ROOT/releases/old-public"
echo old > "$ROOT/releases/old-public/index.html"
ln -s "$ROOT/releases/old-public" "$ROOT/current"
python3 - "$TMP" <<'PY'
import hashlib,json,sys
from pathlib import Path
root=Path(sys.argv[1])
for name,sha in [("good","a"*40),("bad","b"*40)]:
    p=root/name
    (p/"public").mkdir(parents=True)
    data=name.encode()
    (p/"public/index.html").write_bytes(data)
    (p/"release.json").write_text(json.dumps({"commit":sha,"files":{"index.html":hashlib.sha256(data).hexdigest()}}))
PY
# Inject an HTTP-only failure for bad release after pointer activation.
python3 - "$ROOT" <<'PY' &
import sys
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
root=Path(sys.argv[1])
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw):
        super().__init__(*a,directory=str(root/"current"),**kw)
    def do_GET(self):
        if (root/"current").resolve().name == "b"*40+"-public":
            self.send_error(503)
        else:
            super().do_GET()
ThreadingHTTPServer(("127.0.0.1",8080),Handler).serve_forever()
PY
PID=$!
for i in $(seq 1 20); do
    if curl -fsS http://127.0.0.1:8080/index.html >/dev/null; then break; fi
    sleep 1
done
curl -fsS http://127.0.0.1:8080/index.html >/dev/null
bash "$HERE/deploy-release.sh" "$ROOT" "$TMP/good"
GOOD="$ROOT/releases/$(printf 'a%.0s' {1..40})-public"
[[ "$(realpath "$ROOT/current")" = "$GOOD" ]]
if bash "$HERE/deploy-release.sh" "$ROOT" "$TMP/bad"; then
    echo "Expected HTTP failure" >&2; exit 1
fi
[[ "$(realpath "$ROOT/current")" = "$GOOD" ]]
[[ "$(curl -fsS http://127.0.0.1:8080/index.html)" = good ]]
bash "$HERE/rollback-release.sh" "$ROOT" old-public
[[ "$(realpath "$ROOT/current")" = "$ROOT/releases/old-public" ]]
[[ "$(curl -fsS http://127.0.0.1:8080/index.html)" = old ]]
echo "PASS: activation, HTTP failure rollback, explicit rollback"
