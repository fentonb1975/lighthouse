#!/usr/bin/env bash
set -euo pipefail

read -rsp "Cloudflare API token (hidden): " token
echo
read -rp "Cloudflare account ID: " account_id

printf '%s' "$token" | gh secret set CLOUDFLARE_API_TOKEN
printf '%s' "$account_id" | gh secret set CLOUDFLARE_ACCOUNT_ID

unset token account_id
echo "Both secrets saved to $(gh repo view --json nameWithOwner -q .nameWithOwner)."
