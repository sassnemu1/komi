"use client";

// Заголовок слайдера в общем паттерне секций сайта:
// eyebrow «Республика Коми · <tag>» → линия 64×1px → h2 → lead.
export default function ServicesHeader({ titleRef, counterRef, total, current, tag, title, desc }) {
  return (
    <div className="services__header">
      <div className="services__meta">
        <div className="services__title" ref={titleRef}>
          {tag && (
            <span className="services__eyebrow">
              Республика Коми &nbsp;·&nbsp; {tag}
            </span>
          )}
          <span className="services__title-line" aria-hidden="true" />
          <h2>{title}</h2>
          {desc && (
            <span className="services__title-sub">{desc}</span>
          )}
        </div>
      </div>

      <div className="services__counter" ref={counterRef}>
        <span className="services__current">{String(current).padStart(2, "0")}</span>
        <span className="services__total">/ {String(total).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
