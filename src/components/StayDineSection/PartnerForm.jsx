"use client";

import { useState } from "react";
import styles from "./StayDineSection.module.css";

// Форма партнёрства без сервера: собирает письмо и открывает почтовый
// клиент (mailto на info@komi.world). Ничего не отправляется само и
// нигде не хранится — это честно сказано под кнопкой.
const TYPES = ["Отель", "Гостевой дом", "Глэмпинг / база", "Ресторан", "Кафе", "Другое"];

export default function PartnerForm() {
  const [type, setType] = useState(TYPES[0]);

  const onSubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const place = String(f.get("place") || "").trim();
    const contact = String(f.get("contact") || "").trim();
    const note = String(f.get("note") || "").trim();
    const subject = `Партнёрство komi.world: ${type}${name ? ` «${name}»` : ""}`;
    const body = [
      `Объект: ${name || "—"}`,
      `Тип: ${type}`,
      `Город / район: ${place || "—"}`,
      `Контакт: ${contact || "—"}`,
      "",
      note,
    ].join("\n");
    window.location.href = `mailto:info@komi.world?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formRow}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Объект</span>
          <input className={styles.input} name="name" placeholder="Название отеля или ресторана" autoComplete="organization" />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Тип</span>
          <select className={styles.input} name="type" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
      </div>
      <div className={styles.formRow}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Город или район</span>
          <input className={styles.input} name="place" placeholder="Сыктывкар, Якша, Ухта…" />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Как связаться</span>
          <input className={styles.input} name="contact" placeholder="Почта или телефон" autoComplete="email" />
        </label>
      </div>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Пара слов о вас</span>
        <textarea className={`${styles.input} ${styles.textarea}`} name="note" rows={3} placeholder="Сколько номеров или мест, чем гордитесь, ссылка на страницу" />
      </label>
      <div className={styles.formFoot}>
        <button type="submit" className={styles.submit}>
          Написать нам <span aria-hidden="true">→</span>
        </button>
        <span className={styles.formNote}>
          Письмо откроется в вашей почте на info@komi.world — без регистрации, ничего не сохраняется на сайте.
        </span>
      </div>
    </form>
  );
}
