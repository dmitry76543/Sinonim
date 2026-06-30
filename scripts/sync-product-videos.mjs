/**
 * Copy product videos from source folder to public/videos/products/.
 * Filename must match art number: 191-001050.mp4
 *
 * Usage:
 *   node scripts/sync-product-videos.mjs
 *   node scripts/sync-product-videos.mjs "C:/path/to/видео"
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storefrontRoot = path.resolve(__dirname, "..");
const defaultSource = path.resolve(
  storefrontRoot,
  "..",
  "images",
  "Кольца",
  "видео",
);
const targetDir = path.join(storefrontRoot, "public", "videos", "products");

const sourceDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : defaultSource;

if (!existsSync(sourceDir)) {
  console.error(`Source folder not found: ${sourceDir}`);
  process.exit(1);
}

mkdirSync(targetDir, { recursive: true });

const files = readdirSync(sourceDir).filter((name) =>
  name.toLowerCase().endsWith(".mp4"),
);

let copied = 0;
for (const file of files) {
  copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
  copied += 1;
}

console.log(`Copied ${copied} videos to ${targetDir}`);
