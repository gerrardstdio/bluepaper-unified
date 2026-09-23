import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const storageKey = (slug) => `manage-code:${slug}`;

/** Pie chart sederhana (SVG) — hadir vs tidak */
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
        {/* Hadir — emerald */}
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="#059669"
          strokeWidth="22"
          strokeDasharray={`${hadirLen} ${c - hadirLen}`}
          strokeDashoffset={c * 0.25}
          strokeLinecap="butt"
          className="transition-all duration-500"
        />
        {/* Tidak — neutral */}
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
            strokeLinecap="butt"
            className="transition-all duration-500"
          />
        )}
        <text
          x="70"
          y="66"
          textAnchor="middle"
          className="fill-neutral-900 text-xl font-semibold"
          style={{ fontSize: "22px" }}
        >
          {total}
        </text>
        <text
          x="70"
          y="84"
          textAnchor="middle"
          className="fill-neutral-400"
          style={{ fontSize: "10px" }}
        >
          RSVP
        </text>
      </svg>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-600" />
          <span className="text-neutral-600">Hadir</span>
          <span className="ml-auto font-medium text-neutral-900 tabular-nums">
            {hadir}
            <span className="text-neutral-400">
              {" "}
              ({Math.round((hadir / total) * 100)}%)
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-neutral-400" />
          <span className="text-neutral-600">Tidak hadir</span>
          <span className="ml-auto font-medium text-neutral-900 tabular-nums">
            {tidak}
            <span className="text-neutral-400">
              {" "}
              ({Math.round((tidak / total) * 100)}%)
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CustomerGuestManagePage() {
  const { customerSlug } = useParams();
  const [code, setCode] = useState(
    () => sessionStorage.getItem(storageKey(customerSlug)) || "",
  );
  const [unlocked, setUnlocked] = useState(false);
  const [couple, setCouple] = useState(null);
  const [guests, setGuests] = useState([]);
  const [wishes, setWishes] = useState([]);
  const [tab, setTab] = useState("guests"); // guests | rsvp
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState("all");
  const [rsvpFilter, setRsvpFilter] = useState("all"); // all | hadir | tidak
  const [busy, setBusy] = useState(false);
  const [newName, setNewName] = useState("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const stats = useMemo(() => {
    const total = guests.length;
    const done = guests.filter((g) => g.shared).length;
    return { total, done, pending: total - done };
  }, [guests]);

  const rsvpStats = useMemo(() => {
    const list = Array.isArray(wishes) ? wishes : [];
    let hadirCount = 0;
    let tidakCount = 0;
    let totalTamu = 0;

    for (const w of list) {
      if (w.kehadiran === "tidak") {
        tidakCount += 1;
      } else {
        // default / "hadir"
        hadirCount += 1;
        totalTamu += Math.max(0, Number(w.jumlahTamu) || 1);
      }
    }

    return {
      total: list.length,
      hadirCount,
      tidakCount,
      totalTamu,
    };
  }, [wishes]);

  const visible = useMemo(() => {
    if (filter === "pending") return guests.filter((g) => !g.shared);
    if (filter === "done") return guests.filter((g) => g.shared);
    return guests;
  }, [guests, filter]);

  const visibleRsvp = useMemo(() => {
    if (rsvpFilter === "hadir") {
      return wishes.filter((w) => w.kehadiran !== "tidak");
    }
    if (rsvpFilter === "tidak") {
      return wishes.filter((w) => w.kehadiran === "tidak");
    }
    return wishes;
  }, [wishes, rsvpFilter]);

  const loadWishes = useCallback(
    async (authCode) => {
      const res = await fetch(
        `/api/public/customer/${encodeURIComponent(customerSlug)}/wishes?code=${encodeURIComponent(authCode)}`,
        { headers: { Accept: "application/json" }, cache: "no-store" },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Gagal memuat RSVP");
      setWishes(Array.isArray(data.wishes) ? data.wishes : []);
    },
    [customerSlug],
  );

  const unlock = async (e) => {
    e?.preventDefault?.();
    setError("");
    setBusy(true);
    try {
      const res = await fetch(
        `/api/public/customer/${encodeURIComponent(customerSlug)}/manage-auth`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: code.trim() }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Kode salah");
        setUnlocked(false);
        return;
      }
      sessionStorage.setItem(storageKey(customerSlug), code.trim());
      setCouple(data.couple || null);
      setGuests(data.guests || []);
      setUnlocked(true);
      setMsg("Berhasil masuk");
      try {
        await loadWishes(code.trim());
      } catch {
        /* optional */
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey(customerSlug));
    if (!saved) return;

    setCode(saved);
    let cancelled = false;

    fetch(
      `/api/public/customer/${encodeURIComponent(customerSlug)}/manage-auth`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: saved }),
      },
    )
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(async ({ ok, d }) => {
        if (cancelled || !ok) return;
        setCouple(d.couple || null);
        setGuests(d.guests || []);
        setUnlocked(true);
        try {
          await loadWishes(saved);
        } catch {
          /* ignore */
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [customerSlug, loadWishes]);

  const guestUrl = useCallback(
    (g) => {
      const token = g.token || g.slug;
      return `${origin}/live/${customerSlug}/${token}`;
    },
    [origin, customerSlug],
  );

  const copyOne = async (g) => {
    try {
      await navigator.clipboard.writeText(guestUrl(g));
      setMsg(`Link tersalin: ${g.name}`);
    } catch {
      setError("Gagal menyalin");
    }
  };

  const toggleShared = async (g, shared) => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        `/api/public/customer/${encodeURIComponent(customerSlug)}/guests/shared`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: code.trim(),
            token: g.token,
            shared,
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Gagal menyimpan");
        return;
      }
      setGuests(data.guests || []);
      setMsg(
        shared
          ? `✓ ${g.name} ditandai sudah dibagikan`
          : `Dibuka lagi: ${g.name}`,
      );
    } catch {
      setError("Gagal menyimpan checklist");
    } finally {
      setBusy(false);
    }
  };

  const addGuest = async (e) => {
    e?.preventDefault?.();
    const name = newName.trim();
    if (!name) return;

    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        `/api/public/customer/${encodeURIComponent(customerSlug)}/guests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: code.trim(), name }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Gagal menambah tamu");
        return;
      }
      setGuests(data.guests || []);
      setNewName("");
      setMsg(`Tamu ditambahkan: ${name}`);
      setFilter("all");
    } catch {
      setError("Gagal menambah tamu");
    } finally {
      setBusy(false);
    }
  };

  const removeGuest = async (g) => {
    if (
      !window.confirm(
        `Hapus tamu “${g.name}”? Link undangan tidak bisa dipakai lagi.`,
      )
    ) {
      return;
    }

    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        `/api/public/customer/${encodeURIComponent(customerSlug)}/guests`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: code.trim(), token: g.token }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Gagal menghapus");
        return;
      }
      setGuests(data.guests || []);
      setMsg(`Tamu dihapus: ${g.name}`);
    } catch {
      setError("Gagal menghapus tamu");
    } finally {
      setBusy(false);
    }
  };

  const removeWish = async (w) => {
    if (!window.confirm(`Hapus RSVP dari “${w.nama || "Tamu"}”?`)) return;

    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        `/api/public/customer/${encodeURIComponent(customerSlug)}/wishes`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: code.trim(), id: w.id }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Gagal menghapus");
        return;
      }
      setWishes(data.wishes || []);
      setMsg(`RSVP dihapus: ${w.nama || "Tamu"}`);
    } catch {
      setError("Gagal menghapus RSVP");
    } finally {
      setBusy(false);
    }
  };

  const refreshRsvp = async () => {
    setBusy(true);
    setError("");
    try {
      await loadWishes(code.trim());
      setMsg("Data RSVP diperbarui");
    } catch (err) {
      setError(err.message || "Gagal memuat RSVP");
    } finally {
      setBusy(false);
    }
  };

  const copyPending = async () => {
    const lines = guests
      .filter((g) => !g.shared)
      .map((g) => `${g.name}\t${guestUrl(g)}`);
    if (!lines.length) {
      setMsg("Semua sudah dibagikan");
      return;
    }
    try {
      await navigator.clipboard.writeText(["Nama\tLink", ...lines].join("\n"));
      setMsg(`${lines.length} link (belum dibagikan) tersalin`);
    } catch {
      setError("Gagal menyalin");
    }
  };

  const waShare = (g) => {
    const url = guestUrl(g);
    const text = encodeURIComponent(
      `Assalamualaikum/Halo ${g.name},\n\nBerikut undangan digital kami:\n${url}\n\nTerima kasih 🙏`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
  };

  if (!unlocked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-neutral-100 px-4">
        <form
          onSubmit={unlock}
          className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm"
        >
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Kelola undangan
          </p>
          <h1 className="mt-2 font-serif text-2xl text-neutral-900">
            Daftar tamu
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Masukkan kode akses yang diberikan panitia undangan.
          </p>
          <input
            className="mt-4 w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-800"
            type="password"
            placeholder="Kode akses"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy || !code.trim()}
            className="mt-4 w-full rounded-md bg-neutral-900 py-2.5 text-sm text-white disabled:opacity-50"
          >
            {busy ? "Memeriksa…" : "Masuk"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className="sticky top-0 z-10 border-b bg-white/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-lg flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs text-neutral-400">Kelola undangan</p>
            <h1 className="font-serif text-xl text-neutral-900">
              {couple?.groom} &amp; {couple?.bride}
            </h1>
          </div>
          <Link
            to={`/live/${customerSlug}`}
            className="text-xs text-neutral-500 underline-offset-2 hover:underline"
            target="_blank"
          >
            Lihat undangan
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        {msg && (
          <p className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {msg}
          </p>
        )}
        {error && (
          <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Tabs */}
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("guests")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium ${
              tab === "guests"
                ? "bg-neutral-900 text-white"
                : "border border-neutral-200 bg-white text-neutral-600"
            }`}
          >
            Tamu ({guests.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("rsvp");
              loadWishes(code.trim()).catch(() => {});
            }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium ${
              tab === "rsvp"
                ? "bg-neutral-900 text-white"
                : "border border-neutral-200 bg-white text-neutral-600"
            }`}
          >
            RSVP ({wishes.length})
          </button>
        </div>

        {/* ——— TAB TAMU (sama seperti sebelumnya) ——— */}
        {tab === "guests" && (
          <>
            {/* ... progress, tambah tamu, filter, list — tetap sama seperti kode Anda ... */}
            <div className="rounded-xl border bg-white p-4 shadow-sm">
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
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100">
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
              className="mt-4 rounded-xl border bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                Tambah tamu
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  className="min-w-0 flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-800"
                  placeholder="Nama tamu undangan"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  disabled={busy}
                />
                <button
                  type="submit"
                  disabled={busy || !newName.trim()}
                  className="shrink-0 rounded-md bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  + Tambah
                </button>
              </div>
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
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full px-3 py-1.5 text-xs ${
                    filter === f.id
                      ? "bg-neutral-900 text-white"
                      : "border border-neutral-200 bg-white text-neutral-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
              <button
                type="button"
                onClick={copyPending}
                className="ml-auto rounded-full border border-neutral-300 px-3 py-1.5 text-xs hover:border-neutral-800"
              >
                Salin yang belum
              </button>
            </div>

            <ul className="mt-4 space-y-2">
              {visible.length === 0 && (
                <li className="rounded-xl border border-dashed bg-white py-10 text-center text-sm text-neutral-400">
                  Tidak ada tamu di filter ini
                </li>
              )}
              {visible.map((g) => (
                <li
                  key={g.token}
                  className={`rounded-xl border bg-white p-4 shadow-sm ${
                    g.shared ? "opacity-80" : ""
                  }`}
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
                        className={`font-medium text-neutral-900 ${
                          g.shared ? "line-through text-neutral-500" : ""
                        }`}
                      >
                        {g.name}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[10px] text-neutral-400">
                        {guestUrl(g)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => copyOne(g)}
                      className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs text-white"
                    >
                      Salin link
                    </button>
                    <button
                      type="button"
                      onClick={() => waShare(g)}
                      className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:border-neutral-800"
                    >
                      Bagikan WA
                    </button>
                    {!g.shared ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => toggleShared(g, true)}
                        className="rounded-md border border-emerald-300 px-3 py-1.5 text-xs text-emerald-800 hover:bg-emerald-50"
                      >
                        Sudah kirim
                      </button>
                    ) : (
                      <span className="self-center text-[10px] text-neutral-400">
                        Sudah dibagikan
                        {g.sharedAt
                          ? ` · ${new Date(g.sharedAt).toLocaleDateString("id-ID")}`
                          : ""}
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => removeGuest(g)}
                      className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* ——— TAB RSVP ——— */}
        {tab === "rsvp" && (
          <>
            {/* Ringkasan angka */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border bg-white p-3 text-center shadow-sm">
                <p className="text-[10px] uppercase tracking-wide text-neutral-400">
                  Konfirmasi
                </p>
                <p className="mt-1 text-2xl font-semibold text-neutral-900 tabular-nums">
                  {rsvpStats.total}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 p-3 text-center shadow-sm">
                <p className="text-[10px] uppercase tracking-wide text-emerald-700/70">
                  Hadir
                </p>
                <p className="mt-1 text-2xl font-semibold text-emerald-800 tabular-nums">
                  {rsvpStats.hadirCount}
                </p>
                <p className="text-[10px] text-emerald-700/60">
                  {rsvpStats.totalTamu} orang
                </p>
              </div>
              <div className="rounded-xl border bg-white p-3 text-center shadow-sm">
                <p className="text-[10px] uppercase tracking-wide text-neutral-400">
                  Tidak hadir
                </p>
                <p className="mt-1 text-2xl font-semibold text-neutral-700 tabular-nums">
                  {rsvpStats.tidakCount}
                </p>
              </div>
            </div>

            {/* Pie */}
            <div className="mt-4 rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Proporsi kehadiran
                </p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={refreshRsvp}
                  className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs hover:border-neutral-800 disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>
              <RsvpPie
                hadir={rsvpStats.hadirCount}
                tidak={rsvpStats.tidakCount}
              />
              {rsvpStats.hadirCount > 0 && (
                <p className="mt-4 text-center text-xs text-neutral-500">
                  Perkiraan total tamu yang hadir:{" "}
                  <strong className="text-neutral-800">
                    {rsvpStats.totalTamu} orang
                  </strong>
                </p>
              )}
            </div>

            {/* Filter list */}
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

            {/* Daftar ucapan + kehadiran */}
            <ul className="mt-4 space-y-2">
              {visibleRsvp.length === 0 && (
                <li className="rounded-xl border border-dashed bg-white py-10 text-center text-sm text-neutral-400">
                  Belum ada data RSVP
                </li>
              )}
              {visibleRsvp.map((w) => {
                const isHadir = w.kehadiran !== "tidak";
                return (
                  <li
                    key={w.id}
                    className="rounded-xl border bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-neutral-900">
                            {w.nama || "Tamu"}
                          </p>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
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
                          <p className="mt-2 font-serif text-sm leading-relaxed text-neutral-700">
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
                        className="shrink-0 rounded-md border border-red-200 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <p className="mt-8 text-center text-[10px] text-neutral-400">
          Checklist & RSVP tersimpan otomatis.
        </p>
      </main>
    </div>
  );
}
