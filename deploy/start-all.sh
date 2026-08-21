#!/usr/bin/env bash
# Start the whole DAU practice ecosystem for local development.
# Assumes all repos are cloned as siblings in the parent directory.
set -u
DIR="$(cd "$(dirname "$0")/../.." && pwd)"
PORTS=(chudbox:8080 movement-bench:8091 fab-lab:8092 pipeline-playground:8093 compiler-workbench:8094 packet-lab:8095 os-lab:8096 ml-lab:8097)

echo "▶ installing missing node_modules (skips if present)…"
for repo in "$DIR"/*/; do
  [ -f "$repo/package.json" ] || continue
  [ -d "$repo/node_modules" ] && continue
  (cd "$repo" && npm install --no-audit --no-fund) &
done
wait

echo "▶ starting labs…"
for entry in "${PORTS[@]}"; do
  repo="${entry%%:*}"; port="${entry##*:}"
  (cd "$DIR/$repo" && nohup npm run dev -- --port "$port" --strictPort > "/tmp/dau-$repo.log" 2>&1 &)
done

echo "▶ starting DAU host…"
(cd "$DIR/idle-time-learning-doodad" && nohup npm run dev -- --port 8090 --strictPort > /tmp/dau-host.log 2>&1 &)

sleep 12
echo "▶ health:"
for port in 8080 8091 8092 8093 8094 8095 8096 8097 8090; do
  echo "  $port: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:$port/)"
done
echo "Host: http://localhost:8090 · logs in /tmp/dau-*.log"
