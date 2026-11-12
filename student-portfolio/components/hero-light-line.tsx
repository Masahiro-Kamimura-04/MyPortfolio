"use client";

import { useEffect, useRef } from "react";
import { createRoutePath, getLineFrame } from "../lib/journey-line";

const points = [{x:145,y:365},{x:245,y:280},{x:260,y:165},{x:355,y:65}];
const route = createRoutePath(points);

export function HeroLightLine({ paused }: { paused: boolean }) {
  const drawing = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = drawing.current;
    if (!svg) return;
    const track = svg.querySelector<SVGPathElement>(".hero-line-track")!;
    const active = svg.querySelector<SVGPathElement>(".hero-line-active")!;
    const tip = svg.querySelector<SVGCircleElement>(".hero-line-tip")!;
    const nodes = Array.from(svg.querySelectorAll<SVGCircleElement>(".hero-line-node"));
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const length = track.getTotalLength();
    let frame = 0;
    function update() {
      frame = 0;
      if (!svg) return;
      const hero = svg.closest<HTMLElement>(".hero");
      const still = paused || media.matches;
      const progress = still ? 1 : Math.min(1, .32 + Math.max(0, -(hero?.getBoundingClientRect().top ?? 0)) / Math.max(1, (hero?.clientHeight ?? 760) * .7));
      const cursor = points[0].y + (points[points.length - 1].y - points[0].y) * progress;
      const state = getLineFrame(cursor, length, distance => track.getPointAtLength(distance));
      active.style.strokeDashoffset = String(1 - state.progress);
      tip.setAttribute("cx", String(state.x));
      tip.setAttribute("cy", String(state.y));
      tip.style.opacity = still ? "0" : "1";
      nodes.forEach((node, index) => node.classList.toggle("is-reached", points[index].y >= cursor));
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); media.removeEventListener("change", schedule); };
  }, [paused]);
  return <svg className="hero-light-line" ref={drawing} viewBox="0 0 540 430" fill="none" aria-hidden="true">
    <path className="hero-line-track" d={route}/>
    <path className="hero-line-active" d={route} pathLength="1"/>
    {points.map((point, index) => <circle className="hero-line-node" key={index} cx={point.x} cy={point.y} r="4"/>)}
    <circle className="hero-line-tip" r="4"/>
  </svg>;
}
