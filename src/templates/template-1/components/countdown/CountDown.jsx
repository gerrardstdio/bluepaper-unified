// Countdown.jsx
import { useEffect, useState } from "react";

/**
 * Hitung sisa waktu ke targetDate.
 * targetDate sebaiknya ISO dengan offset WIB: "...+07:00"
 * agar sama di semua zona waktu browser.
 */
const getTimeLeft = (targetDate) => {
  const now = Date.now();
  const target = new Date(targetDate).getTime();
  const diff = Math.max(0, target - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isFinished: diff <= 0,
  };
};

const pad = (value) => String(value).padStart(2, "0");

const Countdown = ({ targetDate, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(targetDate));
    tick();

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const items = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  if (timeLeft.isFinished) {
    return (
      <p
        className={`
          text-[11px]
          uppercase
          tracking-[0.3em]
          text-white/70
          ${className}
        `}
      >
        Hari Bahagia
      </p>
    );
  }

  return (
    <div
      className={`
        flex
        items-center
        justify-center
        gap-4
        md:gap-5
        ${className}
      `}
    >
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-4 md:gap-5">
          <div className="flex min-w-11 flex-col items-center">
            <span
              className="
                font-serif
                text-xl
                font-normal
                tabular-nums
                tracking-tight
                text-white
                md:text-2xl
              "
            >
              {pad(item.value)}
            </span>
            <span
              className="
                mt-1.5
                text-[8px]
                uppercase
                tracking-[0.28em]
                text-white/50
              "
            >
              {item.label}
            </span>
          </div>

          {index < items.length - 1 && (
            <span className="mb-4 text-white/30">:</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Countdown;
