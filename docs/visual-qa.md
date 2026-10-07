# Portfolio visual QA

Checked locally in the Codex browser at 1280×800 and 390×844.

- Gallery: 50 distinct looks; near-duplicate angles are excluded. Desktop uses three columns; mobile uses two with no page overflow.
- During one 358px downward desktop scroll, the left column moved up 271px, the right moved up 455px, and the middle moved down 394px. The gallery viewport remained pinned at top 0.
- Gallery entry uses 80% to 100% opacity and 12px travel, once per photograph. No crop reveal.
- Loader downloads and decodes 58 used image files before entry. Confirmed entry reaches `data-ready=true` and direct section links restore after loading.
- Runway: photo enlarges, fades into the full-screen title, then the horizontal sequence replaces the title. Vertical scrolling moves the track horizontally.
- About: collaborations panel animates height and opacity on expansion and collapse; portrait remains sticky on desktop.
- Hero: supplied YouTube footage plays behind the scroll-expanding frame. Original film titles and baked-in captions remain part of the supplied footage; the full film is playable in the journal.

Evidence: `design-references/gina-motion-gallery-a.png`, `gina-motion-gallery-b.png`, and `gina-runway-transition.png`.

Validation: lint, TypeScript, production build, client media/contact checks, and mobile navigation regression check.
