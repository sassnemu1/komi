"use client";

import { forwardRef } from "react";

const ServiceCard = forwardRef(function ServiceCard({ item, isActive, onClick, ctaLabel = "Подробнее" }, ref) {
  const hasImage = Boolean(item.image);

  return (
    <div
      className={`serviceCard${isActive ? " serviceCard--active" : ""}${hasImage ? "" : " serviceCard--poster"}`}
      ref={ref}
      style={{ "--card-color": item.color }}
      onClick={onClick}
    >
      <div
        className="serviceCard__bg-img"
        style={
          hasImage
            ? { backgroundImage: `url(${item.image})` }
            : { background: item.thumbBg || `linear-gradient(150deg, ${item.color} 0%, #05070f 78%)` }
        }
      >
        {!hasImage && <div className="card__ornament" aria-hidden="true" />}
      </div>

      <div className="serviceCard__top">
        <span className="serviceCard__id">{item.id}</span>
        <span className="serviceCard__tag">{item.tag}</span>
      </div>

      <div className="serviceCard__bg-num">{item.id}</div>
      <div className="serviceCard__line" />

      <div className="serviceCard__content">
        {(item.badge || item.location) && (
          <div className="serviceCard__meta">
            {item.badge && <span className="card__badge">{item.badge}</span>}
            {item.location && <span className="card__location">{item.location}</span>}
          </div>
        )}
        <h3 className="serviceCard__title">
          {(item.title ?? "").split("\n").map((line, li) => (
            <span key={li} style={{ display: "block" }}>{line}</span>
          ))}
        </h3>
        {item.desc && <p className="serviceCard__desc">{item.desc}</p>}
      </div>

      <div className="serviceCard__cta">
        <span>{ctaLabel}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
});

export default ServiceCard;
