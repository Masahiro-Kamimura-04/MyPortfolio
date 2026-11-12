"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Code2, GitBranch } from "lucide-react";
import { milestones, type Story } from "../content/portfolio";
import { createRoutePath, getLineFrame, type RoutePoint } from "../lib/journey-line";

export function JourneyTimeline({ paused, onSelect }: { paused: boolean; onSelect: (story: Story) => void }) {
  const timeline = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = timeline.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".milestone"));
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(".journey-light-node"));
    const tip = root.querySelector<HTMLElement>(".journey-line-tip")!;
    const svg = root.querySelector<SVGSVGElement>(".journey-route")!;
    const track = svg.querySelector<SVGPathElement>(".journey-route-track")!;
    const active = svg.querySelector<SVGPathElement>(".journey-route-active")!;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targets: RoutePoint[] = [];
    let length = 0;
    let frame = 0;
    let previousReached = -1;
    let needsLayout = true;

    function measure() {
      if (!root) return;
      const bounds = root.getBoundingClientRect();
      const compact = window.innerWidth <= 640;
      const center = compact ? 31 : bounds.width / 2;
      const sway = compact ? 7 : Math.min(40, bounds.width * .035);
      targets = cards.map((card, index) => {
        const box = card.querySelector(".milestone-button")!.getBoundingClientRect();
        const fraction = (index + .5) / cards.length;
        return { x: center - Math.sin(fraction * Math.PI * 2) * sway, y: box.top - bounds.top + box.height / 2 };
      });
      const route = createRoutePath([{ x: center, y: 0 }, ...targets, { x: center, y: bounds.height - 38 }]);
      svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
      track.setAttribute("d", route);
      active.setAttribute("d", route);
      length = track.getTotalLength();
      nodes.forEach((node, index) => {
        node.style.left = `${targets[index].x}px`;
        node.style.top = `${targets[index].y}px`;
      });
      needsLayout = false;
    }

    function update() {
      frame = 0;
      if (!root) return;
      if (needsLayout) measure();
      const bounds = root.getBoundingClientRect();
      const still = paused || media.matches;
      const cursor = still ? Infinity : window.innerHeight * .62 - bounds.top;
      const state = getLineFrame(cursor, length, distance => track.getPointAtLength(distance));
      const reached = targets.filter(target => cursor >= target.y).length;
      const visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
      root.dataset.still = String(still);
      root.dataset.activeStep = String(reached);
      root.dataset.lineProgress = state.progress.toFixed(4);
      active.style.strokeDashoffset = String(1 - state.progress);
      active.style.opacity = state.progress > 0 ? "1" : "0";
      tip.hidden = still || state.progress <= 0 || state.progress >= 1 || !visible;
      tip.style.left = `${state.x}px`;
      tip.style.top = `${state.y}px`;
      nodes.forEach((node, index) => {
        node.classList.toggle("is-reached", index < reached);
        node.classList.toggle("is-current", index === reached - 1);
        cards[index].dataset.reached = String(index < reached);
        if (still || !visible || index >= reached) node.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
      });
      // A quick scroll emphasizes only the latest reached record.
      if (!still && visible && previousReached >= 0 && reached > previousReached) {
        nodes.forEach(node => node.getAnimations({ subtree: true }).forEach(animation => animation.cancel()));
        nodes[reached - 1].querySelectorAll(".journey-ripple").forEach((ring, index) => {
          ring.animate([
            { opacity: .6, transform: "translate(-50%, -50%) scale(.12)" },
            { opacity: .25, offset: .35 },
            { opacity: 0, transform: "translate(-50%, -50%) scale(1.2)" },
          ], { duration: 1600, delay: index * 180, easing: "cubic-bezier(.16,.6,.4,1)" });
        });
      }
      previousReached = reached;
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
      nodes.forEach(node => node.getAnimations({ subtree: true }).forEach(animation => animation.cancel()));
    };
  }, [paused]);

  return <div className="journey-timeline" ref={timeline}>
    <div className="journey-waterway" aria-hidden="true">
      <svg className="journey-route" preserveAspectRatio="none">
        <path className="journey-route-track" fill="none"/>
        <path className="journey-route-active" fill="none" pathLength="1"/>
      </svg>
      {milestones.map((milestone, index) => <span className="journey-light-node" key={milestone.id} data-step={index + 1}>
        <i className="journey-ripple"/><i className="journey-ripple"/>
        <span className="journey-node-core"/>
        <span className="journey-node-number">0{index + 1}</span>
      </span>)}
      <span className="journey-line-tip" hidden/>
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
