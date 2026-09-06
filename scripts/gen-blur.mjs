// Генерирует blur-плейсхолдеры (LQIP) для картинок из public/photos и
// вписывает их в src/data/photos.js полем "blur" (data-URI 24px).
// JPEG → jpeg; WebP с альфой → webp с альфой (без чёрных прямоугольников
// на прозрачных слоях). Запуск: node scripts/gen-blur.mjs — идемпотентно.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const PHOTOS_DIR = path.join(ROOT, "public/photos");
const DATA = path.join(ROOT, "src/data/photos.js");

const blur = {};
for (const f of fs.readdirSync(PHOTOS_DIR).filter((f) => /\.(jpe?g|webp)$/i.test(f)).sort()) {
  const img = sharp(path.join(PHOTOS_DIR, f));
  const meta = await img.metadata();
  if (meta.hasAlpha) {
    const buf = await img.resize(24).webp({ quality: 50, alphaQuality: 60 }).toBuffer();
    blur["/photos/" + f] = "data:image/webp;base64," + buf.toString("base64");
  } else {
    const buf = await img.resize(24).jpeg({ quality: 45, mozjpeg: true }).toBuffer();
    blur["/photos/" + f] = "data:image/jpeg;base64," + buf.toString("base64");
  }
}

const src = fs.readFileSync(DATA, "utf8").split("\n");
const out = [];
let patched = 0;
for (let i = 0; i < src.length; i++) {
  const line = src[i];
  if (/^\s*"blur": /.test(line)) continue;
  out.push(line);
  const m = line.match(/^(\s*)"src": "([^"]+)",\s*$/);
  if (m && blur[m[2]]) {
    out.push(`${m[1]}"blur": "${blur[m[2]]}",`);
    patched++;
  }
}
fs.writeFileSync(DATA, out.join("\n"));
console.log(`blur placeholders: ${patched} / ${Object.keys(blur).length}`);
