// MusicPlayer.jsx
import { useEffect, useRef, useState } from "react";
import { Disc3Icon, PlayIcon, PauseIcon } from "@animateicons/react/lucide";
import { useWedding } from "../../../../context/WeddingContext";

/** Fallback demo jika musicUrl kosong */
const DEMO_MUSIC =
  "/media/template-1/music/Christina Perri - A Thousand Years.mp3";

const MusicPlayer = ({ isVisible }) => {
  const { musicUrl } = useWedding();
  const weddingMusic = musicUrl?.trim() || DEMO_MUSIC;

  const audioRef = useRef(null);
  const wasPlayingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Ganti src saat musicUrl berubah (pindah demo ↔ live)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    wasPlayingRef.current = false;
    audio.src = weddingMusic;
    audio.load();
  }, [weddingMusic]);

  // AUTO PLAY SAAT INVITATION DIBUKA
  useEffect(() => {
    if (!isVisible) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;

    const playMusic = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        console.warn("Music autoplay was blocked by browser.");
        setIsPlaying(false);
      }
    };

    playMusic();

    return () => {
      audio.pause();
      setIsPlaying(false);
    };
  }, [isVisible, weddingMusic]);

  // PAUSE SAAT PINDAH TAB / APP
  useEffect(() => {
    if (!isVisible) return;

    const audio = audioRef.current;
    if (!audio) return;

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        wasPlayingRef.current = !audio.paused && !audio.ended;

        if (!audio.paused) {
          audio.pause();
          setIsPlaying(false);
        }
      } else if (wasPlayingRef.current) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
        wasPlayingRef.current = false;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isVisible]);

  const handleToggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
        wasPlayingRef.current = false;
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      wasPlayingRef.current = false;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    wasPlayingRef.current = false;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={weddingMusic}
        loop
        preload="auto"
        onEnded={handleEnded}
      />

      <button
        type="button"
        aria-label={isPlaying ? "Pause music" : "Play music"}
        aria-pressed={isPlaying}
        onClick={handleToggleMusic}
        className={`
          fixed bottom-6 right-6 z-[100]
          flex h-12 w-12 items-center justify-center
          rounded-full border border-white/20 bg-black/50
          shadow-lg backdrop-blur-md
          transition-all duration-700 ease-out
          md:bottom-7 md:right-7
          ${
            isVisible
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-3 scale-90 opacity-0"
          }
        `}
      >
        <div
          className="
            relative flex h-9 w-9 items-center justify-center rounded-full
            animate-[spin_4s_linear_infinite]
          "
          style={{
            animationPlayState: isPlaying ? "running" : "paused",
          }}
        >
          <Disc3Icon
            size={36}
            isAnimated={false}
            className="pointer-events-none text-white/90"
          />
          <span className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 backdrop-blur-[2px]">
            {isPlaying ? (
              <PauseIcon size={10} isAnimated={false} className="text-white" />
            ) : (
              <PlayIcon
                size={10}
                isAnimated={false}
                className="ml-0.5 text-white"
              />
            )}
          </span>
        </div>
      </button>
    </>
  );
};

export default MusicPlayer;
