"use client";

import Image from "next/image";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Camera as Instagram, Pause, Play, X } from "lucide-react";
import { MotionConfig, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { journal, photographs, runway, type Photograph } from "@/lib/portfolio";
import { YouTubeBackground } from "@/components/youtube-background";
import { Accordion, AssetLoader, CounterMotion, GalleryColumns, ImagePassage, SlowPortrait } from "@/components/scroll-scenes";

const instagram = "https://www.instagram.com/ginalist.y/";
const whatsapp = "https://wa.me/6281461171726";
const navigation = [["Selected work", "#work"], ["Runway", "#runway"], ["About", "#about"], ["Journal", "#journal"]];

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 65 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.12 }}>{children}</motion.div>;
}

function CinematicHero({ paused }: { paused: boolean }) {
  const section = useRef<HTMLElement>(null);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const clipPath = useTransform(scrollYProgress, [0, 0.55, 1], ["inset(32% 8% 14% 8%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]);
  const portraitOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
  const filmScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  return <section className="hero" id="home" ref={section} aria-labelledby="hero-title">
    <div className="hero-screen">
      <motion.div className="hero-media" style={{ clipPath: paused ? "none" : clipPath }}>
        <motion.div className="hero-film" style={{ scale: paused ? 1 : filmScale }}><Image src="/assets/mountain-savanna-brown-shearling-coat-5.webp" alt="" fill sizes="100vw" preload /><YouTubeBackground id="6a-DS2j2F74" active={!paused && !manuallyPaused} onPlayingChange={setPlaying} /></motion.div>
        <motion.div className="hero-morph-photo" style={{ opacity: paused ? 0 : portraitOpacity }}><Image src="/assets/studio-burgundy-leather-blazer-rope-1.webp" alt="Gina in a burgundy leather blazer" fill sizes="100vw" preload /></motion.div>
        <motion.div className="hero-shade" style={{ opacity: paused ? 1 : titleOpacity }} />
      </motion.div>
      <motion.h1 id="hero-title" className="hero-title" style={{ opacity: paused ? 1 : titleOpacity, y: paused ? 0 : titleY }}><motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: paused ? 0 : 1.2 }}>Gina <em>Listya.</em></motion.span></motion.h1>
      <div className="hero-controls"><button onClick={() => setManuallyPaused(playing)} disabled={paused} aria-label={playing ? "Pause hero video" : "Play hero video"}>{playing ? <Pause size={18} /> : <Play size={18} />}</button><a href="#work" aria-label="Scroll to selected work"><ArrowDown size={25} /></a></div>
    </div>
  </section>;
}

function Runway({ paused }: { paused: boolean }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.32, 1], [0, -distance]);
  const photoScale = useTransform(scrollYProgress, [0, 0.17, 0.3], [0.55, 1.15, 1.35]);
  const photoOpacity = useTransform(scrollYProgress, [0, 0.15, 0.26], [1, 1, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.12, 0.2, 0.27, 0.34], [0, 1, 1, 0]);
  const titleScale = useTransform(scrollYProgress, [0.12, 0.34], [0.8, 1.15]);
  const galleryOpacity = useTransform(scrollYProgress, [0.29, 0.36], [0, 1]);
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const measure = () => setDistance(Math.max(0, element.scrollWidth - element.clientWidth));
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, []);
  return <section className="runway" id="runway" ref={section} aria-labelledby="runway-title">
    <div className="runway-sticky section-shell">
      {!paused && <motion.div className="runway-zoom" style={{ scale: photoScale, opacity: photoOpacity }}><Image src="/assets/runway-quilted-black-widebrim-2.webp" alt="Gina in a sculpted black runway look" fill sizes="100vw" /></motion.div>}
      <motion.h2 id="runway-title" className="runway-intro" style={{ opacity: paused ? 1 : titleOpacity, scale: paused ? 1 : titleScale }}><em>Runway.</em></motion.h2>
      <motion.div className="runway-track" ref={track} style={{ x: paused ? 0 : x, opacity: paused ? 1 : galleryOpacity }}>{runway.map((photo, index) => <motion.figure className="runway-frame" key={photo.file} initial={{ opacity: .15, y: index % 2 ? -90 : 90 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: .4 }} transition={{ duration: .8 }}><div className="runway-photo"><Image src={`/assets/${photo.file}`} alt={photo.alt} fill sizes="(max-width: 700px) 78vw, 35vw" /></div><figcaption>{photo.title}</figcaption></motion.figure>)}</motion.div>
    </div>
  </section>;
}

