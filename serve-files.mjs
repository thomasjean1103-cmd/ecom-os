import { createServer } from "http";
import { readFileSync } from "fs";
import { join } from "path";

const BASE = "/home/user/ecom-os";
const FILES = {
  "globals.css":    "src/app/globals.css",
  "sidebar.tsx":    "src/components/layout/sidebar.tsx",
  "header.tsx":     "src/components/layout/header.tsx",
  "mobile-nav.tsx": "src/components/layout/mobile-nav.tsx",
  "card.tsx":       "src/components/ui/card.tsx",
  "page.tsx":       "src/app/page.tsx",
};

const server = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/files") {
    const result = {};
    for (const [name, rel] of Object.entries(FILES)) {
      result[name] = readFileSync(join(BASE, rel), "utf8");
    }
    res.end(JSON.stringify(result, null, 2));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Use GET /files" }));
  }
});

server.listen(3001, "0.0.0.0", () => {
  console.log("Server ready on http://localhost:3001/files");
});
