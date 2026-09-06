// ─── Районы Республики Коми по id путей в /public/komi-map.svg ─────
// Сопоставление id ⇄ район проверено геометрически (центроиды путей
// сверены с положением номеров на карте и с реальной географией —
// Воркута на северо-востоке, Удорский на западе, южные районы внизу).
// Источник списка районов и их официальных номеров: Википедия,
// «Административно-территориальное деление Республики Коми».
//
// Официальные символы (проверка 06.09.2026 по geraldika.ru, heraldicum.ru,
// vexillographia.ru, Википедии и Commons; каждое положительное утверждение
// подтверждали два независимых поиска):
//   `flag` — реальный утверждённый ФЛАГ муниципалитета (9 из 19). Файлы —
//            Wikimedia Commons, официальные символы РФ (PD-RU-exempt).
//   `arms` — там, где флага так и не утверждено, но есть официальный ГЕРБ,
//            карта и панель показывают герб (8 районов). Подписывается
//            словом «герб», за флаг не выдаётся.
//   Удорский и Прилузский: герб утверждён и внесён в ГГР РФ, но свободного
//   изображения нет — без символа, только реквизиты в панели.
// `symbolNote` — реквизиты утверждения, `symbolSource` — где проверить.
export const KOMI_DISTRICTS = {
  path3051: { num: 2,  name: "Воркута",            type: "Городской округ",      flag: "/flags/vorkuta.webp" },
  path3045: { num: 3,  name: "Инта",               type: "Городской округ",      flag: "/flags/inta.webp" },
  path3127: { num: 4,  name: "Усинск",             type: "Городской округ",      flag: null,
    arms: "/arms/usinsk.webp",
    symbolNote: "утверждён решением малого Совета от 26.11.1992 № 12/100, повторно — решением Совета МО «город Усинск» от 30.03.2000; официального флага нет.",
    symbolSource: "https://www.heraldicum.ru/russia/subjects/towns/usinsk.htm" },
  path3037: { num: 5,  name: "Ухта",               type: "Муниципальный округ",  flag: null,
    arms: "/arms/ukhta.webp",
    symbolNote: "утверждён горсоветом 20.09.1979, автор Г. И. Куракин; официального флага нет.",
    symbolSource: "https://www.heraldicum.ru/russia/subjects/towns/uhta.htm" },
  path3069: { num: 6,  name: "Вуктыл",             type: "Городской округ",      flag: null,
    arms: "/arms/vuktyl.webp",
    symbolNote: "по гербу города Вуктыл; официального флага у округа нет.",
    symbolSource: "https://www.heraldicum.ru/russia/subjects/towns/vuktyl.htm" },
  path3067: { num: 7,  name: "Ижемский",           type: "Муниципальный район",  flag: "/flags/izhemsky.webp" },
  path3033: { num: 8,  name: "Княжпогостский",     type: "Муниципальный район",  flag: "/flags/knyazhpogostsky.webp" },
  path3063: { num: 9,  name: "Койгородский",       type: "Муниципальный район",  flag: "/flags/koygorodsky.webp" },
  path3119: { num: 10, name: "Корткеросский",      type: "Муниципальный район",  flag: "/flags/kortkerossky.webp" },
  path3049: { num: 11, name: "Печора",             type: "Муниципальный район",  flag: "/flags/pechora.webp",
    symbolNote: "утверждён решением Совета МР «Печора» от 29.11.2011 № 5-6/65; в ГГР РФ не внесён.",
    symbolSource: "https://geraldika.ru/s/33388" },
  path3189: { num: 12, name: "Прилузский",         type: "Муниципальный район",  flag: null,
    symbolNote: "утверждён решением Совета МР «Прилузский» от 13.04.2009 № III-20/5, ГГР РФ № 4950; официального флага нет, свободного изображения герба нет.",
    symbolSource: "http://www.heraldicum.ru/russia/subjects/towns/priluza.htm" },
  path3187: { num: 13, name: "Сосногорск",         type: "Муниципальный район",  flag: "/flags/sosnogorsk.webp" },
  path3191: { num: 14, name: "Сыктывдинский",      type: "Муниципальный район",  flag: null,
    arms: "/arms/syktyvdinsky.webp",
    symbolNote: "утверждён решением Совета МО «Сыктывдинский район» от 29.12.2004 № 20/12-9, ГГР РФ № 1767; официального флага нет.",
    symbolSource: "https://www.heraldicum.ru/russia/subjects/towns/syktyvdi.htm" },
  path3065: { num: 15, name: "Сысольский",         type: "Муниципальный район",  flag: null,
    arms: "/arms/sysolsky.webp",
    symbolNote: "утверждён решением Совета МР «Сысольский» от 31.03.2008 № IV-12/88, ГГР РФ № 5016; официального флага нет.",
    symbolSource: "https://geraldika.ru/s/23453" },
  path3003: { num: 16, name: "Троицко-Печорский",  type: "Муниципальный район",  flag: null,
    arms: "/arms/troitsko-pechorsky.webp",
    symbolNote: "утверждён решением Совета района от 22.12.2005 № 24/230, ГГР РФ № 2009; официального флага у района нет.",
    symbolSource: "https://geraldika.ru/s/41240" },
  path3195: { num: 17, name: "Удорский",           type: "Муниципальный район",  flag: null,
    symbolNote: "утверждён решением Совета МО «Удорский район» от 06.09.2005 № 20-19, ГГР РФ № 1962; официального флага нет, свободного изображения герба нет.",
    symbolSource: "https://geraldika.ru/s/5079" },
  path3035: { num: 18, name: "Усть-Вымский",       type: "Муниципальный район",  flag: null,
    arms: "/arms/ust-vymsky.webp",
    symbolNote: "утверждён решением Совета МО «Усть-Вымский район» от 19.11.1999 № 35, автор Ю. И. Абанов, ГГР РФ № 2231; официального флага нет.",
    symbolSource: "https://www.heraldicum.ru/russia/subjects/towns/ust_vym.htm" },
  path3125: { num: 19, name: "Усть-Куломский",     type: "Муниципальный район",  flag: null,
    arms: "/arms/ust-kulomsky.webp",
    symbolNote: "утверждён решением Совета МР от 10.12.2009 № XXVI-291, ГГР РФ № 5858; официального флага нет.",
    symbolSource: "http://www.heraldicum.ru/russia/subjects/towns/ust_kulom.htm" },
  path3073: { num: 20, name: "Усть-Цилемский",     type: "Муниципальный район",  flag: "/flags/ust-tsilemsky.webp" },
};
