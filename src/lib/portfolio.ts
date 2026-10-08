import clientAssets from "./assets.json" with { type: "json" };

export type Photograph = {
  file: string;
  title: string;
  alt: string;
  category: "Editorial" | "Beauty" | "Campaign" | "Runway";
};

const selected: Photograph[] = [
  { file: "studio-burgundy-leather-blazer-rope-1.webp", title: "In burgundy", alt: "Gina in a burgundy leather blazer holding a sculpted red cord", category: "Editorial" },
  { file: "beauty-jewelry-gold-rings-1.webp", title: "The finer details", alt: "Gina in a white top with gold rings, her hand resting on her collarbone", category: "Beauty" },
  { file: "studio-peach-peacock-cape-dress-1.webp", title: "Soft structure", alt: "Gina in a peach embroidered cape and textured dress against an olive backdrop", category: "Editorial" },
  { file: "astiga-leather-outdoor-2.webp", title: "An afternoon with Astiga", alt: "Gina in leather reading an Astiga newspaper outside a vintage doorway", category: "Campaign" },
  { file: "dark-fantasy-feather-collar-1.webp", title: "After dark", alt: "Gina looking over a dramatic black feathered collar", category: "Beauty" },
  { file: "maroon-silk-cheongsam-blouse-1.webp", title: "Silk & sentiment", alt: "Gina in maroon silk with gold chains holding a red floral fan", category: "Editorial" },
  { file: "modest-streetwear-orange-backdrop-2.webp", title: "A shared rhythm", alt: "Five models posing in modest streetwear against a warm orange backdrop", category: "Campaign" },
  { file: "bridal-white-kebaya-staircase-1.webp", title: "A moment in white", alt: "Gina in a white bridal kebaya on a staircase with pink flowers", category: "Editorial" },
];

const look = (file: string) => file.replace(/-\d+\.webp$/, "");
const distinctAssets = clientAssets.filter((asset, index) => !selected.some(photo => look(photo.file) === look(asset.file)) && clientAssets.findIndex(other => look(other.file) === look(asset.file)) === index);
export const photographs: Photograph[] = [...selected, ...distinctAssets.map(asset => ({ ...asset, title: look(asset.file).replaceAll("-", " "), category: (asset.file.startsWith("runway-") ? "Runway" : /beauty|feather|cyberpunk/.test(asset.file) ? "Beauty" : /astiga|streetwear|lookbook|denim|retro-office/.test(asset.file) ? "Campaign" : "Editorial") as Photograph["category"] }))];

export const motionPhotographs = photographs.filter(photo => /mountain|hallway|studio|feather|backstage|beauty/.test(photo.file)).slice(0, 18);

export const runway = [
  { file: "runway-qooq-mustard-velvet-coat-3.webp", title: "Mustard velvet / QOOQ", alt: "Gina on the runway in a mustard velvet coat with a matching clutch" },
  { file: "runway-terracotta-leather-suit-2.webp", title: "Terracotta leather", alt: "Gina walking in a terracotta leather suit with sunglasses" },
  { file: "runway-yodyoko-painted-crane-gown-4.webp", title: "Painted cranes / YODYOKO", alt: "Gina in a hand-painted crane gown and pink bucket hat" },
  { file: "runway-metallic-blue-satin-gown-2.webp", title: "Midnight satin", alt: "Gina on the runway in a metallic blue satin gown" },
  { file: "runway-quilted-black-widebrim-2.webp", title: "Sculpted in black", alt: "Gina in a wide-brim black hat and quilted high-neck top" },
  ...["runway-avantgarde-graphic-coat-1.webp", "runway-checkered-vest-red-pants-1.webp", "runway-jmfw-sporty-black-tulle-2.webp", "runway-grey-trench-turquoise-vest-1.webp", "runway-magenta-satin-gown-1.webp", "runway-red-ethnic-gown-1.webp", "runway-resort-straw-hat-shorts-1.webp"].map(file => ({ file, title: file.replace(/^runway-|-1\.webp$|-2\.webp$/g, "").replaceAll("-", " "), alt: clientAssets.find(asset => asset.file === file)!.alt })),
];

// Add only confirmed client media; posters and local films live in public/assets.
type JournalEntry = { title: string; poster: string } & (
  | { kind: "video"; file: string }
  | { kind: "instagram"; id: string }
  | { kind: "youtube"; id: string }
);
export const journal: JournalEntry[] = [
  { kind: "youtube", title: "Mulang Ka Alam", id: "6a-DS2j2F74", poster: "mountain-savanna-brown-shearling-coat-5.webp" },
];

export const mobileHeroVideo = "/Pesona%20Indonesia%20Mobile.mp4";

export const preloadFiles = [...new Set([...photographs, ...runway, ...motionPhotographs].map(photo => photo.file).concat(journal.map(entry => entry.poster), ["mountain-savanna-brown-shearling-coat-5.webp", "backstage-glamour-silver-gown-bw-2.webp", "studio-minimalist-black-blazer-1.webp", "beauty-jewelry-gold-rings-2.webp", "studio-lookbook-asymmetric-blazer-suit-1.webp"]))];
