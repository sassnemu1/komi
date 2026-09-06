// Пересобирает src/data/districtLore.js из корпуса map.komi.world.
// Запуск из корня sites/komi:  node scripts/sync-lore.mjs
import { writeFileSync } from "node:fs";
const f = await import("../../komi-map/src/data/folklore.js");
const byD = {}; const areaWide = [];
for (const e of f.ENTRIES) {
  const item = { id: e.id, title: e.title, komi: e.komi || null, genre: e.genre, lead: e.lead, place: e.place, verified: e.verified };
  if (e.areaWide || !e.districts?.length) { areaWide.push(item); continue; }
  for (const d of e.districts) (byD[d] ??= []).push(item);
}
const genres = Object.fromEntries(f.GENRES.map((g) => [g.id, { label: g.label, color: g.color }]));
const out =
`// ─── Предания по районам ───────────────────────────────────────
// СГЕНЕРИРОВАНО из sites/komi-map/src/data/folklore.js — не править руками.
// Пересобрать: node scripts/sync-lore.mjs. Корпус map.komi.world:
// ${f.ENTRIES.length} записей, каждая сверена по первоисточникам; verified —
// уверенность в географической привязке (strong = район назван в самом сюжете).

export const LORE_GENRES = ${JSON.stringify(genres, null, 2)};

/** id пути SVG → записи, привязанные к району */
export const LORE_BY_DISTRICT = ${JSON.stringify(byD, null, 2)};

/** Сюжеты, бытующие по всей республике (без привязки к району) */
export const LORE_AREA_WIDE = ${JSON.stringify(areaWide, null, 2)};

export const LORE_SITE = "https://map.komi.world";
export const loreEntryUrl = (id) => \`\${LORE_SITE}/entry/\${id}\`;
export const loreDistrictUrl = (pathId) => \`\${LORE_SITE}/?district=\${pathId}\`;
`;
writeFileSync(new URL("../src/data/districtLore.js", import.meta.url), out);
console.log(`districtLore.js: ${Object.keys(byD).length} districts, ${areaWide.length} areaWide, ${f.ENTRIES.length} entries`);
