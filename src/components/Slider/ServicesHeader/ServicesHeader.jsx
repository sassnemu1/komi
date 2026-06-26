"use client";

export default function ServicesHeader({ titleRef, counterRef, total, current, title, desc }) {
  return (
    <div className="services__header">
      <div className="services__meta">
        <div className="services__title" ref={titleRef}>
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