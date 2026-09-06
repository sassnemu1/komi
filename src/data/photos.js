// ─── Фотографии сайта ──────────────────────────────────────────
// Все снимки — Wikimedia Commons, свободные лицензии (CC BY-SA 4.0 /
// CC BY 3.0 / CC BY-SA 3.0). Файлы лежат в public/photos, отдаются через
// next/image. Авторы перечислены в подвале (Footer) из этого же файла.
// Собрано 2026-09-06 через API Commons; page — страница файла с лицензией;
// pos — object-position для кадров, где центр обрезает сюжет; caption — подпись
// места на карточке. Записи с render: true — визуализации из меморандума
// УК «Велес И К» (собственные материалы холдинга, не фотографии): на карточках
// помечаются словом «визуализация», в подвал как фото не попадают.

export const PHOTOS = {
  "yaksha-house": {
    "pos": "center 55%",
    "src": "/photos/yaksha-house.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAPABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAIEAf/EABcBAAMBAAAAAAAAAAAAAAAAAAABAgT/2gAMAwEAAhADEAAAAGNTC4isg//EACMQAAEDAgUFAAAAAAAAAAAAAAIAAQMRIQQFEhMxMkFCcaH/2gAIAQEAAT8AwmZaYCDS5GxWUuZS7Rj5P3ZBPOLDSQ2b4gipa1fSmKKM2qNm5T4iIm6Htwv/xAAbEQACAQUAAAAAAAAAAAAAAAAAAhEBAxMUQv/aAAgBAgEBPwDYuxBkanTH/8QAFxEBAAMAAAAAAAAAAAAAAAAAAAERIf/aAAgBAwEBPwCoY//Z",
    "alt": "Деревянный дом в посёлке Якша летом, Печоро-Илычский заповедник",
    "caption": "Якша, Троицко-Печорский район",
    "author": "Г. Новинская",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:%D0%92_%D0%AF%D0%BA%D1%88%D0%B5_%D0%BB%D0%B5%D1%82%D0%BE%D0%BC.jpg",
    "w": 4832,
    "h": 3120
  },
  "forest-snow": {
    "pos": "center 50%",
    "src": "/photos/forest-snow.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAUBAwQG/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhADEAAAAJq6dPZgGwf/xAAgEAACAQQCAwEAAAAAAAAAAAABAgMABBEhEhMUIjFC/9oACAEBAAE/APCuutuKexGt0lpOmpNDG95NPAxMsUEbOUIyx/NAKRsVe286sXiyQfu6sh12/Bjk5JzX/8QAFBEBAAAAAAAAAAAAAAAAAAAAEP/aAAgBAgEBPwA//8QAFBEBAAAAAAAAAAAAAAAAAAAAEP/aAAgBAwEBPwA//9k=",
    "alt": "Ели под снегом, Печоро-Илычский заповедник",
    "caption": "Тайга зимой, Печоро-Илычский заповедник",
    "author": "Aysa t",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:%D0%9B%D0%B5%D1%81_%D0%B2_%D1%81%D0%BD%D0%B5%D0%B3%D1%83.jpg",
    "w": 4368,
    "h": 2912
  },
  "taiga-fairy": {
    "pos": "center 50%",
    "src": "/photos/taiga-fairy.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAAD/8QAFgEBAQEAAAAAAAAAAAAAAAAAAQAC/9oADAMBAAIQAxAAAAA+qtdAJsX/xAAgEAACAQMEAwAAAAAAAAAAAAABAgADBCEREhRRMTJB/9oACAEBAAE/AEtlMFqvYjWiaewgpbshvM45yuAvwx6HbAT/xAAWEQADAAAAAAAAAAAAAAAAAAAAARL/2gAIAQIBAT8AtlM//8QAFxEBAAMAAAAAAAAAAAAAAAAAAAEREv/aAAgBAwEBPwDKof/Z",
    "alt": "Заснеженная тайга в инее, Печоро-Илычский заповедник",
    "caption": "Зимняя тайга, Печоро-Илычский заповедник",
    "author": "Aysa t",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:%D0%A1%D0%BA%D0%B0%D0%B7%D0%BE%D1%87%D0%BD%D0%B0%D1%8F_%D1%82%D0%B0%D0%B9%D0%B3%D0%B0.jpg",
    "w": 4368,
    "h": 2912
  },
  "yb-ethnopark": {
    "pos": "center 40%",
    "src": "/photos/yb-ethnopark.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMEAf/EABYBAQEBAAAAAAAAAAAAAAAAAAMBAv/aAAwDAQACEAMQAAAAhpQ0HwUan//EACMQAAIABgIBBQAAAAAAAAAAAAECAAMEERIiIUEUMTJRcoH/2gAIAQEAAT8AAxYm/qehCb2RTyeBcRVSTLVW1xdSQB0R1Euso7BZ8uYzD24EKI8uiuurgowa+WQ+sVdRTui4a2+QOR+R/8QAGBEAAgMAAAAAAAAAAAAAAAAAAAERIWH/2gAIAQIBAT8AvRSf/8QAFxEAAwEAAAAAAAAAAAAAAAAAAAERAv/aAAgBAwEBPwCo1Kf/2Q==",
    "alt": "Хозяйка в национальном костюме коми у стола с выпечкой в коми-избе Финно-угорского этнопарка",
    "caption": "Коми-изба, Финно-угорский этнопарк в Ыбе",
    "author": "Г. Новинская",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:%D0%9D%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%B6%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9_%D0%BA%D0%BE%D1%81%D1%82%D1%8E%D0%BC_%D0%BA%D0%BE%D0%BC%D0%B8.jpg",
    "w": 5856,
    "h": 3808
  },
  "ukhta-aerial": {
    "pos": "center 50%",
    "src": "/photos/ukhta-aerial.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAASABgDASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAQFAQIGB//EABYBAQEBAAAAAAAAAAAAAAAAAAECAP/aAAwDAQACEAMQAAAA2kUFjUTmDuJnkvoQz//EACMQAAICAgAFBQAAAAAAAAAAAAECAAMEEQUhIjNxQUJicpL/2gAIAQEAAT8Are8nncqw3WrsjJBA+Ji5re65fyYOJhz11CYoN4Lb0vmY+I91mlJC+sWYfer+0wuyngT/xAAYEQACAwAAAAAAAAAAAAAAAAAAEgECEP/aAAgBAgEBPwB7Dzv/xAAXEQADAQAAAAAAAAAAAAAAAAAAAhIQ/9oACAEDAQE/AIUhd//Z",
    "alt": "Ухта с высоты птичьего полёта",
    "caption": "Ухта с высоты",
    "author": "Екатерина Борисова",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Ukhta_aerial_view.jpg",
    "w": 3072,
    "h": 2304
  },
  "render-lobby": {
    "render": true,
    "src": "/photos/render-lobby.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAPABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMFBv/EABQBAQAAAAAAAAAAAAAAAAAAAAL/2gAMAwEAAhADEAAAAI+izl0NggR//8QAIRAAAQMFAAIDAAAAAAAAAAAAAQIDBAAREiExBUEyU3H/2gAIAQEAAT8AW+pktrZOGXrtQ3mFR0l0jPC5pcppJLgPE/u7U0x9pvv1qonjIRQFqb6KkxVfBh3HFV977X//xAAWEQEBAQAAAAAAAAAAAAAAAAAAASH/2gAIAQIBAT8Aka//xAAVEQEBAAAAAAAAAAAAAAAAAAABEP/aAAgBAwEBPwBZ/9k=",
    "alt": "Визуализация лобби гостиницы из меморандума холдинга",
    "caption": "Визуализация · меморандум холдинга",
    "author": "УК «Велес И К»",
    "license": "визуализация из меморандума",
    "page": "",
    "w": 918,
    "h": 567
  },
  "render-cabin": {
    "render": true,
    "src": "/photos/render-cabin.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAYABgDASIAAhEBAxEB/8QAGAABAAMBAAAAAAAAAAAAAAAAAAMEBQL/xAAWAQEBAQAAAAAAAAAAAAAAAAACAwD/2gAMAwEAAhADEAAAAM6atoI00C8NrsyrhD//xAAgEAACAgIDAQADAAAAAAAAAAABAgMRACEEEjFRUoGR/9oACAEBAAE/ADIqqaFtQr94rOVAMdOSNHV5LVgfSw/mcK+wPhX8hnIAl00gvZst5krSMq96YgaI93kYgau8YJ+nGh4hBHQ+fcMXGj2qb+k3n//EABoRAQADAQEBAAAAAAAAAAAAAAEAAgMRBCH/2gAIAQIBAT8Av6bV0+pyGoxzovUhUJ//xAAaEQADAAMBAAAAAAAAAAAAAAAAAQIDESEE/9oACAEDAQE/AJ801HF0rDoWS0tJjptn/9k=",
    "alt": "Визуализация деревянного домика в зимнем лесу из меморандума холдинга",
    "caption": "Визуализация · меморандум холдинга",
    "author": "УК «Велес И К»",
    "license": "визуализация из меморандума",
    "page": "",
    "w": 1000,
    "h": 1000
  },
  "render-izba": {
    "render": true,
    "src": "/photos/render-izba.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAPABgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABAD/xAAVAQEBAAAAAAAAAAAAAAAAAAABA//aAAwDAQACEAMQAAAACMy43NLk/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQREzGREhQiQUJx/9oACAEBAAE/AOxA89XkU4d3w687n8qeEIEBjZSW91JPc7azbmluRIseuSWWr2duiMjJwPo5xX//xAAXEQEBAQEAAAAAAAAAAAAAAAABAAIR/9oACAECAQE/AEs9S//EABgRAQEAAwAAAAAAAAAAAAAAAAEAAhFB/9oACAEDAQE/AB5OsW//2Q==",
    "alt": "Визуализация интерьера бревенчатого дома с камином из меморандума холдинга",
    "caption": "Визуализация · меморандум холдинга",
    "author": "УК «Велес И К»",
    "license": "визуализация из меморандума",
    "page": "",
    "w": 918,
    "h": 567
  },
  "render-dome": {
    "render": true,
    "src": "/photos/render-dome.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAPABgDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAMFAQb/xAAVAQEBAAAAAAAAAAAAAAAAAAACAf/aAAwDAQACEAMQAAAA5qvLYFogp//EACIQAAIBBAEEAwAAAAAAAAAAAAECAwAEERIhEzEyQUJRcf/aAAgBAQABPwCzeRG2XxGNvYNSPAqxqWBVAx/dqvLpO0ceBwefsVb3ISCRNlIPxK+6M0bhOoM6qADU0kDBgMAZ4Civ/8QAGREAAgMBAAAAAAAAAAAAAAAAAAECETES/9oACAECAQE/AOpXgneo/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAIBERIhMf/aAAgBAwEBPwDBe3slFg//2Q==",
    "alt": "Визуализация купольного домика глэмпинга под северным сиянием из меморандума холдинга",
    "caption": "Визуализация · меморандум холдинга",
    "author": "УК «Велес И К»",
    "license": "визуализация из меморандума",
    "page": "",
    "w": 918,
    "h": 567
  },
  "render-gondola": {
    "render": true,
    "src": "/photos/render-gondola.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAiABgDASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAMEAQIFBv/EABYBAQEBAAAAAAAAAAAAAAAAAAEAAv/aAAwDAQACEAMQAAAA7rz0adx5olHetjLMrm2hKyK//8QAJBAAAgECBQQDAAAAAAAAAAAAAQIAAxEEEhMhMSJRcZFBQoH/2gAIAQEAAT8AXE06g2pkmF+9Bo9VBfNRa3eNiKQN0qN5IjYsHYMfcfEi25a81ZSemzNqZsoW+0xBBIZbgHgQVFI6V3jNmVgy+viIRcXHTxPp+xuI3C+J/8QAFhEAAwAAAAAAAAAAAAAAAAAAACAh/9oACAECAQE/ACL/AP/EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8AX//Z",
    "alt": "Визуализация гондолы фуникулёра «Якша Skyview» над тайгой из меморандума холдинга",
    "caption": "Визуализация · меморандум холдинга",
    "author": "УК «Велес И К»",
    "license": "визуализация из меморандума",
    "page": "",
    "w": 1120,
    "h": 1600
  },
  "taiga-fog": {
    "pos": "center 42%",
    "src": "/photos/taiga-fog.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAUGBP/EABcBAAMBAAAAAAAAAAAAAAAAAAACAwT/2gAMAwEAAhADEAAAAFlLLu4GEDE3/8QAIRAAAgEDBAMBAAAAAAAAAAAAAgMBAAQRBRIhQRMVRHH/2gAIAQEAAT8A0t4LeOS4ivb22+I2067ljpyZc57qwAFEUuQR/kUt2nx8hU8RewSBHixM91//xAAbEQACAQUAAAAAAAAAAAAAAAAAAgEDEhMyQv/aAAgBAgEBPwDNC9qVHW7c/8QAFREBAQAAAAAAAAAAAAAAAAAAEBH/2gAIAQMBAT8Ah//Z",
    "alt": "Густой туман над лесным озером в тайге, Печоро-Илычский заповедник",
    "author": "Г. Новинская",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:%D0%93%D1%83%D1%81%D1%82%D0%BE%D0%B9_%D1%82%D1%83%D0%BC%D0%B0%D0%BD.jpg",
    "w": 5184,
    "h": 3456
  },
  "manpupuner-aurora": {
    "pos": "62% center",
    "src": "/photos/manpupuner-aurora.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAwAEBv/EABQBAQAAAAAAAAAAAAAAAAAAAAL/2gAMAwEAAhADEAAAAOPdGYzTyX//xAAeEAACAgICAwAAAAAAAAAAAAABAgADERIEIjJhkf/aAAgBAQABPwDWUIC/YZGJyq1RxqMAiCv0ZXXoc4PyclGYqQD4z//EABgRAAMBAQAAAAAAAAAAAAAAAAABEQIh/9oACAECAQE/AG+GZEf/xAAYEQADAQEAAAAAAAAAAAAAAAAAASECMf/aAAgBAwEBPwBaqg+n/9k=",
    "alt": "Северное сияние над столбом выветривания Маньпупунёра",
    "author": "Ввкстар",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:%D0%A1%D0%BD%D0%B5%D0%B6%D0%BD%D1%8B%D0%B9_%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%B0%D0%BD.jpg",
    "w": 6000,
    "h": 4000
  },
  "manpupuner-plateau": {
    "src": "/photos/manpupuner-plateau.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAANABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMFBP/EABYBAQEBAAAAAAAAAAAAAAAAAAIBA//aAAwDAQACEAMQAAAAax+rUSykU//EAB8QAAICAQUBAQAAAAAAAAAAAAECAAMSBBExUpETUf/aAAgBAQABPwBlr7LKdMtmxyGOQB2M+Sd19iU6deKE8i4qNgigfgEemlua18n/xAAYEQACAwAAAAAAAAAAAAAAAAAAAQIDE//aAAgBAgEBPwB2SNWf/8QAFxEAAwEAAAAAAAAAAAAAAAAAAAETUf/aAAgBAwEBPwCaJLT/2Q==",
    "alt": "Зимняя панорама плато Маньпупунёр",
    "author": "Алексей Романов",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:%D0%9F%D0%BB%D0%B0%D1%82%D0%BE_%D0%9C%D0%B0%D0%BD%D1%8C%D0%9F%D1%83%D0%BF%D1%83%D0%9D%D1%91%D1%80.jpg",
    "w": 4724,
    "h": 2481
  },
  "manpupuner-summer": {
    "src": "/photos/manpupuner-summer.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAUGAwT/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAACnzgeoW4gE/8QAIRAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRITIhQhcTL/2gAIAQEAAT8AudQtbcyIXzKiFtnwZqO58m2im27S6BsVc8w1K2UN0aN8rUk80k8k5bu6lT8IxS6leIipyegMCprmeV45C/ZPya//xAAVEQEBAAAAAAAAAAAAAAAAAAAAEv/aAAgBAgEBPwClv//EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oACAEDAQE/AIj/2Q==",
    "alt": "Столбы выветривания на плато Маньпупунёр летом",
    "author": "Asankheia",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:%D0%9F%D0%BB%D0%B0%D1%82%D0%BE_%D0%9C%D0%B0%D0%BD%D1%8C%D0%BF%D1%83%D0%BF%D1%83%D0%BD%D1%91%D1%80.JPG",
    "w": 5184,
    "h": 3456
  },
  "manaraga": {
    "src": "/photos/manaraga.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFAf/EABYBAQEBAAAAAAAAAAAAAAAAAAECA//aAAwDAQACEAMQAAAAZ1tjSJJbB//EACQQAAEDAwMEAwAAAAAAAAAAAAIBAwQAERIFFCFRUlNygYKR/9oACAEBAAE/AFdht45Phz05oJ+miq5Zl9aOdpx3XF0fittFaFSKC2Vuwb0wkR8FxjYewWrbx/GH5X//xAAZEQADAAMAAAAAAAAAAAAAAAAAAQISQVL/2gAIAQIBAT8Ad29md9H/xAAaEQACAgMAAAAAAAAAAAAAAAAAAQIDEkFS/9oACAEDAQE/AFXBaMIcn//Z",
    "alt": "Гора Манарага в национальном парке «Югыд ва» зимой",
    "author": "Aysa t",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:%D0%9C%D0%B0%D0%BD%D0%B0%D1%80%D0%B0%D0%B3%D0%B0_1.jpg",
    "w": 5597,
    "h": 3731
  },
  "pechora": {
    "src": "/photos/pechora.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMEBf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/aAAwDAQACEAMQAAAArpzXlAkzf//EACMQAAEEAQIHAQAAAAAAAAAAAAIAAQMRBBITBSEiIzEzcrL/2gAIAQEAAT8AjzxlN7B9P1bp82AG9ZKbicUVds/ytQbm4PSdVdIciWuZinnd/Lsv/8QAHBEAAgAHAAAAAAAAAAAAAAAAAAEREiEzUpGh/9oACAECAQE/AJqXVoi8+H//xAAYEQADAQEAAAAAAAAAAAAAAAAAARJRUv/aAAgBAwEBPwCHyS8P/9k=",
    "alt": "Река Печора у посёлка Якша",
    "author": "Г. Новинская",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:%D0%A0%D0%B5%D0%BA%D0%B0_%D0%9F%D0%B5%D1%87%D0%BE%D1%80%D0%B0._%D0%AF%D0%BA%D1%88%D0%B0_2.jpg",
    "w": 5094,
    "h": 3394
  },
  "khalmer-yu": {
    "src": "/photos/khalmer-yu.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAYCAwX/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/aAAwDAQACEAMQAAAA17lOELmJ4P8A/8QAJRABAAACCAcAAAAAAAAAAAAAAQACAwQREhMUMTIFIUFSkZKh/9oACAEBAAE/ADiVVXe+sZ2gXcw12rpufEWCpmLslzR6sS0usmGITcp7bFjFn7fix//EABgRAAMBAQAAAAAAAAAAAAAAAAACYRIT/9oACAECAQE/ANPDo8P/xAAWEQEBAQAAAAAAAAAAAAAAAAAAEgH/2gAIAQMBAT8AnEv/2Q==",
    "alt": "Водопад на реке Хальмер-Ю, городской округ Воркута",
    "author": "Malupasic",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:I%D0%92%D0%BE%D0%B4%D0%BE%D0%BF%D0%B0%D0%B4_%D0%BD%D0%B0_%D1%80%D0%B5%D0%BA%D0%B5_%D0%A5%D0%B0%D0%BB%D1%8C%D0%BC%D0%B5%D1%80-%D0%AEMG_9322.jpg",
    "w": 5184,
    "h": 3456
  },
  "moose": {
    "pos": "center 40%",
    "src": "/photos/moose.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFBv/EABYBAQEBAAAAAAAAAAAAAAAAAAIDBP/aAAwDAQACEAMQAAAAXoQXMy0hCJH/xAAhEAACAQUAAQUAAAAAAAAAAAABAgMABBESITETFDNRcf/aAAgBAQABPwC3uhEgkYsp28YqzvXmabRlTLczXu3HN9vykQzlPUDhCM5+6KQx/A+rZx3xTENwSlTjtf/EABoRAAICAwAAAAAAAAAAAAAAAAECAEEDETH/2gAIAQIBAT8AZlUgXrsGQ2xn/8QAFhEBAQEAAAAAAAAAAAAAAAAAAQAS/9oACAEDAQE/AHI27//Z",
    "alt": "Лось на лосеферме в Якше",
    "author": "Г. Новинская",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:%D0%9D%D0%B0_%D0%BB%D0%BE%D1%81%D0%B5%D1%84%D0%B5%D1%80%D0%BC%D0%B5._%D0%AF%D0%BA%D1%88%D0%B0_MG_8868.jpg",
    "w": 5184,
    "h": 3456
  },
  "boardwalk": {
    "src": "/photos/boardwalk.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAUGAgP/xAAXAQADAQAAAAAAAAAAAAAAAAAAAQME/9oADAMBAAIQAxAAAABh3ndZaNyeB//EAB4QAAEEAgMBAAAAAAAAAAAAAAEAAgMEElERIUNT/9oACAEBAAE/AGTVh6BC3U+ijuVs5CXDHLR2UJijKUH9O52V/8QAGxEAAgEFAAAAAAAAAAAAAAAAAAEDAgQUQlL/2gAIAQIBAT8AqvpXojJk5R//xAAZEQACAwEAAAAAAAAAAAAAAAAAAQIDE0H/2gAIAQMBAT8AVEV0zR//2Q==",
    "alt": "Деревянная тропа через болото у Якши, Печоро-Илычский заповедник",
    "author": "J. Metselaar",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Bog_area_in_the_Yaksha_cluster_of_Pechora-Ilych_B.R.jpg",
    "w": 4608,
    "h": 3072
  },
  "pechora-rainbow": {
    "src": "/photos/pechora-rainbow.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAYCAwX/xAAWAQEBAQAAAAAAAAAAAAAAAAABAAP/2gAMAwEAAhADEAAAAGCjCjDOKBm//8QAIRAAAgEDAwUAAAAAAAAAAAAAAQIAAwQSESFxFCIxMlH/2gAIAQEAAT8A6q1Re0jiJcZucN4u/mZW2mzk8kwvRHs+vwDWNc1FY4UiFn//xAAbEQABBAMAAAAAAAAAAAAAAAAAAQIRoRMxUv/aAAgBAgEBPwBXwmrMrubP/8QAFhEBAQEAAAAAAAAAAAAAAAAAABEB/9oACAEDAQE/AJqP/9k=",
    "alt": "Радуга над Печорой и лодки у берега, Якша",
    "author": "Г. Новинская",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:%D0%9F%D0%B5%D1%87%D0%BE%D1%80%D0%BE-%D0%98%D0%BB%D1%8B%D1%87%D1%81%D0%BA%D0%B8%D0%B9_%D0%B7%D0%B0%D0%BF%D0%BE%D0%B2%D0%B5%D0%B4%D0%BD%D0%B8%D0%BA._%D0%9F%D0%B5%D1%87%D0%BE%D1%80%D0%B0_MG_7391.jpg",
    "w": 5074,
    "h": 3382
  },
  "forest-lake": {
    "src": "/photos/forest-lake.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMEAv/EABYBAQEBAAAAAAAAAAAAAAAAAAEAAv/aAAwDAQACEAMQAAAA3ZA3MknB/8QAIxAAAQMDAgcAAAAAAAAAAAAAAgABAwQRIQVhFSMxMlNxgf/aAAgBAQABPwCn1A+w41xF/Gp6wZGO4D8UY0gjiQ7bP1UhRiPLIh9ujeMsmb53Zf/EABoRAAICAwAAAAAAAAAAAAAAAAAREyFBUoH/2gAIAQIBAT8AwpS930//xAAWEQEBAQAAAAAAAAAAAAAAAAAAgYL/2gAIAQMBAT8Ayj//2Q==",
    "alt": "Лесное озеро в Печоро-Илычском заповеднике",
    "author": "Г. Новинская",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:%D0%9F%D0%B5%D1%87%D0%BE%D1%80%D0%BE-%D0%98%D0%BB%D1%8B%D1%87%D1%81%D0%BA%D0%B8%D0%B9_%D0%B7%D0%B0%D0%BF%D0%BE%D0%B2%D0%B5%D0%B4%D0%BD%D0%B8%D0%BA._%D0%9B%D0%B5%D1%81%D0%BD%D0%BE%D0%B5_%D0%BE%D0%B7%D0%B5%D1%80%D0%BE_MG_8702.jpg",
    "w": 5114,
    "h": 3408
  },
  "pechora-city": {
    "pos": "center 45%",
    "src": "/photos/pechora-city.jpg",
    "caption": "Печора с высоты",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFA//EABYBAQEBAAAAAAAAAAAAAAAAAAACA//aAAwDAQACEAMQAAAAqLy3NJ1EA//EACMQAAIBAgQHAAAAAAAAAAAAAAECAwARFDFSoQQFEhMyQrH/2gAIAQEAAT8Ak4mRT0lQDWMJ071iTqXepOZkkCN3kIGdgBTtC6Snu+Kglhk1/UUrQPa5+1//xAAVEQEBAAAAAAAAAAAAAAAAAAAAEf/aAAgBAgEBPwBX/8QAFREBAQAAAAAAAAAAAAAAAAAAABH/2gAIAQMBAT8AR//Z",
    "alt": "Город Печора с высоты зимой",
    "author": "k0k00rt",
    "license": "CC BY-SA 3.0",
    "page": "https://commons.wikimedia.org/wiki/File:Russia,_Komi,_Pechora_WMID6256736_719.jpg",
    "w": 2048,
    "h": 1365
  },
  "tundra": {
    "src": "/photos/tundra.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAASABgDASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAIGAQMFB//EABcBAAMBAAAAAAAAAAAAAAAAAAABAgP/2gAMAwEAAhADEAAAAO+os5u/vPicMGdawH//xAAgEAABBAEEAwAAAAAAAAAAAAABAAIDIRIQEUJhE3GR/9oACAEBAAE/AMY3dH2vCAakG3ZUcwYC2jug+Q8gs3ii8p0hHI/dGE1acTmbX//EABoRAAICAwAAAAAAAAAAAAAAAAABAxMxUWL/2gAIAQIBAT8AcreUWcmxH//EABoRAQABBQAAAAAAAAAAAAAAAAEAAxARElH/2gAIAQMBAT8AKYGBmh2zP//Z",
    "alt": "Большеземельская тундра осенью",
    "author": "APL",
    "license": "CC BY-SA 3.0",
    "page": "https://commons.wikimedia.org/wiki/File:Bolshezemelskaja_tundra_1.JPG",
    "w": 2272,
    "h": 1704
  },
  "ski-valley": {
    "src": "/photos/ski-valley.jpg",
    "blur": "data:image/jpeg;base64,/9j/2wBDABISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////2wBDARISEhITEhQWFhQcHhseHCkmIiImKT4sMCwwLD5eO0U7O0U7XlNlUk1SZVOWdmhodpatkYqRrdK8vNL/+///////wgARCAAQABgDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAQBAgP/xAAVAQEBAAAAAAAAAAAAAAAAAAACA//aAAwDAQACEAMQAAAAcditZsmAH//EACAQAAEFAAEFAQAAAAAAAAAAAAIAAQMEEVMTFDJCUZH/2gAIAQEAAT8Ajkra+HuJpq4t5IL0AeroIoeMfxdOu8jsUQbvxl2lPgBf/8QAGBEAAgMAAAAAAAAAAAAAAAAAAAESIlH/2gAIAQIBAT8Ak2Vw/8QAGBEAAgMAAAAAAAAAAAAAAAAAAAESIVH/2gAIAQMBAT8AikXp/9k=",
    "alt": "Лыжня в долине Манараги, Приполярный Урал",
    "author": "Aysa t",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:%D0%9B%D1%8B%D0%B6%D0%BD%D1%8F_%D0%B2_%D0%B4%D0%BE%D0%BB%D0%B8%D0%BD%D0%B5_%D0%9C%D0%B0%D0%BD%D0%B0%D1%80%D0%B0%D0%B3%D0%B8_1.jpg",
    "w": 5760,
    "h": 3840
  }
};

/** Уникальные авторы для подписи в подвале (визуализации холдинга — не в счёт) */
export const PHOTO_CREDITS = Object.values(PHOTOS).filter((p) => !p.render).reduce((acc, p) => {
  const found = acc.find((c) => c.author === p.author);
  if (found) { if (!found.pages.includes(p.page)) found.pages.push(p.page); }
  else acc.push({ author: p.author, license: p.license, pages: [p.page] });
  return acc;
}, []);

/** Поиск по пути файла — для секций, где фото задано строкой (InfoData, landmarks). */
const BY_SRC = Object.fromEntries(Object.values(PHOTOS).map((p) => [p.src, p]));
export const photoBySrc = (src) => BY_SRC[src];
