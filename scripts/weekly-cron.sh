#!/usr/bin/env bash
# AreteOS — weekly growth-card trigger for a server crontab.
# Install (run once on the machine that hosts the app, in your shell):
#   ( crontab -l 2>/dev/null; echo '0 9 * * 1 /ABSOLUTE/PATH/AreteOS/scripts/weekly-cron.sh >> /tmp/areteos-weekly.log 2>&1' ) | crontab -
# Reads APP_URL + CRON_SECRET from the repo .env (no secrets in your crontab).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$HERE/../.env"
if [ -f "$ENV_FILE" ]; then set -a; . "$ENV_FILE"; set +a; fi
APP_URL="${APP_URL:-http://localhost:3000}"
: "${CRON_SECRET:?CRON_SECRET is not set (add it to .env)}"
echo "[$(date -Is)] AreteOS weekly: POST ${APP_URL%/}/api/cron/weekly"
curl -fsS --max-time 180 -X POST -H "Authorization: Bearer ${CRON_SECRET}" "${APP_URL%/}/api/cron/weekly"
echo
echo "[$(date -Is)] done."
