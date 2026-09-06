// ─── Факты о районах Республики Коми ───────────────────────────────
// Дата сбора: 6 сентября 2026 года.
//
// ПРАВИЛО: каждая цифра взята ТОЛЬКО из инфобокса страницы, указанной в
// `source` (русская Википедия; население там — оценка Росстата на
// указанный год). Ничего не округлено «на глаз»: площадь приведена с той
// точностью, с какой она стоит в источнике (у Инты и Ухты Википедия сама
// даёт округлённые 30 100 и 10 300 км²). Если цифры в источнике нет —
// поля нет.
//
// Ключи — id путей SVG из src/components/KomiMap/komiDistricts.js.
// Поля:
//   center          — административный центр;
//   centerType      — «город» / «село» / «пгт», как в инфобоксе;
//   komiName        — коми-название из инфобокса (у районов — страница
//                     района; у округов Воркута, Инта, Ухта, Вуктыл, Печора
//                     инфобокс округа коми-названия не даёт, поэтому оно
//                     взято со страницы города-центра и указано в
//                     komiNameSource). Написание — как в источнике,
//                     включая латинскую ö в «Кöрткерöс» и «Кулöмдін»;
//   areaKm2         — площадь, км²;
//   population      — население, чел.;
//   populationYear  — год оценки;
//   source          — страница, откуда взяты все цифры записи.

export const FACTS_COLLECTED_AT = "2026-09-06";

export const DISTRICT_FACTS = {
  path3051: {
    center: "Воркута",
    centerType: "город",
    komiName: "Вӧркута",
    komiNameSource: "https://ru.wikipedia.org/wiki/Воркута",
    areaKm2: 24179.64,
    population: 66860,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Воркута_(муниципальный_округ)",
  },
  path3045: {
    center: "Инта",
    centerType: "город",
    komiName: "Инта",
    komiNameSource: "https://ru.wikipedia.org/wiki/Инта",
    areaKm2: 30100,
    population: 20198,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Инта_(муниципальный_округ)",
  },
  path3127: {
    center: "Усинск",
    centerType: "город",
    komiName: "Ускар",
    areaKm2: 30564.2,
    population: 35749,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Усинск_(муниципальный_округ)",
  },
  path3037: {
    center: "Ухта",
    centerType: "город",
    komiName: "Уква",
    komiNameSource: "https://ru.wikipedia.org/wiki/Ухта",
    areaKm2: 10300,
    population: 92872,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Ухта_(муниципальный_округ)",
  },
  path3069: {
    center: "Вуктыл",
    centerType: "город",
    komiName: "Вуктыл",
    komiNameSource: "https://ru.wikipedia.org/wiki/Вуктыл",
    areaKm2: 22453.18,
    population: 9896,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Вуктыл_(муниципальный_округ)",
  },
  path3067: {
    center: "Ижма",
    centerType: "село",
    komiName: "Изьва район",
    areaKm2: 18435.57,
    population: 16012,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Ижемский_район",
  },
  path3033: {
    center: "Емва",
    centerType: "город",
    komiName: "Княжпогост район",
    areaKm2: 24615.6,
    population: 14753,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Княжпогостский_район",
  },
  path3063: {
    center: "Койгородок",
    centerType: "село",
    komiName: "Койгорт район",
    areaKm2: 10415.66,
    population: 7407,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Койгородский_район",
  },
  path3119: {
    center: "Корткерос",
    centerType: "село",
    komiName: "Кöрткерöс район",
    areaKm2: 19748.35,
    population: 18024,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Корткеросский_район",
  },
  path3049: {
    center: "Печора",
    centerType: "город",
    komiName: "Печӧра",
    komiNameSource: "https://ru.wikipedia.org/wiki/Печора_(город)",
    areaKm2: 28922.82,
    population: 41636,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Печора_(муниципальный_район)",
  },
  path3189: {
    center: "Объячево",
    centerType: "село",
    komiName: "Луздор район",
    areaKm2: 13168.48,
    population: 16768,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Прилузский_район",
  },
  path3187: {
    center: "Сосногорск",
    centerType: "город",
    komiName: "Сӧснагорт",
    areaKm2: 16562.93,
    population: 33512,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Сосногорск_(муниципальный_район)",
  },
  path3191: {
    center: "Выльгорт",
    centerType: "село",
    komiName: "Сыктывдін район",
    areaKm2: 7473.9,
    population: 21462,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Сыктывдинский_район",
  },
  path3065: {
    center: "Визинга",
    centerType: "село",
    komiName: "Сыктыв район",
    areaKm2: 6070.75,
    population: 11396,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Сысольский_район",
  },
  path3003: {
    center: "Троицко-Печорск",
    centerType: "пгт",
    komiName: "Мылдін район",
    areaKm2: 40601.12,
    population: 9204,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Троицко-Печорский_район",
  },
  path3195: {
    center: "Кослан",
    centerType: "село",
    komiName: "Удора район",
    areaKm2: 35815.68,
    population: 11912,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Удорский_район",
  },
  path3035: {
    center: "Айкино",
    centerType: "село",
    komiName: "Емдін район",
    areaKm2: 4775.08,
    population: 23279,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Усть-Вымский_район",
  },
  path3125: {
    center: "Усть-Кулом",
    centerType: "село",
    komiName: "Кулöмдін район",
    areaKm2: 26368.01,
    population: 21419,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Усть-Куломский_район",
  },
  path3073: {
    center: "Усть-Цильма",
    centerType: "село",
    komiName: "Чилимдін район",
    areaKm2: 42511.1,
    population: 10217,
    populationYear: 2025,
    source: "https://ru.wikipedia.org/wiki/Усть-Цилемский_район",
  },
};

/** Форматирует число по-русски: 24179.64 → «24 180», 66860 → «66 860» */
export function formatNumber(value, fractionDigits = 0) {
  if (value == null) return "";
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}
