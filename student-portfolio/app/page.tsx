"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Check, Code2, GitBranch, MessageSquare, Pause, Play, X } from "lucide-react";
import { milestones, projects, profile, type Story } from "../content/portfolio";

function JourneyArt() {
  return <div className="journey-art" aria-label="2026年4月の学習開始、6月の制作開始、10月の改善と新しい挑戦をつなぐ軌跡">
    <div className="art-heading"><span>THE PATH SO FAR</span><span>2026 —</span></div>
    <span className="art-year" aria-hidden="true">2026</span>
    <svg className="path-art" viewBox="0 0 540 430" fill="none" aria-hidden="true">
      <defs><linearGradient id="path-color" x1="65" y1="365" x2="455" y2="70" gradientUnits="userSpaceOnUse"><stop stopColor="#2d4dd4"/><stop offset="1" stopColor="#76b9ff"/></linearGradient></defs>
      <path className="art-track" d="M64 350H154Q184 350 184 320V267Q184 239 214 239H286Q316 239 316 209V148Q316 118 346 118H446Q476 118 476 88V55"/>
      <path className="art-path" pathLength="1" d="M64 350H154Q184 350 184 320V267Q184 239 214 239H286Q316 239 316 209V148Q316 118 346 118H446Q476 118 476 88V55" stroke="url(#path-color)"/>
      <g className="art-node"><circle cx="88" cy="350" r="7"/><circle cx="235" cy="239" r="7"/><circle cx="373" cy="118" r="7"/></g>
      <circle className="art-pulse" cx="476" cy="55" r="15"/><circle cx="476" cy="55" r="5" fill="#b1d6ff"/>
      <g className="art-label"><text x="70" y="312">04</text><text x="217" y="201">06</text><text x="355" y="80">10</text></g>
      <g className="art-small"><text x="70" y="387">LEARN</text><text x="217" y="277">BUILD</text><text x="355" y="156">REFINE + CONNECT</text></g>
      <path d="m470 61 6-6 6 6" stroke="#b1d6ff" strokeWidth="1.5"/>
    </svg>
    <div className="art-foot"><span className="tiny-dot"/>一歩ずつ、つながっていく。<span>STILL EXPLORING ↗</span></div>
  </div>;
}

function ProjectVisual({ kind }: { kind: "connect" | "moocs" }) {
  return <div className={`project-visual ${kind}`} aria-hidden="true">
    {kind === "connect" ? <div className="connect-diagram">
      <div className="diagram-person person-one">1年</div><div className="diagram-person person-two">2年</div><div className="diagram-person person-three">3年</div><div className="diagram-person person-four">4年</div>
      <svg viewBox="0 0 440 230" preserveAspectRatio="none"><path d="M70 50 220 115 370 50M70 182 220 115 370 182"/></svg>
      <div className="connect-center"><MessageSquare size={24}/><b>INIAD<span>CONNECT</span></b></div>
      <span className="diagram-note">学年を越えて、つながる。</span>
    </div> : <div className="moocs-diagram">
      <div className="moocs-top"><span className="mini-logo"><Check size={14}/></span><b>MOOCs Check</b><span>課題を、ひとつの場所に。</span></div>
      <div className="moocs-body"><div className="mini-calendar"><div className="calendar-title"><span>CALENDAR</span><span>←　→</span></div><div className="calendar-days">{["M","T","W","T","F","S","S"].map((d,i)=><span key={i}>{d}</span>)}{Array.from({length:21},(_,i)=><i className={[3,8,10,16].includes(i)?"has-task":""} key={i}>{i+1}</i>)}</div></div><div className="mini-list"><p>課題管理</p><div><span className="mini-check"><Check size={11}/></span>提出状況の確認</div><div><span className="mini-check"><Check size={11}/></span>クリック履歴の保存</div><div><span className="mini-check empty"/>課題の登録・整理</div><span className="mini-list-foot">予定も、履歴も、見渡せる。</span></div></div>
    </div>}
    <span className="visual-label">機能イメージ · 実画面は準備中</span>
  </div>;
}

