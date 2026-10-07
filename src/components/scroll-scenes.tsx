"use client";

import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motionPhotographs, preloadFiles, type Photograph } from "@/lib/portfolio";

export function AssetLoader({ onComplete }: { onComplete: () => void }) {
  const [loaded, setLoaded] = useState(0);
  const [failed, setFailed] = useState(0);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    let disposed = false;
    let cursor = 0;
    let completed = 0;
    let failures = 0;
    const download = async () => {
      while (!disposed && cursor < preloadFiles.length) {
        const file = preloadFiles[cursor++];
        try {
          await new Promise<void>((resolve, reject) => {
            const image = new window.Image();
            const timeout = window.setTimeout(() => { image.src = ""; reject(new Error(file)); }, 20000);
            image.onload = () => { window.clearTimeout(timeout); void image.decode().then(resolve, reject); };
            image.onerror = () => { window.clearTimeout(timeout); reject(new Error(file)); };
            image.src = `/assets/${file}`;
          });
        } catch { failures++; }
        if (!disposed) { setLoaded(++completed); setFailed(failures); }
      }
    };
    void Promise.all(Array.from({ length: 6 }, download)).then(() => {
      if (!disposed && failures === 0) setFinished(true);
    });
    return () => { disposed = true; };
  }, []);
  const progress = loaded / preloadFiles.length;
  return <motion.div className="asset-loader" role="status" aria-live="polite" animate={finished ? { y: "-100%" } : { y: 0 }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }} onAnimationComplete={() => { if (finished) onComplete(); }}>
    <div className="loader-wordmark">ginalist.</div>
    <div className="loader-images" aria-hidden="true">{["studio-minimalist-black-blazer-1.webp", "beauty-jewelry-gold-rings-2.webp", "backstage-glamour-silver-gown-bw-2.webp"].map((file, index) => <motion.div key={file} initial={{ y: 100, rotate: index * 6 - 6 }} animate={{ y: 0, rotate: index * 6 - 6 }} transition={{ delay: index * .12, duration: .8 }}><Image src={`/assets/${file}`} alt="" fill sizes="25vw" /></motion.div>)}</div>
    <div className="loader-bottom"><span>{loaded === preloadFiles.length ? "Ready to enter" : "Collecting the frames"}</span><span className="loader-count">{Math.floor(progress * 100).toString().padStart(2, "0")}<small>%</small></span></div>
    <motion.div className="loader-progress" style={{ scaleX: progress }} />
    {failed > 0 && loaded === preloadFiles.length && <div className="loader-error">{failed} photos could not load. <button onClick={() => window.location.reload()}>Retry</button><button onClick={() => setFinished(true)}>Continue with available photos</button></div>}
  </motion.div>;
}

export function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = title.toLowerCase().replaceAll(" ", "-");
  return <div className="accordion"><button aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{title}<motion.span animate={{ rotate: open ? 45 : 0 }}>+</motion.span></button><AnimatePresence initial={false}>{open && <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .45 }} className="accordion-content">{children}</motion.div>}</AnimatePresence></div>;
}

export function GalleryColumns({ photos, paused, onSelect }: { photos: Photograph[]; paused: boolean; onSelect: (photo: Photograph) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(3);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setColumns(query.matches ? 2 : 3);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return <div ref={ref} className="gallery-columns" style={{ height: paused ? "auto" : `${Math.ceil(photos.length / columns) * 65 + 100}svh` }}><div className="gallery-window">{Array.from({ length: columns }, (_, column) => <GalleryColumn key={column} column={column} progress={scrollYProgress} photos={photos.filter((_, index) => index % columns === column)} paused={paused} onSelect={onSelect} />)}</div></div>;
}

function GalleryColumn({ column, progress, photos, paused, onSelect }: { column: number; progress: MotionValue<number>; photos: Photograph[]; paused: boolean; onSelect: (photo: Photograph) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setDistance(Math.max(0, element.scrollHeight - (element.parentElement?.clientHeight ?? 0) + 130));
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (element.parentElement) observer.observe(element.parentElement);
    measure();
    return () => observer.disconnect();
  }, [photos.length]);
  const y = useTransform(progress, [0, .5, 1], column === 1 ? [-distance, -distance * .5, 0] : column === 2 ? [0, -distance * .68, -distance] : [0, -distance * .38, -distance]);
  return <motion.div ref={ref} className={`gallery-column column-${column}`} style={{ y: paused ? 0 : y }}>{photos.map(photo => <motion.figure key={photo.file} initial={{ opacity: .8, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .55 }}><button onClick={() => onSelect(photo)} aria-label={`View ${photo.title}`}><Image src={`/assets/${photo.file}`} alt={photo.alt} fill sizes="(max-width: 700px) 42vw, 33vw" /></button><figcaption>{photo.category}</figcaption></motion.figure>)}</motion.div>;
}

export function ImagePassage({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return <section ref={ref} className="image-passage" aria-label="Backstage photographs"><div className="passage-sticky"><motion.div className="passage-background" style={{ y: paused ? 0 : y }}><Image src="/assets/backstage-glamour-silver-gown-bw-2.webp" alt="Gina backstage in a silver evening gown" fill sizes="100vw" /></motion.div></div><div className="passage-topper"><motion.span initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}>Between<br /><em>the frames.</em></motion.span></div></section>;
}

export function CounterMotion({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const forward = useTransform(scrollYProgress, [0, 1], ["0%", "-58%"]);
  const reverse = useTransform(scrollYProgress, [0, 1], ["-58%", "0%"]);
  const files = motionPhotographs;
  return <section className="counter-motion" ref={ref} aria-label="Editorial in motion"><div className="counter-sticky">{[0, 1, 2].map(column => <motion.div className={`counter-column counter-${column}`} key={column} style={{ y: paused ? 0 : column === 1 ? reverse : forward }}>{files.filter((_, index) => index % 3 === column).map(asset => <div className="counter-photo" key={asset.file}><Image src={`/assets/${asset.file}`} alt={asset.alt} fill sizes="(max-width: 700px) 42vw, 38vw" /></div>)}</motion.div>)}</div></section>;
}

export function SlowPortrait({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-90, 90]);
  return <div ref={ref} className="slow-portrait"><motion.div style={{ y: paused ? 0 : y }}><Image src="/assets/studio-lookbook-asymmetric-blazer-suit-1.webp" alt="Gina in a sculptural two-tone blazer and white trousers" fill sizes="(max-width: 700px) 90vw, 50vw" /></motion.div></div>;
}
