import { readFileSync } from "fs";
import { join } from "path";

const BASE = process.cwd();

const FILES: Record<string, string> = {
  "globals.css":    "src/app/globals.css",
  "sidebar.tsx":    "src/components/layout/sidebar.tsx",
  "header.tsx":     "src/components/layout/header.tsx",
  "mobile-nav.tsx": "src/components/layout/mobile-nav.tsx",
  "card.tsx":       "src/components/ui/card.tsx",
  "page.tsx":       "src/app/page.tsx",
};

export async function GET() {
  const result: Record<string, string> = {};
  for (const [name, rel] of Object.entries(FILES)) {
    result[name] = readFileSync(join(BASE, rel), "utf8");
  }
  return Response.json(result);
}
