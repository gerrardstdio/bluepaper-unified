// src/pages/admin/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminFetch, clearAdminPassword } from "../../lib/adminApi";

function toSlug(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function randomManageCode() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < 8; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + Number(days));
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

function formatUntil(iso) {
  if (!iso) return "Tanpa batas";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getLifecycle(c) {
  const now = Date.now();
  const until = c.activeUntil ? new Date(c.activeUntil).getTime() : null;
  const expired = until != null && !Number.isNaN(until) && now > until;

  if (c.status === "suspended") {
    return { label: "Suspend", tone: "red", expired };
  }
  if (c.status === "draft") {
    return { label: "Draft", tone: "neutral", expired: false };
  }
  if (expired) {
    return { label: "Kedaluwarsa", tone: "amber", expired: true };
  }
  return { label: "Aktif", tone: "emerald", expired: false };
}

function daysLeft(c) {
  if (!c.activeUntil || c.status === "suspended") return null;
  const until = new Date(c.activeUntil).getTime();
  if (Number.isNaN(until)) return null;
  const diff = until - Date.now();
  if (diff < 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function buildWaMessage({ groom, bride, slug, manageCode, origin }) {
  const kelolaUrl = `${origin}/kelola/${slug}`;
  const liveUrl = `${origin}/live/${slug}`;
  return (
    `Assalamualaikum/Halo ${groom} & ${bride},\n\n` +
    `Berikut akses kelola daftar tamu undangan digital Anda:\n\n` +
    `🔗 Link kelola tamu:\n${kelolaUrl}\n\n` +
    `🔑 Kode akses:\n${manageCode}\n\n` +
    `Preview undangan:\n${liveUrl}\n\n` +
    `Cara pakai:\n` +
    `1. Buka link kelola\n` +
    `2. Masukkan kode akses\n` +
    `3. Salin / bagikan link tiap tamu, centang jika sudah dikirim\n\n` +
    `Terima kasih 🙏\nBluepaper Invitation`
  );
}

const DURATION_OPTIONS = [
  { value: 7, label: "7 hari" },
  { value: 14, label: "14 hari" },
  { value: 30, label: "1 bulan (30 hari)" },
  { value: 60, label: "2 bulan" },
  { value: 90, label: "3 bulan" },
  { value: 180, label: "6 bulan" },
  { value: 365, label: "1 tahun" },
  { value: 0, label: "Tanpa batas" },
];

const EXTEND_OPTIONS = [
  { value: 7, label: "+7 hari" },
  { value: 30, label: "+1 bulan" },
  { value: 60, label: "+2 bulan" },
  { value: 90, label: "+3 bulan" },
  { value: 180, label: "+6 bulan" },
];

export default function AdminDashboard() {
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [groom, setGroom] = useState("");
  const [bride, setBride] = useState("");
  const [manageCode, setManageCode] = useState(() => randomManageCode());
  const [template, setTemplate] = useState("template-1");
  const [createDays, setCreateDays] = useState(30);
  const [creating, setCreating] = useState(false);
  const [busySlug, setBusySlug] = useState("");
  const navigate = useNavigate();

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const load = async () => {
    try {
      setList(await adminFetch("/api/admin/customers"));
      setError("");
    } catch (e) {
      if (e.status === 401) {
        clearAdminPassword();
        navigate("/admin/login");
        return;
      }
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (slugManual) return;
    const parts = [groom, bride].map((s) => toSlug(s)).filter(Boolean);
    setSlug(parts.join("-"));
  }, [groom, bride, slugManual]);

  const create = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setMsg("");
    try {
      const code = manageCode.trim() || randomManageCode();
      const activeUntil =
        Number(createDays) > 0 ? daysFromNow(createDays) : null;

      const data = await adminFetch("/api/admin/customers", {
        method: "POST",
        body: JSON.stringify({
          slug,
          template,
          status: "live",
          manageCode: code,
          activeUntil,
          suspendedAt: null,
          couple: { groom, bride, weddingDateLabel: "" },
        }),
      });

      setMsg(
        `Customer dibuat · aktif ${
          activeUntil ? `sampai ${formatUntil(activeUntil)}` : "tanpa batas"
        }`,
      );
      setGroom("");
      setBride("");
      setSlug("");
      setSlugManual(false);
      setManageCode(randomManageCode());
      setCreateDays(30);
      await load();
      navigate(`/admin/${data.slug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const patchCustomer = async (c, patch, successMsg) => {
    setBusySlug(c.slug);
    setError("");
    setMsg("");
    try {
      const full = await adminFetch(`/api/admin/customers/${c.slug}`);
      await adminFetch(`/api/admin/customers/${c.slug}`, {
        method: "PUT",
        body: JSON.stringify({
          ...full,
          ...patch,
          updatedAt: new Date().toISOString(),
        }),
      });
      setMsg(successMsg);
      await load();
    } catch (err) {
      setError(err.message || "Gagal menyimpan");
    } finally {
      setBusySlug("");
    }
  };

  const suspend = (c) => {
    if (
      !window.confirm(
        `Suspend undangan ${c.couple?.groom || "—"} & ${c.couple?.bride || "—"}?`,
      )
    ) {
      return;
    }
    patchCustomer(
      c,
      {
        status: "suspended",
        suspendedAt: new Date().toISOString(),
      },
      "Customer di-suspend",
    );
  };

  const activate = (c, days) => {
    const activeUntil = Number(days) > 0 ? daysFromNow(days) : null;
    patchCustomer(
      c,
      {
        status: "live",
        activeUntil,
        suspendedAt: null,
      },
      activeUntil
        ? `Diaktifkan sampai ${formatUntil(activeUntil)}`
        : "Diaktifkan tanpa batas waktu",
    );
  };

  const extend = (c, days) => {
    const base =
      c.activeUntil && new Date(c.activeUntil).getTime() > Date.now()
        ? new Date(c.activeUntil)
        : new Date();
    base.setDate(base.getDate() + Number(days));
    base.setHours(23, 59, 59, 999);
    patchCustomer(
      c,
      {
        status: "live",
        activeUntil: base.toISOString(),
        suspendedAt: null,
      },
      `Diperpanjang sampai ${formatUntil(base.toISOString())}`,
    );
  };

  const removeCustomer = async (c) => {
    const name = `${c.couple?.groom || "—"} & ${c.couple?.bride || "—"}`;
    if (
      !window.confirm(
        `HAPUS permanen “${name}” (${c.slug})?\nFolder data/customers/${c.slug} akan dihapus. Tidak bisa dibatalkan.`,
      )
    ) {
      return;
    }
    setBusySlug(c.slug);
    setError("");
    try {
      await adminFetch(`/api/admin/customers/${c.slug}`, { method: "DELETE" });
      setMsg(`Customer dihapus: ${c.slug}`);
      await load();
    } catch (err) {
      setError(err.message || "Gagal menghapus");
    } finally {
      setBusySlug("");
    }
  };

  const shareToWhatsApp = (c) => {
    setError("");
    setMsg("");
    const code = (c.manageCode || "").trim();
    if (!code) {
      setError("Kode kelola belum ada. Edit → set kode → Simpan.");
      return;
    }
    const text = buildWaMessage({
      groom: c.couple?.groom || "Mempelai",
      bride: c.couple?.bride || "",
      slug: c.slug,
      manageCode: code,
      origin,
    });
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setMsg("WhatsApp dibuka — pilih chat, lalu kirim.");
  };

  const sorted = useMemo(() => {
    return [...list].sort((a, b) => {
      const order = { suspended: 0, draft: 1, live: 2 };
      return (order[a.status] ?? 9) - (order[b.status] ?? 9);
    });
  }, [list]);

  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-neutral-400">
            Admin · bluepaper-invitation.co
          </p>
          <h1 className="font-serif text-xl">Customer Undangan</h1>
        </div>
        <button
          type="button"
          className="text-sm text-neutral-500 hover:text-neutral-800"
          onClick={() => {
            clearAdminPassword();
            navigate("/admin/login");
          }}
        >
          Logout
        </button>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {error && (
          <p className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {msg && (
          <p className="mb-4 rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {msg}
          </p>
        )}

        {/* CREATE */}
        <section className="mb-10 border bg-white p-6 shadow-sm">
          <h2 className="font-serif text-lg">Buat Customer Baru</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Set masa aktif (countdown). Setelah lewat, undangan tidak bisa
            dibuka sampai diaktifkan lagi.
          </p>

          <form onSubmit={create} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-neutral-800">
                  Nama mempelai pria
                </span>
                <input
                  required
                  value={groom}
                  onChange={(e) => setGroom(e.target.value)}
                  placeholder="Andi Pratama"
                  className="mt-1.5 w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-800"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-neutral-800">
                  Nama mempelai wanita
                </span>
                <input
                  required
                  value={bride}
                  onChange={(e) => setBride(e.target.value)}
                  placeholder="Sinta Dewi"
                  className="mt-1.5 w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-800"
                />
              </label>
            </div>

            <label className="block text-sm">
              <span className="font-medium text-neutral-800">Slug URL</span>
              <input
                required
                value={slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setSlug(toSlug(e.target.value));
                }}
                className="mt-1.5 w-full border border-neutral-300 px-3 py-2.5 font-mono text-sm outline-none focus:border-neutral-800"
              />
              <span className="mt-1 block text-xs text-neutral-500">
                Live: <strong>/live/{slug || "…"}</strong>
                {" · "}
                Kelola: <strong>/kelola/{slug || "…"}</strong>
              </span>
              {slugManual && (
                <button
                  type="button"
                  className="mt-1 text-xs text-blue-600 underline"
                  onClick={() => setSlugManual(false)}
                >
                  Pakai slug otomatis dari nama
                </button>
              )}
            </label>

            <label className="block text-sm">
              <span className="font-medium text-neutral-800">
                Kode kelola tamu
              </span>
              <span className="mt-0.5 block text-xs text-neutral-400">
                Untuk halaman /kelola/{slug || "slug"} — share ke pasangan
              </span>
              <div className="mt-1.5 flex gap-2">
                <input
                  required
                  value={manageCode}
                  onChange={(e) => setManageCode(e.target.value.trim())}
                  className="w-full border border-neutral-300 px-3 py-2.5 font-mono text-sm outline-none focus:border-neutral-800"
                  placeholder="contoh: gerry2026"
                />
                <button
                  type="button"
                  onClick={() => setManageCode(randomManageCode())}
                  className="shrink-0 border border-neutral-300 px-3 text-xs hover:border-neutral-800"
                >
                  Acak
                </button>
              </div>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-neutral-800">
                  Masa aktif (countdown)
                </span>
                <select
                  value={createDays}
                  onChange={(e) => setCreateDays(Number(e.target.value))}
                  className="mt-1.5 w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-800"
                >
                  {DURATION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="font-medium text-neutral-800">Template</span>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="mt-1.5 w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-800"
                >
                  <option value="template-1">template-1 — Amplop Biru</option>
                  <option value="template-2">template-2 — (belum)</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              disabled={creating || !slug || !manageCode.trim()}
              className="w-full bg-neutral-900 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {creating ? "Membuat…" : "Create & lanjut isi konten"}
            </button>
          </form>
        </section>

        {/* LIST */}
        <section>
          <h2 className="mb-3 font-serif text-lg">Daftar customer</h2>
          <div className="divide-y border bg-white shadow-sm">
            {sorted.length === 0 ? (
              <p className="p-6 text-sm text-neutral-500">
                Belum ada customer.
              </p>
            ) : (
              sorted.map((c) => {
                const hasCode = Boolean((c.manageCode || "").trim());
                const life = getLifecycle(c);
                const left = daysLeft(c);
                const busy = busySlug === c.slug;
                const isSuspended = c.status === "suspended" || life.expired;

                const badge =
                  life.tone === "emerald"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : life.tone === "red"
                      ? "bg-red-50 text-red-800 border-red-200"
                      : life.tone === "amber"
                        ? "bg-amber-50 text-amber-900 border-amber-200"
                        : "bg-neutral-50 text-neutral-600 border-neutral-200";

                return (
                  <div key={c.slug} className="px-5 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-neutral-900">
                            {c.couple?.groom || "—"} &amp;{" "}
                            {c.couple?.bride || "—"}
                          </p>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${badge}`}
                          >
                            {life.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          <span className="font-mono">/live/{c.slug}</span>
                          {" · "}
                          <span className="font-mono">/kelola/{c.slug}</span>
                          {" · "}
                          aktif sampai:{" "}
                          <strong>{formatUntil(c.activeUntil)}</strong>
                          {left != null &&
                            c.status === "live" &&
                            !life.expired && (
                              <span className="text-neutral-400">
                                {" "}
                                ({left} hari lagi)
                              </span>
                            )}
                        </p>
                        {hasCode ? (
                          <p className="mt-1 text-xs text-neutral-600">
                            Kode:{" "}
                            <span className="font-mono font-medium">
                              {c.manageCode}
                            </span>
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-amber-600">
                            Kode kelola belum diset — isi di Edit
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`/live/${c.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="border border-neutral-300 px-3 py-1.5 text-xs hover:border-neutral-800"
                        >
                          Live Preview
                        </a>
                        <a
                          href={`/kelola/${c.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="border border-neutral-300 px-3 py-1.5 text-xs hover:border-neutral-800"
                        >
                          Kelola Customer
                        </a>
                        <button
                          type="button"
                          onClick={() => shareToWhatsApp(c)}
                          disabled={!hasCode}
                          className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Share WA
                        </button>
                        <Link
                          to={`/admin/${c.slug}`}
                          className="bg-neutral-900 px-3 py-1.5 text-xs text-white hover:bg-neutral-800"
                        >
                          Edit Konten
                        </Link>
                      </div>
                    </div>

                    {/* Lifecycle */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-3">
                      {c.status === "live" && !life.expired && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => suspend(c)}
                          className="rounded-md border border-amber-300 px-3 py-1.5 text-xs text-amber-900 hover:bg-amber-50 disabled:opacity-50"
                        >
                          Suspend
                        </button>
                      )}

                      {(c.status === "suspended" ||
                        life.expired ||
                        c.status === "draft") && (
                        <>
                          <span className="w-full text-[10px] text-neutral-400 sm:w-auto">
                            Aktifkan selama:
                          </span>
                          {EXTEND_OPTIONS.map((o) => (
                            <button
                              key={`act-${o.value}`}
                              type="button"
                              disabled={busy}
                              onClick={() => activate(c, o.value)}
                              className="rounded-md border border-emerald-300 px-2.5 py-1.5 text-xs text-emerald-900 hover:bg-emerald-50 disabled:opacity-50"
                            >
                              {o.label}
                            </button>
                          ))}
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => activate(c, 0)}
                            className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs hover:border-neutral-800 disabled:opacity-50"
                          >
                            Tanpa batas
                          </button>
                        </>
                      )}

                      {c.status === "live" && !life.expired && (
                        <>
                          <span className="text-[10px] text-neutral-400">
                            Perpanjang:
                          </span>
                          {EXTEND_OPTIONS.map((o) => (
                            <button
                              key={`ext-${o.value}`}
                              type="button"
                              disabled={busy}
                              onClick={() => extend(c, o.value)}
                              className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs hover:border-neutral-800 disabled:opacity-50"
                            >
                              {o.label}
                            </button>
                          ))}
                        </>
                      )}

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => removeCustomer(c)}
                        className={`ml-auto rounded-md border px-3 py-1.5 text-xs disabled:opacity-50 ${
                          isSuspended
                            ? "border-red-400 bg-red-50 text-red-800 hover:bg-red-100"
                            : "border-red-200 text-red-600 hover:bg-red-50"
                        }`}
                        title="Hapus permanen folder customer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
