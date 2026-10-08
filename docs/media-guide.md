# Updating Gina’s portfolio

Selected work and runway photographs are listed in `src/lib/portfolio.ts`. Use filenames from `public/catalog.md`; gallery photographs and journal videos belong in `public/assets/`.

The supplied YouTube video `6a-DS2j2F74` plays muted in the desktop hero and is available with controls in the journal. Mobile plays the vertical MP4 copy of Instagram Reel `Dd_RS2eS60X` from `public/Pesona Indonesia Mobile.mp4`, with a link to the Reel. Add confirmed media to the `journal` array:

```ts
// Local film (poster and MP4 in public/assets)
{ kind: "video", title: "Film title", file: "film.mp4", poster: "poster.webp" }

// Instagram post or reel: use the shortcode from its /p/ or /reel/ URL.
{ kind: "instagram", title: "Post title", id: "POST_SHORTCODE", poster: "poster.webp" }

// YouTube: use the video ID, not the whole URL.
{ kind: "youtube", title: "Film title", id: "VIDEO_ID", poster: "poster.webp" }
```

These are format examples, not published entries. Supply a client-owned poster for every entry. Instagram cards link to the post; YouTube loads the privacy-enhanced player only after a click. Local films use native video controls. No additional social account links are added.

The runway pins to the viewport while vertical page scrolling moves its photographs horizontally, including on mobile. Paused or reduced motion presents the photographs in a static grid.

The gallery uses 50 distinct looks selected from the 95-photo catalog. `preloadFiles` contains every image used by the gallery, hero, loader, and scroll scenes. The loader downloads and decodes those images in six parallel lanes before revealing the page; failures offer retry or entry with the available photos. Next image optimization is disabled so preloading and display share the same cached WebP files.

Gallery columns move at different speeds. A sticky backstage background is revealed through transparent foreground space; the next photo wall moves its middle column in the opposite direction. The runway opens with an automatic 900ms image-to-solid-title fade, holds the opaque title for two seconds, then reveals its scroll-driven horizontal sequence. About uses a sticky portrait and animated accordion panels.

Bookings link directly to WhatsApp +62 814-6117-1726. Instagram links point to @gnalist.y. Biography, collaborations, and achievements come from `public/Ginalist.pdf`.

Run `node scripts/check-portfolio.mjs` with the local server running to verify asset files, profile identity, and public contact links. The optional first argument is the preview origin.
