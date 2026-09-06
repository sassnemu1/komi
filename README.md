# komi.world — портал Республики Коми

Главный сайт экосистемы komi.world. Проект УК «Велес И К» (Сыктывкар,
info@komi.world) — холдинга, который владеет всем, что здесь показано: заводом
напитков «Велес» и его брендами, пекарней, мебелью, мехом, ювелиркой, техникой
YÖRAN, отелями и ресторанами, туристическим коридором Якша—Маньпупунёр и
фольклорной картой [map.komi.world](https://map.komi.world).

Продакшен: Vercel-проект `komi` (github.com/sassnemu1/komi → `komi-alpha.vercel.app`,
целевой домен komi.world). Пуш в `main` деплоит автоматически.

## Стек

Next.js 16 (App Router, Turbopack, React Compiler), React 19, CSS-модули, GSAP +
ScrollTrigger (подгружается динамически через `src/hooks/useGSAP.js`; reveal-on-scroll
нижних секций — `src/hooks/useReveal.js` по атрибуту `data-reveal`), react-icons.

```bash
npm install
npm run dev -- --port 3100   # в KOMI/.claude/launch.json это конфиг `komi-site`
npm run build
npx eslint src
```

## Структура

```
src/
  app/
    layout.js               метаданные, OG, JSON-LD (Organization + WebSite)
    page.js                 явная композиция секций (порядок ниже)
    globals.css             токены дизайн-системы, шрифты, reduced-motion
  components/
    Header/                 фиксированная шапка: якоря, «Карта преданий ↗», бургер-меню
    HeroSection/            hero 400vh: интро → по скроллу карта районов с легендой
    KomiMap/                SVG-карта: реальные флаги паттерном, hover/фокус/клик, легенда
    DistrictPanel/          панель района: флаг, факты с источником, предания → map.komi.world
    SectionHead/            общий редакторский заголовок нижних секций (номер главы, eyebrow, лид)
    MythologySection/       оглавление: 8 глав списком + иллюстрация и текст активной, ссылки на карту преданий
    LandmarksSection/       запиненная секция: 4 точки (данные — data/landmarks.js)
    StayDineSection/        реестр: счётчики слева, отели и рестораны холдинга строками
    ExperiencesSection/     бенто-сетка впечатлений, крупные цифры из work.stats
    CampingSection/         «тропа»: три остановки на одной линии
    MadeInKomiSection/      каталог: указатель брендов + досье активного (work.facts)
    CarRental/              canvas-секвенция 240 кадров /video/frame_NNN.webp
    TaxiSection/            полоса с видео-фоном без пина; играет только когда секция в кадре
    Interlude/              фото-интерлюдия с параллаксом между главами
    SectionDivider/         полоса орнамента коми (сейчас не используется на главной)
    Footer/                 холдинг, бренды, проекты, контакты
  data/
    InfoData.js             контент разделов (форма: id, tag, title, desc, color, image, works[]);
                            у works необязательные href/location/badge/stats/facts
    landmarks.js            STOPS для достопримечательностей
    districtFacts.js        центр, коми-название, площадь, население 19 районов — с источниками
    districtLore.js         СГЕНЕРИРОВАНО из корпуса map.komi.world (см. ниже)
scripts/
  sync-lore.mjs             пересборка districtLore.js из ../komi-map/src/data/folklore.js
public/
  komi-map.svg              карта районов (viewBox 619×638), пути path3003…path3195
  flags/                    8 реальных флагов муниципалитетов (остальные не утверждены)
  brand/                    орнаменты коми и текстуры из брендкита YÖRAN (холдинг владеет)
  item/, video/             локальные картинки мифологии и кадры транспорта
```

Порядок секций и якоря: `#hero` (`#map` — стадия карты внутри hero) → `#mythology` →
`#landmarks` → `#stay` → `#experiences` → `#camping` → `#made-in-komi` →
`#transport` → `#taxi` → `#contacts`. Ссылка «Карта» в шапке скроллит к
`hero.offsetTop + hero.offsetHeight × 0.55` (константа `MAP_STAGE_RATIO`).

## Карта районов

`komiDistricts.js` — соответствие id путей SVG ⇄ район (совпадает с
`districts.js` на map.komi.world, менять синхронно). Клик по району открывает
`DistrictPanel`; данные панели:

- `districtFacts.js` — каждая цифра взята из инфобокса страницы в `source`
  (ru.wikipedia, оценка населения на 2025). Собрано 2026-09-06 и отдельно
  перепроверено агентом-скептиком: 19/19 совпали с источниками.
- `districtLore.js` — выжимка корпуса map.komi.world: `LORE_BY_DISTRICT[pathId]`,
  `LORE_AREA_WIDE`, `LORE_GENRES`, `loreEntryUrl(id)`, `loreDistrictUrl(pathId)`.
  Не править руками — `node scripts/sync-lore.mjs` после изменений корпуса.

Кнопка «Открыть район на карте преданий» ведёт на `map.komi.world/?district=<pathId>` —
карта преданий поддерживает этот параметр.

## Фотографии

`public/photos/` — 15 снимков с Wikimedia Commons (CC BY-SA 4.0 / CC BY 3.0 /
CC BY-SA 3.0): Маньпупунёр (А. Романов, Ввкстар, Asankheia), Манарага и долина
Манараги (Aysa t), Печора, лосеферма, лесное озеро и Горка в Усть-Цильме
(Г. Новинская), тропа через болото (J. Metselaar), водопад на Хальмер-Ю
(Malupasic), Сыктывкар (msdte), тундра (APL). Метаданные, alt-тексты и ссылки на
страницы файлов — в `src/data/photos.js`; авторы перечисляются в подвале
автоматически из `PHOTO_CREDITS`. Все фото отдаются через `next/image`
(hero — `priority`), исходники сжаты до 1600–2400 px.

Компонент `Interlude` — полноэкранная фото-интерлюдия с параллаксом между главами
(три на странице: Горка, тундра, долина Манараги).

## Правила контента

- Факты о брендах, отелях, ресторанах и сервисах — только из README холдинга
  (`veles i k/`). Чего там нет — на сайте нет (кухни ресторанов, звёзд отелей,
  цен за ночь).
- Факты о фольклоре — только из корпуса map.komi.world; каждая карточка мифологии
  ссылается на конкретную запись.
- Внешних картинок больше нет: все фото лежат в `public/photos` с атрибуцией.
- Никаких ссылок на домены экосистемы, которых ещё нет (madein, hotels, taxi…):
  единственная живая внешняя ссылка — map.komi.world.

## Технические заметки

- Скролл-лок оверлея слайдера — `overflow: hidden` на `<html>`, а не
  `body { position: fixed }`: последний обнулял `window.scrollY`, и ScrollTrigger
  разом снимал все пины.
- Таймлайны hero (интро и скролл) хранятся в ref и убиваются в cleanup эффекта —
  иначе в dev StrictMode второй запуск эффекта оставлял заголовок скрытым.
- Видео такси играет через IntersectionObserver: ScrollTrigger переносит секцию в
  pin-spacer на каждом refresh, а Chrome ставит `<video>` на паузу при извлечении
  из DOM.
- `prefers-reduced-motion`: интро не играет, скролл-анимации — без scrub-задержки,
  секции с пином показывают статичные версии, видео не автоплеится.
- Проверка анимаций в браузере: Chrome останавливает rAF (и GSAP) в перекрытой
  другим окном вкладке — `document.visibilityState === "hidden"` при
  `hasFocus() === true`. Окно должно быть реально видно.
