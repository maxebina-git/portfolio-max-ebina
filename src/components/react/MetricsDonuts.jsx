import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const items = [
  { label: "UX Strategy", value: 0.98 },
  { label: "Discovery", value: 0.95 },
  { label: "Design Systems", value: 0.98 },
  { label: "Design Engineering", value: 0.97 },
  { label: "Frontend", value: 0.8 },
  { label: "AI Workflows", value: 0.92 }
];

export default function ArcBadges() {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;

  // OBSERVER
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // GSAP
  useEffect(() => {
    if (!containerRef.current) return;

    const tracks =
      containerRef.current.querySelectorAll(".track");

    const circles =
      containerRef.current.querySelectorAll(".progress");

    const values = [
      0.95,
      0.85,
      1.0,
      0.9,
      0.8,
      0.88
    ];

    // TRACK CINZA
    tracks.forEach((track, index) => {

      const radius =
        track.r.baseVal.value;

      const circumference =
        2 * Math.PI * radius;

      gsap.killTweensOf(track);

      if (visible) {

        gsap.fromTo(
          track,
          {
            strokeDashoffset: circumference
          },
          {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 1 + index * 0.15
          }
        );

      } else {

        gsap.to(track, {
          strokeDashoffset: circumference,
          duration: 0.4,
          ease: "power2.in"
        });

      }

    });

    // ARCO PRETO
    circles.forEach((circle, index) => {

      const radius =
        circle.r.baseVal.value;

      const circumference =
        2 * Math.PI * radius;

      gsap.killTweensOf(circle);

      if (visible) {

        gsap.fromTo(
          circle,
          {
            strokeDashoffset: circumference
          },
          {
            strokeDashoffset:
              circumference * (1 - values[index]),
            duration: 1.5,
            ease: "power3.out",
            delay: 1.5 + index * 0.2
          }
        );

      } else {

        gsap.to(circle, {
          strokeDashoffset: circumference,
          duration: 0.8,
          ease: "power2.in"
        });

      }

    });

  }, [visible]);

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap gap-4 justify-center lg:justify-start max-w-md"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="arc-item relative w-32 h-24 flex items-center justify-center"
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 80 80"
            className="absolute inset-0"
          >
            <circle
              className="track"
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              transform="rotate(-90 40 40)"
            />

            <circle
              className="progress"
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.7"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              transform="rotate(-90 40 40)"
            />
          </svg>

          <li className="badge relative z-10">
            {item.label}
          </li>
        </div>
      ))}
    </div>
  );
}