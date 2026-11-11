"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Code2, GitBranch } from "lucide-react";
import { milestones, type Story } from "../content/portfolio";
import { getWalkFrame, type StepPoint } from "../lib/journey-walk";

function Footprint() {
  return <svg viewBox="0 0 24 48" fill="currentColor" aria-hidden="true">
    <ellipse cx="8" cy="7" rx="4" ry="5"/>
    <ellipse cx="15" cy="6" rx="2.5" ry="3.3"/>
    <ellipse cx="20" cy="9" rx="2" ry="2.8"/>
    <ellipse cx="22" cy="14" rx="1.5" ry="2"/>
    <path d="M4 17C5 11 17 12 19 18C21 24 14 27 14 32C14 36 17 39 14 43C11 48 4 46 3 41C2 36 7 32 6 28C5 24 2 22 4 17Z"/>
  </svg>;
}

export function JourneyTimeline({ paused, onSelect }: { paused: boolean; onSelect: (story: Story) => void }) {
  const timeline = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = timeline.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".milestone"));
    const prints = Array.from(root.querySelectorAll<HTMLElement>(".journey-landing"));
    const mover = root.querySelector<HTMLElement>(".journey-moving")!;
    const svg = root.querySelector<SVGSVGElement>(".journey-route")!;
    const path = svg.querySelector("path")!;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targets: StepPoint[] = [];
    let frame = 0;
    let previousLanded = -1;
    let needsLayout = true;

    function measure() {
      if (!root) return;
      const bounds = root.getBoundingClientRect();
      const compact = window.innerWidth <= 640;
      const center = compact ? 31 : bounds.width / 2;
      const sway = compact ? 7 : Math.min(40, bounds.width * .035);
      const stride = compact ? 8 : 19;
      const centers: StepPoint[] = [];
      targets = cards.map((card, index) => {
        const box = card.querySelector(".milestone-button")!.getBoundingClientRect();
        const y = box.top - bounds.top + box.height / 2;
        const fraction = (index + .5) / cards.length;
        const x = center - Math.sin(fraction * Math.PI * 2) * sway;
        centers.push({ x, y });
        return { x: x + (index % 2 ? stride : -stride), y };
      });
      const points = [{ x: center, y: 0 }, ...centers, { x: center, y: bounds.height - 38 }];
      let route = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const from = points[i - 1];
        const to = points[i];
        const middle = (from.y + to.y) / 2;
        route += ` C ${from.x} ${middle}, ${to.x} ${middle}, ${to.x} ${to.y}`;
      }
      svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
      path.setAttribute("d", route);
      prints.forEach((print, index) => {
        print.style.left = `${targets[index].x}px`;
        print.style.top = `${targets[index].y}px`;
      });
      needsLayout = false;
    }

    function update() {
      frame = 0;
      if (!root) return;
      if (needsLayout) measure();
      const bounds = root.getBoundingClientRect();
      const still = paused || media.matches;
      const cursor = window.innerHeight * .62 - bounds.top;
      const state = getWalkFrame(still ? Infinity : cursor, targets);
      const visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
      root.dataset.still = String(still);
      root.dataset.activeStep = String(state.landed);
      mover.hidden = still || state.movingIndex < 0 || !visible;
      if (!mover.hidden) {
        mover.dataset.side = state.movingIndex % 2 ? "right" : "left";
        mover.dataset.step = String(state.movingIndex + 1);
        mover.style.left = `${state.x}px`;
        mover.style.top = `${state.y}px`;
        mover.style.setProperty("--foot-side", state.movingIndex % 2 ? "-1" : "1");
        mover.style.setProperty("--lift-scale", String(1 + state.lift * .2));
        mover.style.setProperty("--lift-angle", `${180 + state.lift * (state.movingIndex % 2 ? -12 : 12)}deg`);
      }
      prints.forEach((print, index) => {
        const landed = index < state.landed;
        print.classList.toggle("is-landed", landed);
        print.classList.toggle("is-current", index === state.landed - 1);
        cards[index].dataset.reached = String(landed);
        if (still || !visible || !landed) {
          print.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
        }
      });
      // Fast scrolls settle at the newest landing without overlapping foot motions.
      if (!still && visible && previousLanded >= 0 && state.landed > previousLanded) {
        prints.forEach(print => print.getAnimations({ subtree: true }).forEach(animation => animation.cancel()));
        prints[state.landed - 1].querySelectorAll(".journey-ripple").forEach((ring, index) => {
          ring.animate([
            { opacity: .7, transform: "translate(-50%, -50%) scale(.12)" },
            { opacity: .32, offset: .35 },
            { opacity: 0, transform: "translate(-50%, -50%) scale(1.35)" },
          ], { duration: 2000, delay: index * 180, easing: "cubic-bezier(.16,.6,.4,1)" });
        });
      }
      previousLanded = state.landed;
    }

    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    function resize() { needsLayout = true; schedule(); }
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    cards.forEach(card => observer.observe(card));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize);
    media.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      media.removeEventListener("change", schedule);
      prints.forEach(print => print.getAnimations({ subtree: true }).forEach(animation => animation.cancel()));
    };
  }, [paused]);

  return <div className="journey-timeline" ref={timeline}>
    <div className="journey-waterway" aria-hidden="true">
      <svg className="journey-route" preserveAspectRatio="none"><path fill="none"/></svg>
      {milestones.map((milestone, index) => <span
        className="journey-print journey-landing" key={milestone.id} data-step={index + 1}
        data-side={index % 2 ? "right" : "left"}
        style={{ "--foot-side": index % 2 ? -1 : 1, top: `${(index + .5) / milestones.length * 100}%` } as CSSProperties}>
        <i className="journey-ripple"/><i className="journey-ripple"/><i className="journey-ripple"/>
        <span className="journey-foot"><Footprint/></span>
        <span className="journey-step-number">0{index + 1}</span>
      </span>)}
      <span className="journey-print journey-moving" hidden><span className="journey-foot"><Footprint/></span></span>
    </div>
    {milestones.map((milestone, index) => <article className="milestone" key={milestone.id} aria-labelledby={`milestone-${milestone.id}`}>
      <div className="milestone-date"><time dateTime={milestone.date}>{milestone.displayDate}</time><span>{milestone.category}</span></div>
      <button className="milestone-button" onClick={() => onSelect(milestone)} aria-label={`${milestone.displayDate} ${milestone.title}の詳細を読む`}>
        <div className="milestone-heading"><span className="milestone-icon">{index === 0 ? <BookOpen size={18}/> : index === 3 ? <GitBranch size={18}/> : <Code2 size={18}/>}</span><ArrowUpRight className="milestone-arrow" size={20}/></div>
        <h3 id={`milestone-${milestone.id}`}>{milestone.title}</h3><p>{milestone.summary}</p>
        <span className="read-story">{milestone.category === "LEARNING" || milestone.note ? "学びの記録" : "制作の記録"}<ArrowRight size={14}/></span>
      </button>
      {milestone.note && <aside className="small-note"><span>↳ 学びのメモ</span><p>{milestone.note}</p></aside>}
    </article>)}
    <div className="journey-next"><span aria-hidden="true">↓</span>この先も、少しずつ。</div>
  </div>;
}
