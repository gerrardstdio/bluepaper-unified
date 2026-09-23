// src/pages/admin/AdminEdit.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { adminFetch, clearAdminPassword } from "../../lib/adminApi";

const PHOTO_FIELDS = [
  {
    key: "cover",
    label: "Cover",
    hint: "Foto halaman depan (sebelum undangan dibuka)",
  },
  { key: "hero", label: "Hero", hint: "Foto besar setelah cover dibuka" },
  {
    key: "bride",
    label: "Mempelai wanita",
    hint: "Latar section profil wanita",
  },
  { key: "groom", label: "Mempelai pria", hint: "Latar section profil pria" },
  { key: "journey", label: "Love Journey", hint: "Latar section kisah cinta" },
  { key: "event", label: "Wedding Event", hint: "Latar section jadwal acara" },
  {
    key: "streaming",
    label: "Streaming",
    hint: "Latar section live streaming",
  },
  { key: "rsvp", label: "RSVP", hint: "Latar form konfirmasi kehadiran" },
  { key: "wishes", label: "Ucapan", hint: "Latar daftar doa & ucapan" },
  {
    key: "gallery",
    label: "Galeri (latar)",
    hint: "Latar belakang section gallery",
  },
  { key: "gift", label: "Hadiah", hint: "Latar section amplop digital" },
  { key: "thankyou", label: "Thank You", hint: "Foto penutup undangan" },
];

const ADMIN_TABS = [
  { id: "couple", label: "1. Couple" },
  { id: "photos", label: "2. Foto" },
  { id: "journeys", label: "3. Journey" },
  { id: "events", label: "4. Event" },
  { id: "streaming", label: "5. Streaming" },
  { id: "gallery", label: "6. Gallery" },
  { id: "gift", label: "7. Gift" },
  { id: "guests", label: "8. Tamu" },
  { id: "rsvp", label: "9. RSVP" },
];

const CUSTOMER_TABS = ADMIN_TABS.map((t) => ({
  id: t.id,
  label: t.label.replace(/^\d+\.\s*/, ""),
}));

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800";

const storageKey = (s) => `manage-code:${s}`;

function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="font-medium text-neutral-800">{label}</span>
      {hint ? (
        <span className="mt-0.5 block text-xs leading-relaxed text-neutral-400">
          {hint}
        </span>
      ) : null}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function SectionIntro({ title, children }) {
  return (
    <div className="mb-6 border-b border-neutral-100 pb-4">
      <h2 className="font-serif text-xl text-neutral-900">{title}</h2>
      {children ? (
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
          {children}
        </p>
      ) : null}
    </div>
  );
}

function normalizeGallery(list) {
  return (list || [])
    .map((item, i) => {
      if (typeof item === "string") {
        return {
          id: i + 1,
          src: item,
          alt: `Gallery ${i + 1}`,
          aspect: "portrait",
        };
      }
      return {
        id: item?.id ?? i + 1,
        src: item?.src || "",
        alt: item?.alt || `Gallery ${i + 1}`,
        aspect: item?.aspect || "portrait",
      };
    })
    .filter((p) => p.src);
}

