import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
assert(!page.includes('className="navigation-dialog"'), "Navigation must not use a modal overlay");
assert(page.includes('aria-expanded={menuOpen}') && page.includes('inert={!menuOpen}'), "Collapsed links must be inaccessible");
assert(page.indexOf('className="navigation-sheet"') < page.indexOf('<main'), "Sheet must precede the page content");
assert(/\.site-header\s*\{[^}]*position: sticky[^}]*height: auto/.test(css), "Mobile header must expand in document flow");
assert(/grid-template-rows: 0fr; transition: grid-template-rows/.test(css) && /grid-template-rows: 1fr/.test(css), "Sheet must animate its layout height in both directions");
assert(page.includes('event.target === event.currentTarget && !menuOpen') && page.includes('!menuOpen && paused'), "Navigation must follow closing with and without motion");
console.log("Passed: mobile sheet layout, animation, accessibility, and navigation contracts.");
