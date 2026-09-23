// server/adminApiPlugin.js
import fs from "node:fs";
import path from "node:path";
import {
  ensureUniqueToken,
  newGuestId,
  normalizeGuests,
} from "./guestToken.js";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "bluepaperadmin123";

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

function safeSlug(slug) {
  return String(slug || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .slice(0, 80);
}

function customersDir(root) {
  return path.resolve(root, "data", "customers");
}

function weddingPath(root, slug) {
  return path.join(customersDir(root), safeSlug(slug), "wedding.json");
}

function rsvpPath(root, slug) {
  return path.join(customersDir(root), safeSlug(slug), "rsvp-wishes.json");
}

function ensureFolder(root, slug) {
  const dir = path.join(customersDir(root), safeSlug(slug));
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function readWishesFile(root, slug) {
  const file = rsvpPath(root, slug);
  try {
    if (!fs.existsSync(file)) return [];
    const parsed = JSON.parse(fs.readFileSync(file, "utf8") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeWishesFile(root, slug, list) {
  const file = rsvpPath(root, slug);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(list, null, 2) + "\n", "utf8");
}

/** Field yang customer tidak boleh ubah lewat public PUT */
function stripProtectedFields(body = {}) {
  const {
    status,
    manageCode,
    activeUntil,
    suspendedAt,
    slug,
    createdAt,
    code, // kode auth, bukan field wedding
    ...rest
  } = body;
  return rest;
}

function isExpired(data) {
  if (!data?.activeUntil) return false;
  const until = new Date(data.activeUntil).getTime();
  return !Number.isNaN(until) && Date.now() > until;
}

function isBlocked(data) {
  if (!data) return true;
  if (data.status === "draft" || data.status === "suspended") return true;
  if (isExpired(data)) return true;
  return false;
}

function readWedding(root, slug) {
  const file = weddingPath(root, slug);
  if (!fs.existsSync(file)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    data.guests = normalizeGuests(data.guests || []);
    return data;
  } catch {
    return null;
  }
}

function writeWedding(root, slug, data) {
  ensureFolder(root, slug);
  data.guests = normalizeGuests(data.guests || []);
  fs.writeFileSync(
    weddingPath(root, slug),
    JSON.stringify(data, null, 2) + "\n",
    "utf8",
  );
  const rsvp = rsvpPath(root, slug);
  if (!fs.existsSync(rsvp)) {
    fs.writeFileSync(rsvp, "[]\n", "utf8");
  }
  return data;
}

function listCustomers(root) {
  const dir = customersDir(root);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const data = readWedding(root, d.name);
      if (!data) return null;
      return {
        slug: data.slug || d.name,
        template: data.template || "template-1",
        status: data.status || "live",
        couple: data.couple || {},
        manageCode: data.manageCode || "",
        activeUntil: data.activeUntil || null,
        suspendedAt: data.suspendedAt || null,
        updatedAt: data.updatedAt || null,
        guestCount: Array.isArray(data.guests) ? data.guests.length : 0,
      };
    })
    .filter(Boolean);
}

function checkAuth(req) {
  return (req.headers["x-admin-password"] || "") === ADMIN_PASSWORD;
}

function emptyWedding(slug) {
  return {
    slug: safeSlug(slug),
    template: "template-1",
    status: "live",
    manageCode: "",
    activeUntil: null,
    suspendedAt: null,
    couple: {
      groom: "",
      bride: "",
      weddingDateLabel: "",
      brideParents: "",
      groomParents: "",
      brideIg: "",
      groomIg: "",
    },
    weddingDate: "",
    photos: {
      cover: "",
      hero: "",
      bride: "",
      groom: "",
      journey: "",
      event: "",
      streaming: "",
      rsvp: "",
      wishes: "",
      gallery: "",
      gift: "",
      thankyou: "",
    },
    gallery: [],
    musicUrl: "",
    guests: [
      {
        id: newGuestId(),
        token: "tamu-undangan",
        name: "Tamu Undangan",
        createdAt: new Date().toISOString(),
        shared: false,
        sharedAt: null,
      },
    ],
    journeys: [],
    events: [],
    calendarUrl: "",
    streamingUrl: "",
    galleryVideoUrl: "",
    giftAccounts: [],
    giftAddress: { name: "", recipient: "", lines: [], address: "" },
    heroVerseText: "",
    heroVerseRef: "",
    company: {
      name: "bluepaper-invitation.co",
      copyrightYear: new Date().getFullYear(),
      whatsapp: "",
      socials: [],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export default function adminApiPlugin() {
  return {
    name: "admin-json-api",
    configureServer(server) {
      const root = server.config.root;

      server.middlewares.use(async (req, res, next) => {
        const url = (req.url || "").split("?")[0];

        if (url.startsWith("/api/admin") || url.startsWith("/api/public")) {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          );
          res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, x-admin-password",
          );
          if (req.method === "OPTIONS") {
            res.statusCode = 204;
            res.end();
            return;
          }
        }

        try {
          // ——— LOGIN ADMIN ———
          if (url === "/api/admin/login" && req.method === "POST") {
            const body = await readBody(req);
            if (body.password === ADMIN_PASSWORD) {
              return sendJson(res, 200, { ok: true });
            }
            return sendJson(res, 401, { message: "Password salah" });
          }

          // ——— PUBLIC: wedding.json live ———
          {
            const m = url.match(/^\/api\/public\/customer\/([a-z0-9-_]+)$/i);
            if (m && req.method === "GET") {
              const data = readWedding(root, m[1]);
              if (!data || data.status === "draft") {
                return sendJson(res, 404, { message: "Tidak ditemukan" });
              }
              if (data.status === "suspended") {
                return sendJson(res, 403, {
                  message: "Undangan dinonaktifkan",
                });
              }
              if (isExpired(data)) {
                return sendJson(res, 403, {
                  message: "Masa aktif undangan berakhir",
                });
              }
              return sendJson(res, 200, data);
            }
          }

          // ——— PUBLIC: auth kelola (kembalikan wedding penuh) ———
          {
            const mAuth = url.match(
              /^\/api\/public\/customer\/([a-z0-9-_]+)\/manage-auth$/i,
            );
            if (mAuth && req.method === "POST") {
              const slug = mAuth[1];
              const data = readWedding(root, slug);
              if (!data || data.status === "draft") {
                return sendJson(res, 404, { message: "Tidak ditemukan" });
              }
              if (isBlocked(data)) {
                return sendJson(res, 403, {
                  message: "Akses kelola tidak aktif (suspend / kedaluwarsa)",
                });
              }
              const body = await readBody(req);
              const code = String(body.code || "").trim();
              const expected = String(data.manageCode || "").trim();
              if (!expected || code !== expected) {
                return sendJson(res, 401, { message: "Kode akses salah" });
              }
              return sendJson(res, 200, {
                ok: true,
                wedding: data,
              });
            }
          }

          // ——— PUBLIC: update konten undangan (manageCode) ———
          {
            const mPut = url.match(
              /^\/api\/public\/customer\/([a-z0-9-_]+)\/wedding$/i,
            );
            if (mPut && req.method === "PUT") {
              const slug = mPut[1];
              const existing = readWedding(root, slug);
              if (!existing || existing.status === "draft") {
                return sendJson(res, 404, { message: "Tidak ditemukan" });
              }
              if (isBlocked(existing)) {
                return sendJson(res, 403, {
                  message: "Akses kelola tidak aktif",
                });
              }
              const body = await readBody(req);
              const code = String(body.code || "").trim();
              const expected = String(existing.manageCode || "").trim();
              if (!expected || code !== expected) {
                return sendJson(res, 401, { message: "Kode akses salah" });
              }
              const patch = stripProtectedFields(body);
              const data = {
                ...existing,
                ...patch,
                slug: existing.slug,
                status: existing.status,
                manageCode: existing.manageCode,
                activeUntil: existing.activeUntil,
                suspendedAt: existing.suspendedAt,
                createdAt: existing.createdAt,
                guests: normalizeGuests(
                  patch.guests != null ? patch.guests : existing.guests,
                ),
                updatedAt: new Date().toISOString(),
              };
              writeWedding(root, slug, data);
              return sendJson(res, 200, data);
            }
          }

          // ——— PUBLIC: checklist sudah dibagikan ———
          {
            const mShared = url.match(
              /^\/api\/public\/customer\/([a-z0-9-_]+)\/guests\/shared$/i,
            );
            if (mShared && req.method === "PATCH") {
              const slug = mShared[1];
              const data = readWedding(root, slug);
              if (!data || data.status === "draft") {
                return sendJson(res, 404, { message: "Tidak ditemukan" });
              }
              if (isBlocked(data)) {
                return sendJson(res, 403, {
                  message: "Akses kelola tidak aktif",
                });
              }
              const body = await readBody(req);
              const code = String(body.code || "").trim();
              const expected = String(data.manageCode || "").trim();
              if (!expected || code !== expected) {
                return sendJson(res, 401, { message: "Kode akses salah" });
              }
              const token = String(body.token || "").trim();
              if (!token) {
                return sendJson(res, 400, { message: "token wajib" });
              }
              const shared = Boolean(body.shared);
              const guests = normalizeGuests(data.guests || []).map((g) => {
                if (g.token !== token) return g;
                return {
                  ...g,
                  shared,
                  sharedAt: shared ? new Date().toISOString() : null,
                };
              });
              data.guests = guests;
              data.updatedAt = new Date().toISOString();
              writeWedding(root, slug, data);
              return sendJson(res, 200, { guests });
            }
          }

          // ——— PUBLIC: tambah / hapus tamu (manageCode) ———
          {
            const mGuests = url.match(
              /^\/api\/public\/customer\/([a-z0-9-_]+)\/guests$/i,
            );
            if (mGuests) {
              const slug = mGuests[1];
              const data = readWedding(root, slug);
              if (!data || data.status === "draft") {
                return sendJson(res, 404, { message: "Tidak ditemukan" });
              }
              if (isBlocked(data)) {
                return sendJson(res, 403, {
                  message: "Akses kelola tidak aktif",
                });
              }

              if (req.method === "POST") {
                const body = await readBody(req);
                const code = String(body.code || "").trim();
                const expected = String(data.manageCode || "").trim();
                if (!expected || code !== expected) {
                  return sendJson(res, 401, { message: "Kode akses salah" });
                }
                const name = String(body.name || "").trim();
                if (!name) {
                  return sendJson(res, 400, { message: "Nama tamu wajib" });
                }

                const guests = Array.isArray(data.guests)
                  ? [...data.guests]
                  : [];
                const token = ensureUniqueToken(guests.map((g) => g.token));
                guests.push({
                  id: newGuestId(),
                  token,
                  name,
                  createdAt: new Date().toISOString(),
                  shared: false,
                  sharedAt: null,
                });
                data.guests = normalizeGuests(guests);
                data.updatedAt = new Date().toISOString();
                writeWedding(root, slug, data);
                return sendJson(res, 201, { guests: data.guests });
              }

              if (req.method === "DELETE") {
                const body = await readBody(req);
                const code = String(body.code || "").trim();
                const expected = String(data.manageCode || "").trim();
                if (!expected || code !== expected) {
                  return sendJson(res, 401, { message: "Kode akses salah" });
                }
                const token = String(body.token || "").trim();
                if (!token) {
                  return sendJson(res, 400, { message: "token wajib" });
                }
                data.guests = normalizeGuests(
                  (data.guests || []).filter((g) => g.token !== token),
                );
                data.updatedAt = new Date().toISOString();
                writeWedding(root, slug, data);
                return sendJson(res, 200, { guests: data.guests });
              }
            }
          }

          // ——— ADMIN: list ———
          if (url === "/api/admin/customers" && req.method === "GET") {
            if (!checkAuth(req)) {
              return sendJson(res, 401, { message: "Unauthorized" });
            }
            return sendJson(res, 200, listCustomers(root));
          }

          // ——— ADMIN: create ———
          if (url === "/api/admin/customers" && req.method === "POST") {
            if (!checkAuth(req)) {
              return sendJson(res, 401, { message: "Unauthorized" });
            }
            const body = await readBody(req);
            const slug = safeSlug(body.slug);
            if (!slug) {
              return sendJson(res, 400, { message: "Slug wajib" });
            }
            if (readWedding(root, slug)) {
              return sendJson(res, 409, { message: "Slug sudah dipakai" });
            }
            const base = emptyWedding(slug);
            const data = {
              ...base,
              ...body,
              slug,
              couple: { ...base.couple, ...(body.couple || {}) },
              guests: normalizeGuests(
                Array.isArray(body.guests) && body.guests.length
                  ? body.guests
                  : base.guests,
              ),
              template: body.template || "template-1",
              status: body.status || "live",
              manageCode: String(body.manageCode || "").trim(),
              activeUntil:
                body.activeUntil === undefined
                  ? null
                  : body.activeUntil || null,
              suspendedAt: body.suspendedAt || null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            writeWedding(root, slug, data);
            return sendJson(res, 201, data);
          }

          // ——— ADMIN: get / put / delete ———
          {
            const m = url.match(/^\/api\/admin\/customers\/([a-z0-9-_]+)$/i);
            if (m) {
              if (!checkAuth(req)) {
                return sendJson(res, 401, { message: "Unauthorized" });
              }
              const slug = m[1];

              if (req.method === "GET") {
                const data = readWedding(root, slug);
                if (!data) {
                  return sendJson(res, 404, { message: "Not found" });
                }
                return sendJson(res, 200, data);
              }

              if (req.method === "PUT") {
                const body = await readBody(req);
                const existing = readWedding(root, slug) || emptyWedding(slug);
                const data = {
                  ...existing,
                  ...body,
                  slug,
                  guests: normalizeGuests(
                    body.guests != null ? body.guests : existing.guests,
                  ),
                  manageCode:
                    body.manageCode != null
                      ? String(body.manageCode).trim()
                      : existing.manageCode || "",
                  activeUntil:
                    body.activeUntil !== undefined
                      ? body.activeUntil || null
                      : existing.activeUntil || null,
                  suspendedAt:
                    body.suspendedAt !== undefined
                      ? body.suspendedAt
                      : existing.suspendedAt || null,
                  status: body.status || existing.status || "live",
                  updatedAt: new Date().toISOString(),
                };
                writeWedding(root, slug, data);
                return sendJson(res, 200, data);
              }

              if (req.method === "DELETE") {
                const dir = path.join(customersDir(root), safeSlug(slug));
                if (fs.existsSync(dir)) {
                  fs.rmSync(dir, { recursive: true, force: true });
                }
                return sendJson(res, 200, { ok: true });
              }
            }
          }

          // ——— ADMIN: guests ———
          {
            const m = url.match(
              /^\/api\/admin\/customers\/([a-z0-9-_]+)\/guests$/i,
            );
            if (m) {
              if (!checkAuth(req)) {
                return sendJson(res, 401, { message: "Unauthorized" });
              }
              const slug = m[1];
              const existing = readWedding(root, slug);
              if (!existing) {
                return sendJson(res, 404, { message: "Not found" });
              }

              if (req.method === "POST") {
                const body = await readBody(req);
                const name = String(body.name || "").trim();
                if (!name) {
                  return sendJson(res, 400, { message: "Nama tamu wajib" });
                }
                const guests = Array.isArray(existing.guests)
                  ? [...existing.guests]
                  : [];
                const token = ensureUniqueToken(guests.map((g) => g.token));
                guests.push({
                  id: newGuestId(),
                  token,
                  name,
                  createdAt: new Date().toISOString(),
                  shared: false,
                  sharedAt: null,
                });
                existing.guests = normalizeGuests(guests);
                existing.updatedAt = new Date().toISOString();
                writeWedding(root, slug, existing);
                return sendJson(res, 201, existing.guests);
              }

              if (req.method === "PUT") {
                const body = await readBody(req);
                const list = Array.isArray(body) ? body : body.guests;
                if (!Array.isArray(list)) {
                  return sendJson(res, 400, {
                    message: "guests harus array",
                  });
                }
                existing.guests = normalizeGuests(list);
                existing.updatedAt = new Date().toISOString();
                writeWedding(root, slug, existing);
                return sendJson(res, 200, existing.guests);
              }

              if (req.method === "DELETE") {
                const q = new URL(req.url || "", "http://local").searchParams;
                const token = q.get("token");
                if (!token) {
                  return sendJson(res, 400, {
                    message: "Query token wajib",
                  });
                }
                existing.guests = normalizeGuests(
                  (existing.guests || []).filter((g) => g.token !== token),
                );
                existing.updatedAt = new Date().toISOString();
                writeWedding(root, slug, existing);
                return sendJson(res, 200, existing.guests);
              }
            }
          }

          // ——— ADMIN: wishes / RSVP ———
          {
            const mW = url.match(
              /^\/api\/admin\/customers\/([a-z0-9-_]+)\/wishes$/i,
            );
            if (mW) {
              if (!checkAuth(req)) {
                return sendJson(res, 401, { message: "Unauthorized" });
              }
              const slug = mW[1];
              if (!readWedding(root, slug)) {
                return sendJson(res, 404, { message: "Not found" });
              }

              if (req.method === "GET") {
                return sendJson(res, 200, {
                  wishes: readWishesFile(root, slug),
                });
              }

              if (req.method === "DELETE") {
                const body = await readBody(req);
                const id = String(body.id || "").trim();
                if (!id) {
                  return sendJson(res, 400, { message: "id wajib" });
                }
                const next = readWishesFile(root, slug).filter(
                  (w) => String(w.id) !== id,
                );
                writeWishesFile(root, slug, next);
                return sendJson(res, 200, { wishes: next });
              }
            }
          }

          // ——— PUBLIC: wishes (lihat / hapus) dengan manageCode ———
          {
            const mWishes = url.match(
              /^\/api\/public\/customer\/([a-z0-9-_]+)\/wishes$/i,
            );
            if (mWishes) {
              const slug = mWishes[1];
              const data = readWedding(root, slug);
              if (!data || data.status === "draft") {
                return sendJson(res, 404, { message: "Tidak ditemukan" });
              }
              if (isBlocked(data)) {
                return sendJson(res, 403, { message: "Akses tidak aktif" });
              }

              if (req.method === "GET") {
                const q = new URL(req.url || "", "http://local").searchParams;
                const code = String(q.get("code") || "").trim();
                const expected = String(data.manageCode || "").trim();
                if (!expected || code !== expected) {
                  return sendJson(res, 401, { message: "Kode akses salah" });
                }
                return sendJson(res, 200, {
                  wishes: readWishesFile(root, slug),
                });
              }

              if (req.method === "POST") {
                const body = await readBody(req);
                const code = String(body.code || "").trim();
                const expected = String(data.manageCode || "").trim();
                if (!expected || code !== expected) {
                  return sendJson(res, 401, { message: "Kode akses salah" });
                }
                if (body.id) {
                  const next = readWishesFile(root, slug).filter(
                    (w) => String(w.id) !== String(body.id),
                  );
                  writeWishesFile(root, slug, next);
                  return sendJson(res, 200, { wishes: next });
                }
                return sendJson(res, 200, {
                  wishes: readWishesFile(root, slug),
                });
              }

              if (req.method === "DELETE") {
                const body = await readBody(req);
                const code = String(body.code || "").trim();
                const expected = String(data.manageCode || "").trim();
                if (!expected || code !== expected) {
                  return sendJson(res, 401, { message: "Kode akses salah" });
                }
                const id = String(body.id || "").trim();
                if (!id) {
                  return sendJson(res, 400, { message: "id wish wajib" });
                }
                const next = readWishesFile(root, slug).filter(
                  (w) => String(w.id) !== id,
                );
                writeWishesFile(root, slug, next);
                return sendJson(res, 200, { wishes: next });
              }
            }
          }

          return next();
        } catch (err) {
          console.error("[admin-api]", err);
          return sendJson(res, 500, { message: err.message || "Error" });
        }
      });
    },
  };
}
