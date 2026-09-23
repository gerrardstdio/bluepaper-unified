// server/rsvpApiPlugin.js
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

/** LIVE: data/customers/{slug}/rsvp-wishes.json */
function customerJsonPath(root, slug) {
  return path.resolve(root, "data", "customers", slug, "rsvp-wishes.json");
}

/** DEMO: data/rsvp-wishes.json */
function demoJsonPath(root) {
  return path.resolve(root, "data", "rsvp-wishes.json");
}

function resolveRsvpPath(root, slug) {
  const safe = String(slug || "demo")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "");

  if (!safe || safe === "demo") {
    return demoJsonPath(root);
  }

  return customerJsonPath(root, safe);
}

function readList(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, "[]\n", "utf8");
      return [];
    }
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(filePath, list) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2) + "\n", "utf8");
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

/**
 * Routes:
 *   GET  /api/rsvp/:slug
 *   POST /api/rsvp/:slug
 *
 * Contoh:
 *   /api/rsvp/gerry-bella  → data/customers/gerry-bella/rsvp-wishes.json
 *   /api/rsvp/demo         → data/rsvp-wishes.json
 */
export default function rsvpApiPlugin() {
  return {
    name: "rsvp-json-api",
    configureServer(server) {
      const root = server.config.root;

      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split("?")[0] || "";

        // /api/rsvp/:slug
        const match = pathname.match(/^\/api\/rsvp\/([^/]+)\/?$/);
        if (!match) return next();

        const storageKey = decodeURIComponent(match[1]);
        const filePath = resolveRsvpPath(root, storageKey);

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }

        try {
          if (req.method === "GET") {
            return sendJson(res, 200, readList(filePath));
          }

          if (req.method === "POST") {
            const body = await readBody(req);
            const nama = String(body.nama ?? "").trim();
            const ucapan = String(body.ucapan ?? "").trim();
            const kehadiran = body.kehadiran === "tidak" ? "tidak" : "hadir";
            const jumlahTamu =
              kehadiran === "hadir"
                ? Math.max(1, Number(body.jumlahTamu) || 1)
                : 0;

            if (!nama || !ucapan) {
              return sendJson(res, 400, {
                message: "Nama dan ucapan wajib diisi",
              });
            }

            const list = readList(filePath);
            const entry = {
              id: randomUUID(),
              createdAt: new Date().toISOString(),
              nama,
              ucapan,
              kehadiran,
              jumlahTamu,
            };
            const next = [entry, ...list];
            writeList(filePath, next);
            return sendJson(res, 201, { list: next, entry });
          }

          return sendJson(res, 405, { message: "Method not allowed" });
        } catch (err) {
          console.error("[rsvp-api]", err);
          return sendJson(res, 500, { message: "Server error" });
        }
      });
    },
  };
}
