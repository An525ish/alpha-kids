"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function IntroArt() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.to(".ak-art__hand", {
        rotate: 8,
        transformOrigin: "20% 80%",
        duration: 1.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // SVG rotate() around local 0,0 = dial nose (parent is already translate(70 88))
      const tick = root.current?.querySelector<SVGGElement>(".ak-art__tick");
      if (!tick) return;

      let angle = 0;
      tick.setAttribute("transform", "rotate(0)");
      const id = window.setInterval(() => {
        angle = (angle + 6) % 360;
        tick.setAttribute("transform", `rotate(${angle})`);
      }, 1000);

      return () => window.clearInterval(id);
    },
    { scope: root },
  );

  return (
    <div className="ak-art" ref={root} aria-hidden="true">
      <svg
        className="ak-art__svg"
        viewBox="24 32 314 358"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
      >
        {/* Fridge door panel */}
        <rect
          x="28"
          y="36"
          width="304"
          height="350"
          rx="28"
          fill="#EAF7F3"
          stroke="#243B6B"
          strokeWidth="6"
        />
        <rect
          x="48"
          y="56"
          width="264"
          height="310"
          rx="18"
          fill="#D7F0E9"
          stroke="#243B6B"
          strokeWidth="3"
        />
        {/* Door handle */}
        <rect x="292" y="170" width="14" height="70" rx="7" fill="#243B6B" />

        {/* Stuck sticky notes */}
        <g transform="translate(58 78) rotate(-8)">
          <rect width="72" height="64" rx="6" fill="#F6E59B" stroke="#243B6B" strokeWidth="3" />
          <circle cx="36" cy="4" r="7" fill="#F06A3D" stroke="#243B6B" strokeWidth="2.5" />
          <circle cx="36" cy="4" r="2.5" fill="#243B6B" />
          <path d="M14 28h44M14 40h34" stroke="#243B6B" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g transform="translate(250 92) rotate(10)">
          <rect width="58" height="52" rx="6" fill="#FFF8E8" stroke="#243B6B" strokeWidth="3" />
          <circle cx="29" cy="3" r="6" fill="#243B6B" />
          <circle cx="29" cy="3" r="2" fill="#FFF8E8" />
          <path d="M12 24h34M12 34h24" stroke="#243B6B" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Magnets */}
        <circle cx="78" cy="190" r="14" fill="#F06A3D" stroke="#243B6B" strokeWidth="3" />
        <circle cx="286" cy="210" r="11" fill="#243B6B" />
        <rect
          x="250"
          y="250"
          width="34"
          height="34"
          rx="8"
          fill="#F6E59B"
          stroke="#243B6B"
          strokeWidth="3"
          transform="rotate(15 267 267)"
        />

        {/* Plan magnet card */}
        <g transform="translate(198 168) rotate(4)">
          <rect
            width="110"
            height="128"
            rx="16"
            fill="#FFFFFF"
            stroke="#243B6B"
            strokeWidth="5"
          />
          <rect x="16" y="18" width="54" height="16" rx="8" fill="#F06A3D" />
          <circle cx="28" cy="52" r="12" fill="#243B6B" />
          <text
            x="28"
            y="57"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="14"
            fontFamily="system-ui, sans-serif"
            fontWeight="800"
          >
            1
          </text>
          <circle cx="28" cy="82" r="12" fill="#243B6B" />
          <text
            x="28"
            y="87"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="14"
            fontFamily="system-ui, sans-serif"
            fontWeight="800"
          >
            2
          </text>
          <circle cx="28" cy="112" r="12" fill="#243B6B" />
          <text
            x="28"
            y="117"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="14"
            fontFamily="system-ui, sans-serif"
            fontWeight="800"
          >
            3
          </text>
          <path
            d="M48 52h42M48 82h36M48 112h30"
            stroke="#243B6B"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.35"
          />
        </g>

        {/* Timer coach body */}
        <g transform="translate(95 155)">
          {/* Legs */}
          <rect x="48" y="148" width="14" height="36" rx="7" fill="#243B6B" />
          <rect x="78" y="148" width="14" height="36" rx="7" fill="#243B6B" />
          <ellipse cx="55" cy="186" rx="14" ry="7" fill="#F06A3D" stroke="#243B6B" strokeWidth="3" />
          <ellipse cx="85" cy="186" rx="14" ry="7" fill="#F06A3D" stroke="#243B6B" strokeWidth="3" />

          {/* Arm holding card */}
          <g className="ak-art__hand">
            <path
              d="M118 78 C140 70 158 88 152 108"
              stroke="#243B6B"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="152" cy="112" r="10" fill="#F06A3D" stroke="#243B6B" strokeWidth="3" />
          </g>

          {/* Other arm wave */}
          <path
            d="M22 86 C4 70 -6 92 10 104"
            stroke="#243B6B"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="10" cy="106" r="10" fill="#F06A3D" stroke="#243B6B" strokeWidth="3" />

          {/* Body dial */}
          <circle cx="70" cy="88" r="64" fill="#F06A3D" stroke="#243B6B" strokeWidth="6" />
          <circle cx="70" cy="88" r="46" fill="#FFF4EC" stroke="#243B6B" strokeWidth="4" />

          {/* Nose/hub at dial center; second hand rotates around it */}
          <g transform="translate(70 88)">
            <g className="ak-art__tick">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-36"
                stroke="#243B6B"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
            <circle className="ak-art__nose" cx="0" cy="0" r="8" fill="#243B6B" />
          </g>

          {/* Face */}
          <circle cx="54" cy="78" r="5" fill="#243B6B" />
          <circle cx="86" cy="78" r="5" fill="#243B6B" />
          <path
            d="M54 100 C62 110 78 110 86 100"
            stroke="#243B6B"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Crown nub */}
          <rect x="58" y="10" width="24" height="18" rx="8" fill="#243B6B" />
          <circle cx="70" cy="10" r="10" fill="#F6E59B" stroke="#243B6B" strokeWidth="3" />
        </g>

        {/* Parent + kid geometric figures */}
        <g transform="translate(56 300)">
          {/* Adult */}
          <circle cx="28" cy="18" r="14" fill="#243B6B" />
          <rect x="14" y="34" width="28" height="40" rx="12" fill="#243B6B" />
          {/* Kid */}
          <circle cx="68" cy="34" r="11" fill="#F06A3D" stroke="#243B6B" strokeWidth="3" />
          <rect
            x="56"
            y="46"
            width="24"
            height="28"
            rx="10"
            fill="#F6E59B"
            stroke="#243B6B"
            strokeWidth="3"
          />
          {/* Shared glance line */}
          <path
            d="M42 24 C52 18 58 22 60 30"
            stroke="#243B6B"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
          />
        </g>
      </svg>
    </div>
  );
}
