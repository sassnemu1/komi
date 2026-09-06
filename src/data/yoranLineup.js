// ─── Линейка YÖRAN — единый источник для «Сделано в Коми» и «Транспорта» ──
// Семь машин с сайта YÖRAN (yoran-web.vercel.app): имя из эпоса коми, тип,
// ступень и плановый срок. Сайт помечен «Прототип сайта · концепция ·
// август 2026» — все сроки подаются как план. Визуализации — с того же сайта
// (photos.js: yoran-*-w). Глоссы имён — только из корпуса map.komi.world
// (districtLore.js): есть у Йиркапа, Яг-Морта, Перы и Войпеля; у остальных
// записей в корпусе нет — строка не выводится.
// element — редакторский кикер стихии (не факт из источника, в досье не идёт).
import { loreEntryUrl } from "@/data/districtLore";

export const MACHINES = [
  { step: 1, roman: "I",   name: "Вакуль",  type: "Гидроцикл",              year: "2029",      element: "вода",       photo: "yoran-jetski-w" },
  { step: 2, roman: "II",  name: "Ош",      type: "Квадроцикл ATV",         year: "2029–2030", element: "земля",      photo: "yoran-atv-w" },
  { step: 3, roman: "III", name: "Йиркап",  type: "Снегоход",               year: "2030",      element: "снег",       photo: "yoran-snow-w",
    lore: { id: "yirkap", gloss: "Охотник на волшебных лыжах, догнавший голубого оленя — предание Синдорского озера." },
    eco: "Зимний сезон фуникулёра «Якша Skyview» планируется на снегоходах YÖRAN." },
  { step: 4, roman: "IV",  name: "Яг-Морт", type: "Болотоход-амфибия 6×6",  year: "2031–2032", element: "болото",     photo: "yoran-swamp-w",
    lore: { id: "yag-mort", gloss: "«Лесной (боровой) человек» — лесной великан с реки Куча." } },
  { step: 5, roman: "V",   name: "Пера",    type: "Мотоцикл эндуро",        year: "2032",      element: "бездорожье", photo: "yoran-moto-w",
    lore: { id: "pera", gloss: "Пера-богатырь, охотник; в Прилузье его историю рассказывают как свою." } },
  { step: 6, roman: "VI",  name: "Кырныш",  type: "Грузовой дрон",          year: "2032–2033", element: "небо",       photo: "yoran-drone-w" },
  { step: 7, roman: "VII", name: "Войпель", type: "Аэротакси eVTOL",        year: "2035–2036", element: "небо",       photo: "yoran-evtol-w",
    lore: { id: "voypel", gloss: "«Северное ухо» — владыка северного ветра, один из немногих коми богов, попавших в письменный источник." },
    eco: "Flying Taxi — сервис из портфеля холдинга, в проекте." },
];

export const MACHINE_BY_STEP = Object.fromEntries(MACHINES.map((m) => [m.step, m]));

// Классы проката Taigarenda ↔ планируемая машина линейки (только сопоставление
// с планом, не обещание парка).
export const RENTAL_MAP = [
  { label: "Снегоходы",            note: "зимние маршруты", step: 3 },
  { label: "Вездеходы",            note: "болота и бездорожье", step: 4 },
  { label: "Внедорожники и ATV",   note: "тайга",          step: 2 },
];

export const loreUrl = (m) => (m.lore ? loreEntryUrl(m.lore.id) : null);
