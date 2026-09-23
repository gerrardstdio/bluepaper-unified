// src/pages/LiveInvitationPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { resolveLiveContent } from "../templates/template-1/data/resolveContent";
import { WeddingProvider } from "../context/WeddingContext";
import InvitationPage from "../templates/template-1/pages/InvitationPage";
import NotFoundPage from "../templates/template-1/pages/NotFoundPage";

function findGuest(guests, param) {
  if (!param) return null;
  const p = String(param);
  return (
    (guests || []).find((g) => g.token === p || g.id === p || g.slug === p) ||
    null
  );
}

export default function LiveInvitationPage() {
  // HARUS sama dengan App.jsx: :customerSlug / :guestToken
  const { customerSlug, guestToken } = useParams();

  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | notfound

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!customerSlug) {
        setStatus("notfound");
        return;
      }

      setStatus("loading");
      try {
        // HARUS sama dengan adminApiPlugin: /api/public/customer/:slug
        const res = await fetch(
          `/api/public/customer/${encodeURIComponent(customerSlug)}`,
          { headers: { Accept: "application/json" }, cache: "no-store" },
        );

        if (!res.ok) {
          if (!cancelled) setStatus("notfound");
          return;
        }

        const raw = await res.json();
        const resolved = resolveLiveContent(raw);
        if (!resolved) {
          if (!cancelled) setStatus("notfound");
          return;
        }

        if (!cancelled) {
          setContent(resolved);
          setStatus("ok");
        }
      } catch {
        if (!cancelled) setStatus("notfound");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [customerSlug]);

  const guest = useMemo(() => {
    if (!content) return null;
    if (!guestToken) return content.defaultGuest || null;
    return findGuest(content.guests, guestToken);
  }, [content, guestToken]);

  if (status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-neutral-500">
        Memuat undangan…
      </div>
    );
  }

  if (status === "notfound" || !content) {
    return <NotFoundPage />;
  }

  // Token di URL tapi tidak ada di daftar tamu → 404
  if (guestToken && !guest) {
    return <NotFoundPage />;
  }

  const guestName = guest?.name || "Tamu Undangan";

  // WeddingProvider memakai prop `content`, bukan `value`
  return (
    <WeddingProvider
      content={{
        ...content,
        guestName,
        customerSlug: content.customerSlug || customerSlug,
      }}
    >
      <InvitationPage guestName={guestName} />
    </WeddingProvider>
  );
}