export default function Home() {
  const dialog = useRef<HTMLDialogElement>(null);
  const timeline = useRef<HTMLDivElement>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [motionOff, setMotionOff] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotionOff(media.matches);
    const update = () => setMotionOff(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.setAttribute("data-visible", "true"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach(node => observer.observe(node));
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const element = timeline.current;
        if (!element) return;
        const bounds = element.getBoundingClientRect();
        const progress = motionOff ? 1 : Math.min(1, Math.max(0, (window.innerHeight * .72 - bounds.top) / bounds.height));
        element.style.setProperty("--journey-progress", String(progress));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [motionOff]);

  useEffect(() => {
    if (!story) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [story]);

  function closeStory() { dialog.current?.close(); setStory(null); }

  return <div className={`site ${motionOff ? "motion-off" : "motion-on"}`}>
    <a className="skip-link" href="#main">本文へ移動</a>
    <header className="header wrap"><a className="brand" href="#top" aria-label="まさのポートフォリオ・トップへ">masa<span>.</span><small>PORTFOLIO</small></a><nav aria-label="メインナビゲーション"><a href="#journey">軌跡<span>Journey</span></a><a href="#works">作品<span>Works</span></a><a href="#about">私について<span>About</span></a></nav><a className="github-header" href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15}/></a></header>
    <main id="main">
      <section id="top" className="hero wrap"><div className="ambient-lights" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i} style={{"--left":`${7+i*8}%`,"--duration":`${9+i%4*2}s`,"--delay":`${-i*1.7}s`} as CSSProperties}/>)}</div><div className="hero-copy"><p className="eyebrow"><span className="status-dot"/>LEARNING, MAKING, MOVING FORWARD.</p><h1>学びを、<br/>日常を変える<span className="blue-text">力に。</span></h1><p className="hero-description">学んだことを活かして、<br/>身の回りの不便を解決していきたい。</p><p className="hero-profile"><b>{profile.name}</b><span>{profile.affiliation}</span></p><a className="primary-button" href="#journey">これまでの軌跡をたどる <ArrowDownRight size={18}/></a></div><JourneyArt/><div className="hero-bottom"><span>A RECORD OF SMALL STEPS.</span><span>2026年4月から、学びと制作の記録。</span><a href="#journey" aria-label="軌跡へスクロール"><ArrowDown size={17}/> SCROLL</a></div></section>
      <nav className="chapter-nav" aria-label="ポートフォリオの章"><a href="#journey"><b>01</b><strong>JOURNEY</strong><small>学びの軌跡</small></a><a href="#works"><b>02</b><strong>CREATIONS</strong><small>生まれた作品</small></a><a href="#about"><b>03</b><strong>ABOUT</strong><small>私について</small></a></nav><section id="journey" className="journey-section section wrap"><div className="journey-intro"><p className="eyebrow section-label">01 / MY JOURNEY</p><h2>点だった学びが、<br/><span className="blue-text">線になっていく。</span></h2><p className="section-description">はじめて学んだこと。<br/>つくり始めたもの。つくり直したもの。<br/>その一歩ずつを、ここに残していきます。</p><div className="year-marker">2026<span>THE BEGINNING</span></div><p className="interaction-hint"><span className="hint-line"/>節目を選ぶと、詳しい記録が開きます。</p></div><div className="timeline" ref={timeline}><div className="timeline-track" aria-hidden="true"><div/></div>{milestones.map((milestone,i)=><article className="milestone" key={milestone.id} data-reveal><span className="timeline-node" aria-hidden="true"/><div className="milestone-date"><time dateTime={milestone.date}>{milestone.displayDate}</time><span>{milestone.category}</span></div><button className="milestone-button" onClick={()=>setStory(milestone)} aria-label={`${milestone.displayDate} ${milestone.title}の詳細を読む`}><div className="milestone-heading"><span className="milestone-icon">{i===0?<BookOpen size={18}/>:i===3?<GitBranch size={18}/>:<Code2 size={18}/>}</span><ArrowUpRight className="milestone-arrow" size={20}/></div><h3>{milestone.title}</h3><p>{milestone.summary}</p><span className="read-story">{milestone.category === "LEARNING" || milestone.note ? "学びの記録" : "制作の記録"}<ArrowRight size={14}/></span></button>{milestone.note&&<aside className="small-note"><span>↳ 学びのメモ</span><p>{milestone.note}</p></aside>}</article>)}<div className="timeline-continuation"><span/>この先も、少しずつ。</div></div></section>
      <section id="works" className="works-section section wrap"><div className="section-heading"><div><p className="eyebrow section-label">02 / SELECTED WORKS</p><h2>身近な「不便」から、<br/>つくり始める。</h2></div><p className="section-description">使う人の視点から考え、学びながら形に。<br/>現在取り組んでいる、2つの開発作品です。</p></div><div className="works-grid">{projects.map((project,i)=><article className="project" data-reveal key={project.id}><button className="visual-button" onClick={()=>setStory(project)} aria-label={`${project.title}の詳細を見る`}><ProjectVisual kind={project.id==="connect"?"connect":"moocs"}/></button><div className="project-meta"><span>0{i+1} / {project.category}</span><span className="project-status"><span/>{project.status}</span></div><button className="project-title" onClick={()=>setStory(project)}><h3>{project.title}</h3><ArrowUpRight size={24}/></button><p className="project-summary">{project.summary}</p><div className="tags">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div><button className="text-link" onClick={()=>setStory(project)}>制作の背景と取り組み <ArrowRight size={15}/></button></article>)}</div></section>
      <section id="about" className="about-section"><div className="wrap about-grid"><div><p className="eyebrow section-label">03 / ABOUT ME</p><h2>つくることで、<br/>学びを自分のものに。</h2><div className="profile-block"><span className="profile-monogram" aria-hidden="true">m<span>.</span></span><div><h3>{profile.name} <span>masa</span></h3><p>{profile.affiliation}</p></div></div></div><div className="about-copy"><p>2026年4月、プログラミングの学習を始めました。<br/>授業で習った技術を活かしたいと思い、<br className="desktop-break"/>同年6月ごろから、自分の手で制作を始めています。</p><p>学年間のつながり、毎日の課題管理。<br/>大学生活の中で感じた不便が、ものづくりの出発点です。<br/>試して、学んで、また改善する。その過程も残していきます。</p><div className="interests"><span className="eyebrow">EXPLORING</span><p>プログラミング・アプリ開発 <span>/</span> デザイン <span>/</span> 写真・動画</p><small>今は開発作品を中心に。これから、表現の幅も広げていきます。</small></div></div></div></section>
      <section className="next-section section wrap"><div><p className="eyebrow section-label">THE NEXT CHAPTER</p><h2>軌跡は、<span className="blue-text">ここからも。</span></h2><p>新しい学びも、小さな改善も。<br/>次の一歩を、またここに書き足していきます。</p></div><a className="github-link" href={profile.github} target="_blank" rel="noreferrer"><span><GitBranch size={21}/>GitHubで制作をたどる<small>Masahiro-Kamimura-04</small></span><ArrowUpRight size={24}/></a></section>
    </main>
    <footer className="footer wrap"><a className="brand" href="#top">masa<span>.</span></a><span>© 2026 masa · 学びと制作の記録</span><button className="motion-control" aria-pressed={motionOff} onClick={()=>setMotionOff(!motionOff)}>{motionOff?<Play size={13}/>:<Pause size={13}/>}アニメーション{motionOff?"を再生":"を停止"}</button><a href="#top" className="back-top">TOP ↑</a></footer>
    <dialog ref={dialog} className="story-dialog" onClose={()=>setStory(null)} onClick={event=>{if(event.target===event.currentTarget)closeStory();}} aria-labelledby="story-title">{story&&<div className="story-inner"><div className="story-top"><p className="eyebrow">{story.kicker}</p><button className="dialog-close" onClick={closeStory} aria-label="詳細を閉じる"><X size={22}/></button></div><h2 id="story-title">{story.title}</h2><p className="story-lead">{story.lead}</p>{story.sections.map(section=><section className="story-section" key={section.heading}><h3>{section.heading}</h3><p>{section.body}</p></section>)}{story.tech&&<section className="story-section"><h3>使っている技術</h3><div className="tags">{story.tech.map(tech=><span key={tech}>{tech}</span>)}</div></section>}<button className="story-back" onClick={closeStory}>軌跡に戻る <ArrowRight size={16}/></button></div>}</dialog>
  </div>;
}
