// InvitationPage.jsx

import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import InvitationCover from "../components/cover/InvitationCover";
import InvitationShell from "../components/layout/InvitationShell";
import InvitationNavbar from "../components/navbar/InvitationNavbar";
import MusicPlayer from "../components/music/MusicPlayer";

import HeroSection from "../components/hero/HeroSection";
import EventSection from "../components/event/EventSection";
import BrideSection from "../components/couple/BrideSection";
import GroomSection from "../components/couple/GroomSection";
import LoveJourney from "../components/journey/LoveJourney";
import JoinStreamingSection from "../components/streaming/JoinStreamingSection";
import RsvpSection from "../components/rsvp/RSVPSection";
import WishesSection from "../components/wishes/WishesSection";
import GallerySection from "../components/gallery/GallerySection";
import GiftSection from "../components/gift/GiftSection";
import ThankYouSection from "../components/thankyou/ThankYouSection";

import NotFoundPage from "./NotFoundPage";
import { useWedding } from "../../../context/WeddingContext";
import { scrollToSection } from "../../../../utils/scrollToSection";

/**
 * Dipakai lewat:
 *   Demo → /demo/template-1/:coupleSlug/:guestSlug?
 *   Live → /live/:customerSlug/:guestSlug?
 *
 * Data couple/guests selalu dari WeddingProvider (demoContent / wedding.json).
 * Tidak lagi hard-code COUPLE.slug dari file couple.js.
 */
const InvitationPage = () => {
  // URL: demo pakai coupleSlug, live pakai customerSlug
  const { coupleSlug, customerSlug, guestSlug } = useParams();

  const { couple, guests = [], defaultGuest, mode, slug } = useWedding();

  // ========================================
  // STATE (hooks selalu di atas, sebelum return)
  // ========================================
  const [isOpen, setIsOpen] = useState(false);
  const [isCoverComplete, setIsCoverComplete] = useState(false);
  const [isScrollReady, setIsScrollReady] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const scrollRef = useRef(null);

  // ========================================
  // VALIDASI
  // ========================================
  // Live: slug ada di URL path /live/:customerSlug — sudah dicek API
  // Demo: boleh cocokkan coupleSlug dengan slug di content (opsional)
  const urlCoupleKey = coupleSlug || customerSlug || "";
  const expectedSlug = couple?.slug || slug || "";

  // Demo: jika URL couple tidak cocok dengan data demo → 404
  // Live: jangan 404 di sini (API sudah memastikan customer ada)
  const isInvalidDemoCouple =
    mode === "demo" &&
    urlCoupleKey &&
    expectedSlug &&
    urlCoupleKey !== expectedSlug;

  // Guest: tanpa segment guest → pakai default
  // Ada guestSlug → harus ada di daftar guests
  const hasGuestSegment = Boolean(guestSlug);
  const foundGuest = hasGuestSegment
    ? guests.find((g) => g.slug === guestSlug)
    : null;
  const isInvalidGuest = hasGuestSegment && !foundGuest;

  const guest = foundGuest ||
    defaultGuest ||
    guests[0] || {
      slug: "tamu-undangan",
      name: "Tamu Undangan",
    };

  // ========================================
  // HANDLERS
  // ========================================
  const handleOpenInvitation = () => {
    setIsOpen(true);
  };

  const handleCoverComplete = () => {
    setIsCoverComplete(true);
    setIsScrollReady(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
  };

  const handleToggleNavbar = () => {
    setIsNavbarOpen((previous) => !previous);
  };

  const handleNavigate = (target) => {
    setIsNavbarOpen(false);

    const id = String(target || "").replace(/^#/, "");
    if (!id) return;

    requestAnimationFrame(() => {
      scrollToSection(scrollRef, id);
    });
  };

  const goToWishes = () => {
    scrollToSection(scrollRef, "wishes");
  };

  // ========================================
  // 404
  // ========================================
  if (isInvalidDemoCouple || isInvalidGuest) {
    return <NotFoundPage />;
  }

  return (
    <main
      className="
        relative
        h-dvh
        min-h-0
        w-full
        overflow-hidden
        bg-neutral-100
      "
    >
      <InvitationShell scrollRef={scrollRef} isLocked={!isScrollReady}>
        <HeroSection isOpen={isOpen} scrollRoot={scrollRef} />

        <BrideSection isOpen={isScrollReady} scrollRoot={scrollRef} />

        <GroomSection isOpen={isScrollReady} scrollRoot={scrollRef} />

        <LoveJourney isOpen={isScrollReady} scrollRoot={scrollRef} />

        <EventSection isOpen={isScrollReady} scrollRoot={scrollRef} />

        <JoinStreamingSection isOpen={isScrollReady} scrollRoot={scrollRef} />

        <RsvpSection
          isOpen={isScrollReady}
          scrollRoot={scrollRef}
          onNavigateToWishes={goToWishes}
        />

        <WishesSection isOpen={isScrollReady} scrollRoot={scrollRef} />

        <GallerySection isOpen={isScrollReady} scrollRoot={scrollRef} />

        <GiftSection isOpen={isScrollReady} scrollRoot={scrollRef} />

        <ThankYouSection isOpen={isScrollReady} scrollRoot={scrollRef} />
      </InvitationShell>

      <InvitationNavbar
        isOpen={isNavbarOpen}
        onToggle={handleToggleNavbar}
        onNavigate={handleNavigate}
        disabled={!isScrollReady}
      />

      <MusicPlayer isVisible={isOpen} />

      <InvitationCover
        isOpen={isOpen}
        isComplete={isCoverComplete}
        onOpen={handleOpenInvitation}
        onAnimationComplete={handleCoverComplete}
        guestName={guest.name}
      />
    </main>
  );
};

export default InvitationPage;
