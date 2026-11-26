"""Export tracked public files to a fresh directory; no server access."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[2]
POLICY = json.loads(Path(__file__).with_name("public-manifest.json").read_text())

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    out = args.output.resolve()
    if out.exists() or out.is_relative_to(ROOT):
        raise SystemExit("Output must be a fresh directory outside checkout")
    if subprocess.check_output(["git", "status", "--porcelain"], cwd=ROOT).strip():
        raise SystemExit("Clean checkout required")
    paths = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).decode().split("\0")
    selected = []
    for name in filter(None, paths):
        p = Path(name)
        if any(part.startswith(".") for part in p.parts):
            continue
        if name in POLICY["files"] or (
            p.parts[0] in POLICY["directories"] and p.suffix in POLICY["extensions"]
        ) or (len(p.parts) == 2 and p.parts[0] == "scripts" and p.suffix in POLICY["script_extensions"]):
            source = ROOT / p
            if not source.is_file() or source.is_symlink() or not source.resolve().is_relative_to(ROOT):
                raise SystemExit(f"Invalid source: {name}")
            selected.append(p)
    if not set(POLICY["files"]).issubset({p.as_posix() for p in selected}):
        raise SystemExit("Required files missing")
    out.mkdir()
    public = out / "public"
    public.mkdir()
    hashes = {}
    for p in sorted(selected):
        target = public / p
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(ROOT / p, target)
        hashes[p.as_posix()] = hashlib.sha256(target.read_bytes()).hexdigest()
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    (out / "release.json").write_text(json.dumps({"commit": commit, "files": hashes}, indent=2) + "\n")
    print(f"Exported {len(hashes)} files from {commit}")

if __name__ == "__main__":
    main()
