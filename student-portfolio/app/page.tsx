"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Check, GitBranch, MessageSquare, Pause, Play, X } from "lucide-react";
import { JourneyTimeline } from "../components/journey-timeline";
import { HeroLightLine } from "../components/hero-light-line";
import { projects, profile, type Story } from "../content/portfolio";

function JourneyArt({ paused }: { paused: boolean }) {
  return <div className="journey-art" role="img" aria-label="光の線でつながる、学びと制作の記録">
    <div className="art-heading"><span>MOMENTS CONNECTED</span><span>2026 —</span></div>
    <span className="art-year" aria-hidden="true">2026</span>
    <span className="art-caption">学びが、次の景色につながる。</span>
    <div className="art-waterline" aria-hidden="true"/>
    <HeroLightLine paused={paused}/>
    <span className="art-destination">THE NEXT CHAPTER</span>
    <div className="art-foot"><span className="tiny-dot"/>学びの、その先へ。<span>STILL EXPLORING ↗</span></div>
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
    return () => observer.disconnect();
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
      <section id="top" className="hero wrap"><div className="ambient-lights" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i} style={{"--left":`${7+i*8}%`,"--duration":`${9+i%4*2}s`,"--delay":`${-i*1.7}s`} as CSSProperties}/>)}</div><div className="hero-copy"><p className="eyebrow"><span className="status-dot"/>LEARNING, MAKING, MOVING FORWARD.</p><span className="hero-title-en">THE JOURNEY</span><h1>学びを、<br/>日常を変える<span className="blue-text">力に。</span></h1><p className="hero-description">学んだことを活かして、<br/>身の回りの不便を解決していきたい。</p><p className="hero-profile"><b>{profile.name}</b><span>{profile.affiliation}</span></p><a className="primary-button" href="#journey">これまでの軌跡をたどる <ArrowDownRight size={18}/></a></div><JourneyArt paused={motionOff}/><div className="hero-bottom"><span>A RECORD OF SMALL STEPS.</span><span>2026年4月から、学びと制作の記録。</span><a href="#journey" aria-label="軌跡へスクロール"><ArrowDown size={17}/> SCROLL</a></div></section>
      <nav className="chapter-nav" aria-label="ポートフォリオの章"><a href="#journey"><b aria-hidden="true" data-chapter="01">01</b><strong>JOURNEY</strong><small>学びの軌跡</small></a><a href="#works"><b aria-hidden="true" data-chapter="02">02</b><strong>CREATIONS</strong><small>生まれた作品</small></a><a href="#about"><b aria-hidden="true" data-chapter="03">03</b><strong>ABOUT</strong><small>私について</small></a></nav><section id="journey" className="journey-section section wrap"><div className="journey-intro"><p className="eyebrow section-label">01 / MY JOURNEY</p><h2>歩いてきた日々が、<br/><span className="blue-text">未来へ、広がっていく。</span></h2><p className="section-description">はじめて学んだこと。<br/>つくり始めたもの。つくり直したもの。<br/>その一歩ずつを、ここに残していきます。</p><div className="year-marker">2026<span>THE BEGINNING</span></div><p className="journey-water-note"><ArrowDown size={15}/>スクロールで光がつながる。ひとつずつ、学びの記録へ。</p><p className="interaction-hint"><span className="hint-line"/>節目を選ぶと、詳しい記録が開きます。</p></div><JourneyTimeline paused={motionOff} onSelect={setStory}/></section>
      <section id="works" className="works-section section wrap"><div className="section-heading"><div><p className="eyebrow section-label">02 / SELECTED WORKS</p><h2>身近な「不便」から、<br/>つくり始める。</h2></div><p className="section-description">使う人の視点から考え、学びながら形に。<br/>現在取り組んでいる、2つの開発作品です。</p></div><div className="works-grid">{projects.map((project,i)=><article className="project" data-reveal key={project.id}><button className="visual-button" onClick={()=>setStory(project)} aria-label={`${project.title}の詳細を見る`}><ProjectVisual kind={project.id==="connect"?"connect":"moocs"}/></button><div className="project-meta"><span>0{i+1} / {project.category}</span><span className="project-status"><span/>{project.status}</span></div><button className="project-title" onClick={()=>setStory(project)}><h3>{project.title}</h3><ArrowUpRight size={24}/></button><p className="project-summary">{project.summary}</p><div className="tags">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div><button className="text-link" onClick={()=>setStory(project)}>制作の背景と取り組み <ArrowRight size={15}/></button></article>)}</div></section>
      <section id="about" className="about-section"><div className="wrap about-grid"><div><p className="eyebrow section-label">03 / ABOUT ME</p><h2>つくることで、<br/>学びを自分のものに。</h2><div className="profile-block"><span className="profile-monogram" aria-hidden="true">m<span>.</span></span><div><h3>{profile.name} <span>masa</span></h3><p>{profile.affiliation}</p></div></div></div><div className="about-copy"><p>2026年4月、プログラミングの学習を始めました。<br/>授業で習った技術を活かしたいと思い、<br className="desktop-break"/>同年6月ごろから、自分の手で制作を始めています。</p><p>学年間のつながり、毎日の課題管理。<br/>大学生活の中で感じた不便が、ものづくりの出発点です。<br/>試して、学んで、また改善する。その過程も残していきます。</p><div className="interests"><span className="eyebrow">EXPLORING</span><p>プログラミング・アプリ開発 <span>/</span> デザイン <span>/</span> 写真・動画</p><small>今は開発作品を中心に。これから、表現の幅も広げていきます。</small></div></div></div></section>
      <section className="next-section section wrap"><div><p className="eyebrow section-label">THE NEXT CHAPTER</p><h2>軌跡は、<span className="blue-text">ここからも。</span></h2><p>新しい学びも、小さな改善も。<br/>次の一歩を、またここに書き足していきます。</p></div><a className="github-link" href={profile.github} target="_blank" rel="noreferrer"><span><GitBranch size={21}/>GitHubで制作をたどる<small>Masahiro-Kamimura-04</small></span><ArrowUpRight size={24}/></a></section>
    </main>
    <button className="motion-toggle" aria-pressed={motionOff} onClick={()=>setMotionOff(!motionOff)}>{motionOff?<Play size={13}/>:<Pause size={13}/>}動き{motionOff?"を再生":"を止める"}</button>
    <footer className="footer wrap"><a className="brand" href="#top">masa<span>.</span></a><span>© 2026 masa · 学びと制作の記録</span><button className="motion-control" aria-pressed={motionOff} onClick={()=>setMotionOff(!motionOff)}>{motionOff?<Play size={13}/>:<Pause size={13}/>}アニメーション{motionOff?"を再生":"を停止"}</button><a href="#top" className="back-top">TOP ↑</a></footer>
    <dialog ref={dialog} className="story-dialog" onClose={()=>setStory(null)} onClick={event=>{if(event.target===event.currentTarget)closeStory();}} aria-labelledby="story-title">{story&&<div className="story-inner"><div className="story-top"><p className="eyebrow">{story.kicker}</p><button className="dialog-close" onClick={closeStory} aria-label="詳細を閉じる"><X size={22}/></button></div><h2 id="story-title">{story.title}</h2><p className="story-lead">{story.lead}</p>{story.sections.map(section=><section className="story-section" key={section.heading}><h3>{section.heading}</h3><p>{section.body}</p></section>)}{story.tech&&<section className="story-section"><h3>使っている技術</h3><div className="tags">{story.tech.map(tech=><span key={tech}>{tech}</span>)}</div></section>}<button className="story-back" onClick={closeStory}>軌跡に戻る <ArrowRight size={16}/></button></div>}</dialog>
  </div>;
}