export default function Home() {
  const prefersReduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const paused = motionPaused || !!prefersReduced;
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Photograph | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const menuDestination = useRef<string | null>(null);
  const lightbox = useRef<HTMLDialogElement>(null);
  const { scrollYProgress, scrollY } = useScroll();
  const headerBackground = useTransform(scrollY, [0, 180], ["rgba(244, 243, 239, 1)", "rgba(244, 243, 239, 0.98)"]);
  const visible = photographs.filter((photo) => filter === "All" || photo.category === filter);
  useEffect(() => {
    if (!ready || !window.location.hash) return;
    const frame = requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "instant" }));
    return () => cancelAnimationFrame(frame);
  }, [ready]);

  function closeMenu() {
    setMenuOpen(false);
    menuToggle.current?.focus({ preventScroll: true });
  }

  function followMenuLink() {
    if (!menuDestination.current) return;
    const href = menuDestination.current;
    menuDestination.current = null;
    document.querySelector(href)?.scrollIntoView({ behavior: paused ? "instant" : "smooth" });
    window.history.replaceState(null, "", href);
  }

  useEffect(() => {
    if (!menuOpen && paused) followMenuLink();
  });

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 701px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  function openPhoto(photo: Photograph) {
    setSelected(photo);
    lightbox.current?.showModal();
  }

  function nextPhoto(direction: number) {
    if (!selected) return;
    const index = visible.findIndex((photo) => photo.file === selected.file);
    setSelected(visible[(index + direction + visible.length) % visible.length]);
  }

  return <MotionConfig reducedMotion={paused ? "always" : "user"} transition={{ duration: paused ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}>
    {!ready && <AssetLoader onComplete={() => setReady(true)} />}
    <div className="site" data-motion={paused ? "paused" : "active"} data-ready={ready} inert={!ready}>
      <a className="skip-link" href="#main">Skip to content</a>
      <motion.header className="site-header" style={{ backgroundColor: headerBackground }} onKeyDown={(event) => { if (event.key === "Escape" && menuOpen) closeMenu(); }}>
        <div className="header-row">
        <a href="#home" className="wordmark" aria-label="Gina Listya home">ginalist<span>.</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
        <a className="booking-link" href={whatsapp} target="_blank" rel="noopener noreferrer">Let’s collaborate <ArrowUpRight size={17} /></a>
        <button ref={menuToggle} className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-navigation">{menuOpen ? "Close" : "Menu"} <span>{menuOpen ? "−" : "+"}</span></button>
        </div>
        <div className="navigation-sheet" data-open={menuOpen} inert={!menuOpen} onTransitionEnd={(event) => { if (event.target === event.currentTarget && !menuOpen) followMenuLink(); }}>
          <div className="navigation-clip">
            <div className="navigation-panel" id="mobile-navigation">
              <nav aria-label="Mobile navigation">{navigation.map(([label, href], index) => <a key={href} href={href} onClick={(event) => { event.preventDefault(); menuDestination.current = href; closeMenu(); }}><span>0{index + 1}</span>{label}<ArrowUpRight /></a>)}</nav>
              <a className="text-link" href={whatsapp} target="_blank" rel="noopener noreferrer">Contact on WhatsApp <ArrowUpRight size={18} /></a>
              <a className="menu-instagram" href={instagram} target="_blank" rel="noopener noreferrer">Instagram / @ginalist.y</a>
            </div>
          </div>
        </div>
        <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      </motion.header>

      <main id="main">
        {ready && <CinematicHero paused={paused} />}

        <section className="work section-shell" id="work" aria-labelledby="work-title">
          <Reveal className="section-heading"><h2 id="work-title">Selected <em>work.</em></h2></Reveal>
          <Reveal><div className="work-filters" role="group" aria-label="Filter photographs">{["All", "Editorial", "Beauty", "Campaign", "Runway"].map((category) => <motion.button whileHover={{ y: -3 }} whileTap={{ scale: .95 }} key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}{filter === category && <motion.span layoutId="filter-dot" className="filter-dot" />}</motion.button>)}<span>{String(visible.length).padStart(2, "0")} photographs</span></div></Reveal>
          {ready && <GalleryColumns key={filter} photos={visible} paused={paused} onSelect={openPhoto} />}
        </section>

        <ImagePassage paused={paused} />
        <CounterMotion paused={paused} />
        <Runway paused={paused} />

        <section className="about section-shell" id="about" aria-labelledby="about-title">
          <div className="about-photo"><SlowPortrait paused={paused} /></div>
          <div className="about-copy"><Reveal><h2 id="about-title">Gina Listya<br /><em>Nuraini.</em></h2></Reveal><Reveal><p>Fashion model from Garut, West Java. Runway, editorial, and campaigns since 2023.</p><a href="/Ginalist.pdf" target="_blank" rel="noopener noreferrer" className="text-link">View profile <ArrowUpRight size={18} /></a></Reveal><Reveal><Accordion title="Runway experience"><p>Indonesia Fashion Week · IN2MF · Jakarta Muslim Fashion Week · Solo Fashion Week · Spotlight Cultural Fashion</p></Accordion><Accordion title="Collaborations"><p>Deden Siswanto · Astiga · Viera Sutra Alam · Boolao · Islamic Fashion Institute · Karya Kreatif Jawa Barat · Hanoon · Dianable · Realegacy · Choize · WeWalk</p></Accordion><Accordion title="Achievements"><p>2025 · Mojang Harapan 2 Jawa Barat<br />2023 · Finalist, Putri Otonomi Indonesia<br />2023 · Putri Otonomi Daerah Kabupaten Garut<br />2022 · Mojang Calakan Kabupaten Garut</p></Accordion></Reveal></div>
        </section>

        <section className="journal section-shell" id="journal" aria-labelledby="journal-title">
          <Reveal className="section-heading"><h2 id="journal-title">In <em>motion.</em></h2><a className="text-link" href={instagram} target="_blank" rel="noopener noreferrer">@ginalist.y <ArrowUpRight size={18} /></a></Reveal>
          {journal.length > 0 ? <div className="journal-grid">{journal.map((entry) => <motion.article key={entry.title} className="journal-entry" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>{entry.kind === "video" ? <video controls playsInline preload="none" poster={`/assets/${entry.poster}`}><source src={`/assets/${entry.file}`} /></video> : entry.kind === "youtube" && activeVideo === entry.id ? <iframe src={`https://www.youtube-nocookie.com/embed/${entry.id}?autoplay=1`} title={entry.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : entry.kind === "youtube" ? <button className="journal-preview" onClick={() => setActiveVideo(entry.id)} aria-label={`Play ${entry.title}`}><Image src={`/assets/${entry.poster}`} alt="" fill sizes="(max-width: 700px) 90vw, 45vw" /><span><Play /> Watch film</span></button> : <a className="journal-preview" href={`https://www.instagram.com/p/${entry.id}/`} target="_blank" rel="noopener noreferrer"><Image src={`/assets/${entry.poster}`} alt={entry.title} fill sizes="(max-width: 700px) 90vw, 45vw" /><span><Instagram /> View on Instagram <ArrowUpRight /></span></a>}</motion.article>)}</div> : <a className="text-link" href={instagram} target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={18} /></a>}
        </section>

        <footer className="contact section-shell" id="contact"><Reveal><a className="contact-title" href={whatsapp} target="_blank" rel="noopener noreferrer">Let’s <em>work.</em><ArrowUpRight aria-hidden="true" /></a><div className="contact-links"><a className="text-link" href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp / +62 814-6117-1726 <ArrowUpRight size={18} /></a><a className="text-link" href={instagram} target="_blank" rel="noopener noreferrer">Instagram / @ginalist.y <ArrowUpRight size={18} /></a></div></Reveal><div className="footer-bottom"><span>© {new Date().getFullYear()} Gina Listya Nuraini</span><span>Garut, West Java · Indonesia</span><button onClick={() => setMotionPaused(!motionPaused)} aria-pressed={motionPaused} disabled={!!prefersReduced}>{paused ? <Play size={13} /> : <Pause size={13} />}{prefersReduced ? "Reduced motion" : motionPaused ? "Resume motion" : "Pause motion"}</button><a href="#home">Back to top ↑</a></div></footer>
      </main>

      <dialog ref={lightbox} className="lightbox" aria-label={selected ? selected.title : "Photograph viewer"} onKeyDown={(event) => { if (event.key === "ArrowRight") nextPhoto(1); if (event.key === "ArrowLeft") nextPhoto(-1); }} onClose={() => setSelected(null)}><button className="icon-button lightbox-close" aria-label="Close photograph" onClick={() => lightbox.current?.close()}><X /></button>{selected && <><div className="lightbox-photo"><Image src={`/assets/${selected.file}`} alt={selected.alt} fill sizes="100vw" /></div><div className="lightbox-bottom"><button className="icon-button" aria-label="Previous photograph" onClick={() => nextPhoto(-1)}><ArrowLeft /></button><p>{selected.title}<span>{selected.category}</span></p><button className="icon-button" aria-label="Next photograph" onClick={() => nextPhoto(1)}><ArrowRight /></button></div></>}</dialog>
    </div>
  </MotionConfig>;
}
