#!/usr/bin/env bash
set -euo pipefail

read -rsp "Cloudflare API token (hidden): " token
echo
read -rp "Cloudflare account ID: " account_id

# Strip stray spaces and line breaks picked up when pasting.
token="${token//[[:space:]]/}"
account_id="${account_id//[[:space:]]/}"

printf '%s' "$token" | gh secret set CLOUDFLARE_API_TOKEN
printf '%s' "$account_id" | gh secret set CLOUDFLARE_ACCOUNT_ID

unset token account_id
echo "Both secrets saved to $(gh repo view --json nameWithOwner -q .nameWithOwner)."