function RsvpPie({ hadir, tidak }) {
  const total = hadir + tidak;
  if (total === 0) {
    return (
      <div className="flex h-36 items-center justify-center text-xs text-neutral-400">
        Belum ada data RSVP
      </div>
    );
  }
  const r = 54;
  const c = 2 * Math.PI * r;
  const hadirLen = (hadir / total) * c;
  const tidakLen = (tidak / total) * c;
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
      <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="22"
        />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="#059669"
          strokeWidth="22"
          strokeDasharray={`${hadirLen} ${c - hadirLen}`}
          strokeDashoffset={c * 0.25}
        />
        {tidak > 0 && (
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke="#a3a3a3"
            strokeWidth="22"
            strokeDasharray={`${tidakLen} ${c - tidakLen}`}
            strokeDashoffset={c * 0.25 - hadirLen}
          />
        )}
        <text
          x="70"
          y="66"
          textAnchor="middle"
          className="fill-neutral-900 font-semibold"
          style={{ fontSize: 22 }}
        >
          {total}
        </text>
        <text
          x="70"
          y="84"
          textAnchor="middle"
          className="fill-neutral-400"
          style={{ fontSize: 10 }}
        >
          RSVP
        </text>
      </svg>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-600" />
          <span className="text-neutral-600">Hadir</span>
          <span className="ml-auto font-medium tabular-nums">
            {hadir} ({Math.round((hadir / total) * 100)}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-neutral-400" />
          <span className="text-neutral-600">Tidak hadir</span>
          <span className="ml-auto font-medium tabular-nums">
            {tidak} ({Math.round((tidak / total) * 100)}%)
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AdminEdit() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isCustomer =
    location.pathname.startsWith("/kelola") || Boolean(params.customerSlug);
  const slug = params.slug || params.customerSlug || "";

  const [data, setData] = useState(null);
  const [tab, setTab] = useState("couple");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [guestName, setGuestName] = useState("");
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [bulkPaste, setBulkPaste] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [guestFilter, setGuestFilter] = useState("all");
  const [rsvpFilter, setRsvpFilter] = useState("all");
  const [wishes, setWishes] = useState([]);
  const [manageCode, setManageCode] = useState(
    () => sessionStorage.getItem(storageKey(slug)) || "",
  );
  const [unlocked, setUnlocked] = useState(!isCustomer);

  const tabs = isCustomer ? CUSTOMER_TABS : ADMIN_TABS;
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const fullGuestUrl = useCallback(
    (g) => `${origin}/live/${slug}/${g.token || g.slug || ""}`,
    [origin, slug],
  );

  // ——— Load admin ———
  useEffect(() => {
    if (isCustomer) return;
    adminFetch(`/api/admin/customers/${slug}`)
      .then(setData)
      .catch((e) => {
        if (e.status === 401) {
          clearAdminPassword();
          navigate("/admin/login");
        } else setError(e.message);
      });
  }, [slug, navigate, isCustomer]);

  // ——— Load customer (session) ———
  useEffect(() => {
    if (!isCustomer) return;
    const saved = sessionStorage.getItem(storageKey(slug));
    if (!saved) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/public/customer/${encodeURIComponent(slug)}/manage-auth`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: saved }),
          },
        );
        const json = await res.json().catch(() => ({}));
        if (cancelled || !res.ok) return;
        setManageCode(saved);
        setData(json.wedding || json);
        setUnlocked(true);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, isCustomer]);

  const unlockCustomer = async (e) => {
    e?.preventDefault?.();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        `/api/public/customer/${encodeURIComponent(slug)}/manage-auth`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: manageCode.trim() }),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.message || "Kode salah");
        return;
      }
      sessionStorage.setItem(storageKey(slug), manageCode.trim());
      setData(json.wedding || json);
      setUnlocked(true);
      setMsg("Berhasil masuk");
    } catch {
      setError("Gagal terhubung");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setMsg("");
    setError("");
    try {
      if (isCustomer) {
        const res = await fetch(
          `/api/public/customer/${encodeURIComponent(slug)}/wedding`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, code: manageCode.trim() }),
          },
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.message || "Gagal menyimpan");
        setData(json);
        setMsg("Perubahan tersimpan");
      } else {
        const d = await adminFetch(`/api/admin/customers/${slug}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        setData(d);
        setMsg("Tersimpan");
      }
    } catch (e) {
      setError(e.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const loadWishes = useCallback(async () => {
    if (isCustomer) {
      const res = await fetch(
        `/api/public/customer/${encodeURIComponent(slug)}/wishes?code=${encodeURIComponent(manageCode.trim())}`,
        { headers: { Accept: "application/json" }, cache: "no-store" },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Gagal memuat RSVP");
      setWishes(Array.isArray(json.wishes) ? json.wishes : []);
    } else {
      const json = await adminFetch(`/api/admin/customers/${slug}/wishes`);
      setWishes(Array.isArray(json.wishes) ? json.wishes : []);
    }
  }, [isCustomer, slug, manageCode]);

  useEffect(() => {
    if (!unlocked || !data || tab !== "rsvp") return;
    loadWishes().catch(() => {});
  }, [tab, unlocked, data, loadWishes]);

  const addGuest = async (e) => {
    e?.preventDefault?.();
    const name = guestName.trim();
    if (!name) return;
    setBusy(true);
    setError("");
    try {
      if (isCustomer) {
        const res = await fetch(
          `/api/public/customer/${encodeURIComponent(slug)}/guests`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: manageCode.trim(), name }),
          },
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.message || "Gagal menambah tamu");
        setData((p) => ({ ...p, guests: json.guests || [] }));
      } else {
        const guests = await adminFetch(`/api/admin/customers/${slug}/guests`, {
          method: "POST",
          body: JSON.stringify({ name }),
        });
        setData((p) => ({ ...p, guests }));
      }
      setGuestName("");
      setGuestFilter("all");
      setMsg(`Tamu ditambahkan: ${name}`);
    } catch (err) {
      setError(err.message || "Gagal menambah tamu");
    } finally {
      setBusy(false);
    }
  };

  const removeGuest = async (g) => {
    if (
      !window.confirm(`Hapus tamu “${g.name}”? Link tidak bisa dipakai lagi.`)
    )
      return;
    setBusy(true);
    setError("");
    try {
      if (isCustomer) {
        const res = await fetch(
          `/api/public/customer/${encodeURIComponent(slug)}/guests`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: manageCode.trim(),
              token: g.token,
            }),
          },
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.message || "Gagal menghapus");
        setData((p) => ({ ...p, guests: json.guests || [] }));
      } else {
        const guests = await adminFetch(
          `/api/admin/customers/${slug}/guests?token=${encodeURIComponent(g.token)}`,
          { method: "DELETE" },
        );
        setData((p) => ({ ...p, guests }));
      }
      setMsg(`Tamu dihapus: ${g.name}`);
    } catch (err) {
      setError(err.message || "Gagal menghapus");
    } finally {
      setBusy(false);
    }
  };

  const toggleShared = async (g, shared) => {
    setBusy(true);
    setError("");
    try {
      if (isCustomer) {
        const res = await fetch(
          `/api/public/customer/${encodeURIComponent(slug)}/guests/shared`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: manageCode.trim(),
              token: g.token,
              shared,
            }),
          },
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.message || "Gagal menyimpan");
        setData((p) => ({ ...p, guests: json.guests || [] }));
      } else {
        const list = data.guests || [];
        const next = list.map((x) =>
          x.token === g.token
            ? {
                ...x,
                shared,
                sharedAt: shared ? new Date().toISOString() : null,
              }
            : x,
        );
        const updated = await adminFetch(`/api/admin/customers/${slug}`, {
          method: "PUT",
          body: JSON.stringify({ ...data, guests: next }),
        });
        setData(updated);
      }
      setMsg(
        shared
          ? `✓ ${g.name} ditandai sudah dibagikan`
          : `Dibuka lagi: ${g.name}`,
      );
    } catch (err) {
      setError(err.message || "Gagal checklist");
    } finally {
      setBusy(false);
    }
  };

  const removeWish = async (w) => {
    if (!window.confirm(`Hapus RSVP dari “${w.nama || "Tamu"}”?`)) return;
    setBusy(true);
    setError("");
    try {
      if (isCustomer) {
        const res = await fetch(
          `/api/public/customer/${encodeURIComponent(slug)}/wishes`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: manageCode.trim(), id: w.id }),
          },
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.message || "Gagal menghapus");
        setWishes(json.wishes || []);
      } else {
        const json = await adminFetch(`/api/admin/customers/${slug}/wishes`, {
          method: "DELETE",
          body: JSON.stringify({ id: w.id }),
        });
        setWishes(json.wishes || []);
      }
      setMsg(`RSVP dihapus: ${w.nama || "Tamu"}`);
    } catch (err) {
      setError(err.message || "Gagal menghapus RSVP");
    } finally {
      setBusy(false);
    }
  };

  const refreshRsvp = async () => {
    setBusy(true);
    setError("");
    try {
      await loadWishes();
      setMsg("Data RSVP diperbarui");
    } catch (err) {
      setError(err.message || "Gagal memuat RSVP");
    } finally {
      setBusy(false);
    }
  };

  const guests = data?.guests || [];
  const stats = useMemo(() => {
    const total = guests.length;
    const done = guests.filter((g) => g.shared).length;
    return { total, done, pending: total - done };
  }, [guests]);

  const visibleGuests = useMemo(() => {
    if (guestFilter === "pending") return guests.filter((g) => !g.shared);
    if (guestFilter === "done") return guests.filter((g) => g.shared);
    return guests;
  }, [guests, guestFilter]);

  const rsvpStats = useMemo(() => {
    let hadirCount = 0;
    let tidakCount = 0;
    let totalTamu = 0;
    for (const w of wishes) {
      if (w.kehadiran === "tidak") tidakCount += 1;
      else {
        hadirCount += 1;
        totalTamu += Math.max(0, Number(w.jumlahTamu) || 1);
      }
    }
    return { total: wishes.length, hadirCount, tidakCount, totalTamu };
  }, [wishes]);

  const visibleRsvp = useMemo(() => {
    if (rsvpFilter === "hadir")
      return wishes.filter((w) => w.kehadiran !== "tidak");
    if (rsvpFilter === "tidak")
      return wishes.filter((w) => w.kehadiran === "tidak");
    return wishes;
  }, [wishes, rsvpFilter]);

  const galleryList = normalizeGallery(data?.gallery);

  const setGalleryList = (next) => {
    setData((p) => ({
      ...p,
      gallery: next.map((item, i) => ({
        ...item,
        id: i + 1,
        alt: item.alt || `Gallery ${i + 1}`,
      })),
    }));
  };

  const addGalleryPhoto = () => {
    setGalleryList([
      ...galleryList,
      {
        id: galleryList.length + 1,
        src: "",
        alt: `Gallery ${galleryList.length + 1}`,
        aspect: "portrait",
      },
    ]);
  };

  const updateGalleryPhoto = (index, patch) => {
    setGalleryList(
      galleryList.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    );
  };

  const removeGalleryPhoto = (index) => {
    setGalleryList(galleryList.filter((_, i) => i !== index));
  };

  const applyBulkPaste = () => {
    const urls = bulkPaste
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!urls.length) return;
    const added = urls.map((src, i) => ({
      id: galleryList.length + i + 1,
      src,
      alt: `Gallery ${galleryList.length + i + 1}`,
      aspect: "portrait",
    }));
    setGalleryList([...galleryList, ...added]);
    setBulkPaste("");
    setShowBulk(false);
    setMsg(`${urls.length} foto ditambahkan ke gallery`);
  };

  if (isCustomer && !unlocked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-neutral-100 px-4">
        <form
          onSubmit={unlockCustomer}
          className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm"
        >
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Kelola undangan
          </p>
          <h1 className="mt-2 font-serif text-2xl text-neutral-900">
            Masuk dengan kode
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Kode akses dari panitia (dikirim via WhatsApp).
          </p>
          <input
            type="password"
            className="mt-4 w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-800"
            value={manageCode}
            onChange={(e) => setManageCode(e.target.value)}
            placeholder="Kode akses"
            autoFocus
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy || !manageCode.trim()}
            className="mt-4 w-full rounded-md bg-neutral-900 py-2.5 text-sm text-white disabled:opacity-50"
          >
            {busy ? "Memeriksa…" : "Masuk"}
          </button>
        </form>
      </div>
    );
  }

  if (!data) {
    return (
      <p className="p-10 text-sm text-neutral-500">{error || "Memuat…"}</p>
    );
  }

  const giftAddressLines = Array.isArray(data.giftAddress?.lines)
    ? data.giftAddress.lines.join("\n")
    : data.giftAddress?.address || "";

  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className="sticky top-0 z-10 border-b bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <div>
            {isCustomer ? (
              <p className="text-xs text-neutral-400">Kelola undangan</p>
            ) : (
              <Link
                to="/admin"
                className="text-xs text-neutral-500 hover:text-neutral-800"
              >
                ← Dashboard
              </Link>
            )}
            <h1 className="font-serif text-xl text-neutral-900">
              {data.couple?.groom || "—"} &amp; {data.couple?.bride || "—"}
            </h1>
            <p className="mt-0.5 text-xs text-neutral-500">
              Preview:{" "}
              <a
                href={`/live/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-neutral-700 underline-offset-2 hover:underline"
              >
                /live/{slug}
              </a>
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={`/live/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-800"
            >
              Buka live
            </a>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-60"
            >
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </div>
      </header>

      <div className="border-b bg-white px-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto py-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setMsg("");
                setError("");
              }}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs transition ${
                tab === t.id
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {msg && (
          <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {msg}
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* —— COUPLE —— */}
        {tab === "couple" && (
          <section className="rounded-lg border bg-white p-5 shadow-sm sm:p-6">
            <SectionIntro title="Couple & tanggal">
              Nama pasangan, orang tua, Instagram, tanggal countdown, musik, dan
              ayat di hero.
            </SectionIntro>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama mempelai pria">
                <input
                  className={inputClass}
                  value={data.couple?.groom || ""}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      couple: { ...p.couple, groom: e.target.value },
                    }))
                  }
                  placeholder="Andi Pratama"
                />
              </Field>
              <Field label="Nama mempelai wanita">
                <input
                  className={inputClass}
                  value={data.couple?.bride || ""}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      couple: { ...p.couple, bride: e.target.value },
                    }))
                  }
                  placeholder="Sinta Dewi"
                />
              </Field>
              <Field
                label="Orang tua mempelai wanita"
                className="sm:col-span-2"
              >
                <input
                  className={inputClass}
                  value={data.couple?.brideParents || ""}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      couple: { ...p.couple, brideParents: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Orang tua mempelai pria" className="sm:col-span-2">
                <input
                  className={inputClass}
                  value={data.couple?.groomParents || ""}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      couple: { ...p.couple, groomParents: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="IG wanita (tanpa @)">
                <input
                  className={inputClass}
                  value={data.couple?.brideIg || ""}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      couple: { ...p.couple, brideIg: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="IG pria (tanpa @)">
                <input
                  className={inputClass}
                  value={data.couple?.groomIg || ""}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      couple: { ...p.couple, groomIg: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Tanggal tampilan" hint="Contoh: 30 September 2026">
                <input
                  className={inputClass}
                  value={data.couple?.weddingDateLabel || ""}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      couple: {
                        ...p.couple,
                        weddingDateLabel: e.target.value,
                      },
                    }))
                  }
                />
              </Field>
              <Field
                label="Waktu countdown (ISO)"
                hint="Contoh: 2026-09-30T09:00:00+07:00"
              >
                <input
                  className={`${inputClass} font-mono text-xs`}
                  value={data.weddingDate || data.couple?.weddingDate || ""}
                  onChange={(e) =>
                    setData((p) => ({ ...p, weddingDate: e.target.value }))
                  }
                />
              </Field>
              <Field label="URL musik (MP3)" className="sm:col-span-2">
                <input
                  className={inputClass}
                  value={data.musicUrl || ""}
                  onChange={(e) =>
                    setData((p) => ({ ...p, musicUrl: e.target.value }))
                  }
                />
              </Field>
              <Field
                label="Link Google Calendar"
                className="sm:col-span-2"
                hint="Opsional"
              >
                <input
                  className={`${inputClass} font-mono text-xs`}
                  value={data.calendarUrl || ""}
                  onChange={(e) =>
                    setData((p) => ({ ...p, calendarUrl: e.target.value }))
                  }
                />
              </Field>
              <Field label="Teks ayat (Hero)" className="sm:col-span-2">
                <textarea
                  rows={3}
                  className={inputClass}
                  value={data.heroVerseText || ""}
                  onChange={(e) =>
                    setData((p) => ({ ...p, heroVerseText: e.target.value }))
                  }
                />
              </Field>
              <Field label="Sumber ayat" className="sm:col-span-2">
                <input
                  className={inputClass}
                  value={data.heroVerseRef || ""}
                  onChange={(e) =>
                    setData((p) => ({ ...p, heroVerseRef: e.target.value }))
                  }
                  placeholder="QS. Ar-Rum : 21"
                />
              </Field>
            </div>
          </section>
        )}

        {/* —— PHOTOS —— */}
        {tab === "photos" && (
          <section className="rounded-lg border bg-white p-5 shadow-sm sm:p-6">
            <SectionIntro title="Foto latar tiap section">
              Tempel link foto (ImageKit / CDN).
            </SectionIntro>
            <div className="space-y-5">
              {PHOTO_FIELDS.map(({ key, label, hint }) => (
                <div
                  key={key}
                  className="flex flex-col gap-3 rounded-md border border-neutral-200 p-3 sm:flex-row sm:items-start"
                >
                  <div className="h-16 w-full shrink-0 overflow-hidden rounded bg-neutral-100 sm:w-24">
                    {data.photos?.[key] ? (
                      <img
                        src={data.photos[key]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">
                        Preview
                      </div>
                    )}
                  </div>
                  <Field label={label} hint={hint} className="min-w-0 flex-1">
                    <input
                      className={`${inputClass} font-mono text-xs`}
                      value={data.photos?.[key] || ""}
                      onChange={(e) =>
                        setData((p) => ({
                          ...p,
                          photos: { ...p.photos, [key]: e.target.value },
                        }))
                      }
                      placeholder="https://..."
                    />
                  </Field>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* —— JOURNEYS —— */}
        {tab === "journeys" && (
          <section className="rounded-lg border bg-white p-5 shadow-sm sm:p-6">
            <SectionIntro title="Love Journey">
              Setiap babak: tahun, judul, dan cerita singkat.
            </SectionIntro>
            <div className="space-y-4">
              {(data.journeys || []).map((item, i) => (
                <div
                  key={i}
                  className="rounded-md border border-neutral-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                      Babak {i + 1}
                    </p>
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:underline"
                      onClick={() =>
                        setData((p) => ({
                          ...p,
                          journeys: (p.journeys || []).filter(
                            (_, j) => j !== i,
                          ),
                        }))
                      }
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="grid gap-3">
                    <Field label="Tahun">
                      <input
                        className={inputClass}
                        value={item.year || ""}
                        onChange={(e) => {
                          const journeys = [...(data.journeys || [])];
                          journeys[i] = {
                            ...journeys[i],
                            year: e.target.value,
                          };
                          setData((p) => ({ ...p, journeys }));
                        }}
                      />
                    </Field>
                    <Field label="Judul">
                      <input
                        className={inputClass}
                        value={item.title || ""}
                        onChange={(e) => {
                          const journeys = [...(data.journeys || [])];
                          journeys[i] = {
                            ...journeys[i],
                            title: e.target.value,
                          };
                          setData((p) => ({ ...p, journeys }));
                        }}
                      />
                    </Field>
                    <Field label="Cerita">
                      <textarea
                        rows={4}
                        className={inputClass}
                        value={item.text || ""}
                        onChange={(e) => {
                          const journeys = [...(data.journeys || [])];
                          journeys[i] = {
                            ...journeys[i],
                            text: e.target.value,
                          };
                          setData((p) => ({ ...p, journeys }));
                        }}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 rounded-md border border-neutral-300 px-4 py-2.5 text-sm hover:border-neutral-800"
              onClick={() =>
                setData((p) => ({
                  ...p,
                  journeys: [
                    ...(p.journeys || []),
                    { year: "", title: "", text: "" },
                  ],
                }))
              }
            >
              + Tambah babak
            </button>
          </section>
        )}

        {/* —— EVENTS —— */}
        {tab === "events" && (
          <section className="rounded-lg border bg-white p-5 shadow-sm sm:p-6">
            <SectionIntro title="Wedding Event">
              Jadwal akad, resepsi, dll.
            </SectionIntro>
            <div className="space-y-4">
              {(data.events || []).map((ev, i) => (
                <div
                  key={i}
                  className="rounded-md border border-neutral-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                      Acara {i + 1}
                    </p>
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:underline"
                      onClick={() =>
                        setData((p) => ({
                          ...p,
                          events: (p.events || []).filter((_, j) => j !== i),
                        }))
                      }
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Jam">
                      <input
                        className={inputClass}
                        value={ev.time || ""}
                        onChange={(e) => {
                          const events = [...(data.events || [])];
                          events[i] = { ...events[i], time: e.target.value };
                          setData((p) => ({ ...p, events }));
                        }}
                      />
                    </Field>
                    <Field label="Nama acara">
                      <input
                        className={inputClass}
                        value={ev.title || ""}
                        onChange={(e) => {
                          const events = [...(data.events || [])];
                          events[i] = { ...events[i], title: e.target.value };
                          setData((p) => ({ ...p, events }));
                        }}
                      />
                    </Field>
                    <Field label="Tempat">
                      <input
                        className={inputClass}
                        value={ev.place || ""}
                        onChange={(e) => {
                          const events = [...(data.events || [])];
                          events[i] = { ...events[i], place: e.target.value };
                          setData((p) => ({ ...p, events }));
                        }}
                      />
                    </Field>
                    <Field label="Sisi timeline">
                      <select
                        className={inputClass}
                        value={ev.side || "left"}
                        onChange={(e) => {
                          const events = [...(data.events || [])];
                          events[i] = { ...events[i], side: e.target.value };
                          setData((p) => ({ ...p, events }));
                        }}
                      >
                        <option value="left">Kiri</option>
                        <option value="right">Kanan</option>
                      </select>
                    </Field>
                    <Field label="Alamat" className="sm:col-span-2">
                      <input
                        className={inputClass}
                        value={ev.address || ""}
                        onChange={(e) => {
                          const events = [...(data.events || [])];
                          events[i] = { ...events[i], address: e.target.value };
                          setData((p) => ({ ...p, events }));
                        }}
                      />
                    </Field>
                    <Field label="Link Google Maps" className="sm:col-span-2">
                      <input
                        className={`${inputClass} font-mono text-xs`}
                        value={ev.mapsUrl || ""}
                        onChange={(e) => {
                          const events = [...(data.events || [])];
                          events[i] = { ...events[i], mapsUrl: e.target.value };
                          setData((p) => ({ ...p, events }));
                        }}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 rounded-md border border-neutral-300 px-4 py-2.5 text-sm hover:border-neutral-800"
              onClick={() =>
                setData((p) => ({
                  ...p,
                  events: [
                    ...(p.events || []),
                    {
                      time: "",
                      title: "",
                      place: "",
                      address: "",
                      mapsUrl: "",
                      side: "left",
                    },
                  ],
                }))
              }
            >
              + Tambah acara
            </button>
          </section>
        )}

        {/* —— STREAMING —— */}
        {tab === "streaming" && (
          <section className="rounded-lg border bg-white p-5 shadow-sm sm:p-6">
            <SectionIntro title="Live Streaming">
              Link YouTube / platform streaming.
            </SectionIntro>
            <Field label="URL streaming">
              <input
                className={`${inputClass} font-mono text-xs`}
                value={data.streamingUrl || ""}
                onChange={(e) =>
                  setData((p) => ({ ...p, streamingUrl: e.target.value }))
                }
              />
            </Field>
          </section>
        )}

        {/* —— GALLERY —— */}
        {tab === "gallery" && (
          <section className="rounded-lg border bg-white p-5 shadow-sm sm:p-6">
            <SectionIntro title="Gallery foto">
              Tambah foto satu per satu atau tempel banyak URL.
            </SectionIntro>
            <Field
              label="Video embed (opsional)"
              hint="https://www.youtube.com/embed/VIDEO_ID"
              className="mb-6"
            >
              <input
                className={`${inputClass} font-mono text-xs`}
                value={data.galleryVideoUrl || ""}
                onChange={(e) =>
                  setData((p) => ({ ...p, galleryVideoUrl: e.target.value }))
                }
              />
            </Field>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-neutral-800">
                Daftar foto{" "}
                <span className="font-normal text-neutral-400">
                  ({galleryList.length})
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulk((v) => !v)}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:border-neutral-800"
                >
                  {showBulk ? "Tutup tempel massal" : "Tempel banyak URL"}
                </button>
                <button
                  type="button"
                  onClick={addGalleryPhoto}
                  className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs text-white"
                >
                  + Tambah foto
                </button>
              </div>
            </div>
            {showBulk && (
              <div className="mb-4 rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
                <textarea
                  rows={5}
                  className={`${inputClass} font-mono text-xs`}
                  value={bulkPaste}
                  onChange={(e) => setBulkPaste(e.target.value)}
                  placeholder={"https://.../foto1.jpg\nhttps://.../foto2.jpg"}
                />
                <button
                  type="button"
                  onClick={applyBulkPaste}
                  className="mt-2 rounded-md bg-neutral-900 px-4 py-2 text-xs text-white"
                >
                  Tambahkan ke daftar
                </button>
              </div>
            )}
            <div className="space-y-3">
              {galleryList.length === 0 && (
                <p className="rounded-md border border-dashed py-8 text-center text-sm text-neutral-400">
                  Belum ada foto
                </p>
              )}
              {galleryList.map((photo, i) => (
                <div
                  key={photo.id || i}
                  className="flex flex-col gap-3 rounded-md border border-neutral-200 p-3 sm:flex-row sm:items-start"
                >
                  <div className="h-20 w-full shrink-0 overflow-hidden rounded bg-neutral-100 sm:w-20">
                    {photo.src ? (
                      <img
                        src={photo.src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">
                        {i + 1}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-neutral-500">
                        Foto {i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeGalleryPhoto(i)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                    <input
                      className={`${inputClass} font-mono text-xs`}
                      value={photo.src}
                      onChange={(e) =>
                        updateGalleryPhoto(i, { src: e.target.value })
                      }
                    />
                    <div className="flex flex-wrap gap-2">
                      <select
                        className="rounded-md border border-neutral-300 px-2 py-1.5 text-xs"
                        value={photo.aspect || "portrait"}
                        onChange={(e) =>
                          updateGalleryPhoto(i, { aspect: e.target.value })
                        }
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                        <option value="square">Square</option>
                      </select>
                      <input
                        className="min-w-0 flex-1 rounded-md border border-neutral-300 px-2 py-1.5 text-xs"
                        value={photo.alt || ""}
                        onChange={(e) =>
                          updateGalleryPhoto(i, { alt: e.target.value })
                        }
                        placeholder="Alt text"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* —— GIFT —— */}
        {tab === "gift" && (
          <section className="rounded-lg border bg-white p-5 shadow-sm sm:p-6">
            <SectionIntro title="Wedding Gift">
              Rekening e-amplop dan alamat hadiah fisik.
            </SectionIntro>
            <div className="space-y-4">
              {(data.giftAccounts || []).map((acc, i) => (
                <div
                  key={i}
                  className="rounded-md border border-neutral-200 p-4"
                >
                  <div className="mb-3 flex justify-between">
                    <p className="text-xs font-semibold uppercase text-neutral-400">
                      Rekening {i + 1}
                    </p>
                    <button
                      type="button"
                      className="text-xs text-red-600"
                      onClick={() =>
                        setData((p) => ({
                          ...p,
                          giftAccounts: (p.giftAccounts || []).filter(
                            (_, j) => j !== i,
                          ),
                        }))
                      }
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="Bank">
                      <input
                        className={inputClass}
                        value={acc.bank || ""}
                        onChange={(e) => {
                          const giftAccounts = [...(data.giftAccounts || [])];
                          giftAccounts[i] = {
                            ...giftAccounts[i],
                            bank: e.target.value,
                          };
                          setData((p) => ({ ...p, giftAccounts }));
                        }}
                      />
                    </Field>
                    <Field label="No. rekening">
                      <input
                        className={inputClass}
                        value={acc.number || ""}
                        onChange={(e) => {
                          const giftAccounts = [...(data.giftAccounts || [])];
                          giftAccounts[i] = {
                            ...giftAccounts[i],
                            number: e.target.value,
                          };
                          setData((p) => ({ ...p, giftAccounts }));
                        }}
                      />
                    </Field>
                    <Field label="Atas nama">
                      <input
                        className={inputClass}
                        value={acc.name || ""}
                        onChange={(e) => {
                          const giftAccounts = [...(data.giftAccounts || [])];
                          giftAccounts[i] = {
                            ...giftAccounts[i],
                            name: e.target.value,
                          };
                          setData((p) => ({ ...p, giftAccounts }));
                        }}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 rounded-md border px-4 py-2 text-sm"
              onClick={() =>
                setData((p) => ({
                  ...p,
                  giftAccounts: [
                    ...(p.giftAccounts || []),
                    { id: `acc-${Date.now()}`, bank: "", number: "", name: "" },
                  ],
                }))
              }
            >
              + Tambah rekening
            </button>
            <div className="mt-8 grid gap-4 border-t pt-6">
              <Field label="Nama penerima hadiah fisik">
                <input
                  className={inputClass}
                  value={
                    data.giftAddress?.name || data.giftAddress?.recipient || ""
                  }
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      giftAddress: {
                        ...p.giftAddress,
                        name: e.target.value,
                        recipient: e.target.value,
                      },
                    }))
                  }
                />
              </Field>
              <Field label="Alamat" hint="Satu baris per baris">
                <textarea
                  rows={4}
                  className={inputClass}
                  value={giftAddressLines}
                  onChange={(e) => {
                    const lines = e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    setData((p) => ({
                      ...p,
                      giftAddress: {
                        ...p.giftAddress,
                        lines,
                        address: lines.join(", "),
                      },
                    }));
                  }}
                />
              </Field>
            </div>
          </section>
        )}

        {/* —— GUESTS —— */}
        {tab === "guests" && (
          <section className="rounded-lg border bg-white p-5 shadow-sm sm:p-6">
            <SectionIntro title="Daftar tamu">
              Progress bagikan, salin link, WhatsApp, centang sudah kirim,
              tambah & hapus.
            </SectionIntro>

            <div className="rounded-xl border bg-neutral-50 p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-400">
                    Progress bagikan
                  </p>
                  <p className="mt-1 text-2xl font-medium text-neutral-900">
                    {stats.done}
                    <span className="text-base text-neutral-400">
                      {" "}
                      / {stats.total}
                    </span>
                  </p>
                </div>
                <p className="text-sm text-neutral-500">
                  {stats.pending} belum
                </p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-neutral-900 transition-all"
                  style={{
                    width:
                      stats.total === 0
                        ? "0%"
                        : `${(stats.done / stats.total) * 100}%`,
                  }}
                />
              </div>
            </div>

            <form
              onSubmit={addGuest}
              className="mt-4 flex flex-col gap-2 sm:flex-row"
            >
              <input
                className={inputClass}
                placeholder="Nama tamu undangan"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                disabled={busy}
              />
              <button
                type="submit"
                disabled={busy || !guestName.trim()}
                className="shrink-0 rounded-md bg-neutral-900 px-5 py-2.5 text-sm text-white disabled:opacity-50"
              >
                + Tambah tamu
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { id: "all", label: `Semua (${stats.total})` },
                { id: "pending", label: `Belum (${stats.pending})` },
                { id: "done", label: `Sudah (${stats.done})` },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setGuestFilter(f.id)}
                  className={`rounded-full px-3 py-1.5 text-xs ${
                    guestFilter === f.id
                      ? "bg-neutral-900 text-white"
                      : "border border-neutral-200 bg-white text-neutral-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
              <button
                type="button"
                className="ml-auto rounded-full border border-neutral-300 px-3 py-1.5 text-xs hover:border-neutral-800"
                onClick={async () => {
                  const lines = guests
                    .filter((g) => !g.shared)
                    .map((g) => `${g.name}\t${fullGuestUrl(g)}`);
                  if (!lines.length) {
                    setMsg("Semua sudah dibagikan");
                    return;
                  }
                  await navigator.clipboard.writeText(
                    ["Nama\tLink", ...lines].join("\n"),
                  );
                  setMsg(`${lines.length} link (belum) tersalin`);
                }}
              >
                Salin yang belum
              </button>
            </div>

            <ul className="mt-4 space-y-2">
              {visibleGuests.length === 0 && (
                <li className="rounded-xl border border-dashed py-10 text-center text-sm text-neutral-400">
                  Tidak ada tamu di filter ini
                </li>
              )}
              {visibleGuests.map((g) => (
                <li
                  key={g.token || g.id}
                  className={`rounded-xl border p-4 ${g.shared ? "opacity-80" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => toggleShared(g, !g.shared)}
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs ${
                        g.shared
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-neutral-300 bg-white"
                      }`}
                    >
                      {g.shared ? "✓" : ""}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`font-medium ${
                          g.shared
                            ? "text-neutral-500 line-through"
                            : "text-neutral-900"
                        }`}
                      >
                        {g.name}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[10px] text-neutral-400">
                        {fullGuestUrl(g)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs text-white"
                      onClick={async () => {
                        await navigator.clipboard.writeText(fullGuestUrl(g));
                        setMsg(`Tersalin: ${g.name}`);
                      }}
                    >
                      Salin link
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:border-neutral-800"
                      onClick={() => {
                        const text = encodeURIComponent(
                          `Assalamualaikum/Halo ${g.name},\n\nBerikut undangan digital kami:\n${fullGuestUrl(g)}\n\nTerima kasih 🙏`,
                        );
                        window.open(
                          `https://wa.me/?text=${text}`,
                          "_blank",
                          "noopener",
                        );
                      }}
                    >
                      Bagikan WA
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
                      onClick={() => removeGuest(g)}
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* —— RSVP —— */}
        {tab === "rsvp" && (
          <section className="rounded-lg border bg-white p-5 shadow-sm sm:p-6">
            <SectionIntro title="RSVP & ucapan">
              Konfirmasi kehadiran dan doa dari tamu.
            </SectionIntro>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border bg-neutral-50 p-3 text-center">
                <p className="text-[10px] uppercase text-neutral-400">
                  Konfirmasi
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {rsvpStats.total}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 p-3 text-center">
                <p className="text-[10px] uppercase text-emerald-700/70">
                  Hadir
                </p>
                <p className="mt-1 text-2xl font-semibold text-emerald-800 tabular-nums">
                  {rsvpStats.hadirCount}
                </p>
                <p className="text-[10px] text-emerald-700/60">
                  {rsvpStats.totalTamu} orang
                </p>
              </div>
              <div className="rounded-xl border bg-neutral-50 p-3 text-center">
                <p className="text-[10px] uppercase text-neutral-400">
                  Tidak hadir
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {rsvpStats.tidakCount}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Proporsi kehadiran
                </p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={refreshRsvp}
                  className="rounded-md border px-2.5 py-1 text-xs hover:border-neutral-800 disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>
              <RsvpPie
                hadir={rsvpStats.hadirCount}
                tidak={rsvpStats.tidakCount}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { id: "all", label: `Semua (${rsvpStats.total})` },
                { id: "hadir", label: `Hadir (${rsvpStats.hadirCount})` },
                { id: "tidak", label: `Tidak (${rsvpStats.tidakCount})` },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setRsvpFilter(f.id)}
                  className={`rounded-full px-3 py-1.5 text-xs ${
                    rsvpFilter === f.id
                      ? "bg-neutral-900 text-white"
                      : "border border-neutral-200 bg-white text-neutral-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <ul className="mt-4 space-y-2">
              {visibleRsvp.length === 0 && (
                <li className="rounded-xl border border-dashed py-10 text-center text-sm text-neutral-400">
                  Belum ada data RSVP
                </li>
              )}
              {visibleRsvp.map((w) => {
                const isHadir = w.kehadiran !== "tidak";
                return (
                  <li key={w.id} className="rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-neutral-900">
                            {w.nama || "Tamu"}
                          </p>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                              isHadir
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-neutral-100 text-neutral-500"
                            }`}
                          >
                            {isHadir
                              ? `Hadir${w.jumlahTamu ? ` · ${w.jumlahTamu} org` : ""}`
                              : "Tidak hadir"}
                          </span>
                        </div>
                        {w.ucapan?.trim() && (
                          <p className="mt-2 font-serif text-sm text-neutral-700">
                            “{w.ucapan}”
                          </p>
                        )}
                        {w.createdAt && (
                          <p className="mt-2 text-[10px] text-neutral-400">
                            {new Date(w.createdAt).toLocaleString("id-ID")}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => removeWish(w)}
                        className="shrink-0 rounded-md border border-red-200 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-md bg-neutral-900 px-8 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Menyimpan…" : "Simpan semua"}
          </button>
        </div>
      </main>
    </div>
  );
}
