import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// The game is a single static page, so no incremental cache (R2/KV) is needed.
export default defineCloudflareConfig({});
