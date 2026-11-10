"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Props = { paused: boolean; variant?: "hero" | "trail" };

/** Scroll paints the trail; only newly landed feet emit time-based ripples. */
export function WaterFootprints({ paused, variant = "trail" }: Props) {
  const surface = useRef<HTMLDivElement>(null);
  const count = variant === "hero" ? 12 : 30;

  useEffect(() => {
    const root = surface.current;
    if (!root) return;
    const steps = Array.from(root.querySelectorAll<HTMLElement>(".water-step"));
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = -1;
    let initialized = false;

    function update() {
      frame = 0;
      if (!root) return;
      const bounds = root.getBoundingClientRect();
      const still = paused || media.matches;
      const hero = root.closest(".hero");
      const progress = still ? 1 : variant === "hero"
        ? .25 + Math.max(0, -(hero?.getBoundingClientRect().top ?? 0)) / Math.max(1, (hero?.clientHeight ?? bounds.height) * .7)
        : (window.innerHeight * .72 - bounds.top) / Math.max(1, bounds.height);
      const current = Math.min(count - 1, Math.floor(Math.max(0, Math.min(1, progress)) * count) - 1);
      const visible = bounds.bottom > 0 && bounds.top < window.innerHeight;

      steps.forEach((step, index) => {
        const landed = index <= current;
        step.classList.toggle("is-landed", landed);
        step.classList.toggle("is-current", index === current);
        if (still || !landed || !visible) {
          step.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
        }
        // Cap emissions after a large scroll jump instead of playing the entire history.
        if (!still && visible && initialized && index > previous && landed && index >= current - 1) {
          step.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
          step.querySelector("svg")?.animate([
            { opacity: 0, transform: "translateY(12px) scale(.7)" },
            { opacity: 1, transform: "translateY(0) scale(1)" },
          ], { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" });
          step.querySelectorAll(".water-ripple").forEach((ring, ringIndex) => {
            ring.animate([
              { opacity: .7, transform: "translate(-50%, -50%) scale(.15)" },
              { opacity: .35, offset: .35 },
              { opacity: 0, transform: "translate(-50%, -50%) scale(1.7)" },
            ], { duration: 2000, delay: ringIndex * 220, easing: "cubic-bezier(.16,.6,.4,1)" });
          });
        }
      });
      root.dataset.still = String(still);
      previous = current;
      initialized = true;
    }

    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
      steps.forEach(step => step.getAnimations({ subtree: true }).forEach(animation => animation.cancel()));
    };
  }, [count, paused, variant]);

  return <div ref={surface} className={`water-footprints water-footprints--${variant}`} aria-hidden="true">
    {Array.from({ length: count }, (_, index) => {
      const fraction = index / (count - 1);
      const right = index % 2 === 1;
      const x = variant === "hero"
        ? 32 + fraction * 33 + Math.sin(fraction * Math.PI * 2) * 11 + (right ? 5 : -5)
        : 50 + Math.sin(fraction * Math.PI * 3) * 13 + (right ? 13 : -13);
      return <span className="water-step" key={index} style={{
        left: `${x}%`, top: `${variant === "hero" ? 86 - fraction * 71 : 2 + fraction * 94}%`,
        "--foot-turn": `${variant === "hero" ? 16 : 180 + Math.cos(fraction * Math.PI * 3) * -12}deg`,
        "--foot-side": right ? -1 : 1,
      } as CSSProperties}>
        <i className="water-ripple"/><i className="water-ripple"/><i className="water-ripple"/>
        <span className="footprint-shape"><svg viewBox="0 0 24 48" fill="currentColor">
          <ellipse cx="8" cy="7" rx="4" ry="5"/>
          <ellipse cx="15" cy="6" rx="2.5" ry="3.3"/>
          <ellipse cx="20" cy="9" rx="2" ry="2.8"/>
          <ellipse cx="22" cy="14" rx="1.5" ry="2"/>
          <path d="M4 17C5 11 17 12 19 18C21 24 14 27 14 32C14 36 17 39 14 43C11 48 4 46 3 41C2 36 7 32 6 28C5 24 2 22 4 17Z"/>
        </svg></span>
      </span>;
    })}
  </div>;
}
