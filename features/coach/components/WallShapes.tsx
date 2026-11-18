"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function WallShapes() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.to(".ak-shape", {
        y: "+=14",
        rotation: "+=4",
        duration: 3.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.35, from: "random" },
      });
    },
    { scope: root },
  );

  return (
    <div className="ak-shapes" ref={root} aria-hidden="true">
      <span className="ak-shape ak-shape--blob" />
      <span className="ak-shape ak-shape--circle" />
      <span className="ak-shape ak-shape--square" />
      <span className="ak-shape ak-shape--stick" />
      <span className="ak-shape ak-shape--dot" />
      <span className="ak-shape ak-shape--ring" />
    </div>
  );
}
