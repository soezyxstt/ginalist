import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { photographs, runway, journal, preloadFiles } from "../src/lib/portfolio.ts";

const root = new URL("../", import.meta.url);
const catalog = await readFile(new URL("public/catalog.md", root), "utf8");
const page = await readFile(new URL("src/app/page.tsx", root), "utf8");
const styles = await readFile(new URL("src/app/globals.css", root), "utf8");
const scenes = await readFile(new URL("src/components/scroll-scenes.tsx", root), "utf8");
assert(scenes.includes('column === 1 ? [-distance, -distance * .5, 0]'), "The middle gallery column must move downward during downward page scroll");
assert(scenes.includes('-distance * .68') && scenes.includes('-distance * .38'), "Outer gallery columns must have different scroll speeds");
assert(scenes.includes('image.decode()') && scenes.includes('Promise.all(Array.from({ length: 6 }, download))'), "Loader must download and decode actual page images before entry");
const runwayComponent = page.slice(page.indexOf("function Runway("), page.indexOf("export default function Home"));
assert(runwayComponent.includes('useScroll({ target: section, offset: ["start start", "end end"] })'), "Runway must follow vertical page scroll");
assert(runwayComponent.includes('useTransform(scrollYProgress, [0, 1], [0, -distance])'), "Runway must move horizontally after its intro");
assert(runwayComponent.includes('setTimeout(() => setIntro("photos"), 2900)'), "Runway title must hold for two seconds after its 900ms fade");
assert(runwayComponent.includes('bounds.top > 120 && introStarted.current') && runwayComponent.includes('setIntro("waiting")'), "Runway intro must rearm after scrolling back above the section");
assert(!/photoOpacity|titleOpacity|galleryOpacity/.test(runwayComponent), "Runway intro must complete independently of scroll progress");
assert(!/onWheel|scrollLeft|<button/.test(runwayComponent), "Runway must not become a controlled carousel");
assert(/\.runway-sticky\s*\{[^}]*position: sticky/.test(styles), "Runway viewport must stay pinned");
assert(journal.some(entry => entry.kind === "youtube" && entry.id === "6a-DS2j2F74"), "Supplied YouTube video missing");
const selectedFiles = photographs.map(({ file }) => file);
assert.equal(new Set(selectedFiles.map(file => file.replace(/-\d+\.webp$/, ""))).size, selectedFiles.length, "Near-duplicate looks in the gallery");
assert(photographs.length >= 35, "Gallery should use at least 35 distinct client compositions");
for (const photo of [...photographs, ...runway]) assert(preloadFiles.includes(photo.file), `Photo not preloaded: ${photo.file}`);
const files = preloadFiles;
for (const file of files) {
  assert(catalog.includes(file), `${file} is absent from the client catalog`);
  await access(new URL(`public/assets/${file}`, root));
}
for (const entry of journal) {
  await access(new URL(`public/assets/${entry.poster}`, root));
  if (entry.kind === "video") await access(new URL(`public/assets/${entry.file}`, root));
  else assert(/^[\w-]+$/.test(entry.id), "Use a post shortcode or video ID, not a URL");
}
const origin = process.argv[2] || "http://127.0.0.1:3000";
const response = await fetch(origin);
assert(response.ok, `Preview returned ${response.status}`);
const html = await response.text();
assert(html.includes("Gina Listya Nuraini"), "Client identity missing");
assert(!/kristina|smolyar|\/sites\//i.test(html), "Cloned identity or media remains");
const externalLinks = [...html.matchAll(/<a\b[^>]*href="(https?:[^\"]+)"/g)].map((match) => match[1]);
assert(externalLinks.length > 0, "Contact links missing");
for (const link of externalLinks) assert(link === "https://wa.me/6281461171726" || /^https:\/\/www\.instagram\.com\/(gnalist\.y\/|p\/[\w-]+\/)$/.test(link), `Unexpected social/contact link: ${link}`);
assert(html.includes('id="journal"'), "Future media section missing");
assert.equal((await fetch(`${origin}/Ginalist.pdf`)).status, 200, "Profile PDF unavailable");
console.log(`Passed: ${files.length} client photographs, journal media, identity, Instagram, WhatsApp, and profile PDF.`);
