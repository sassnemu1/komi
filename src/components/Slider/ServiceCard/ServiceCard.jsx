"use client";

import { forwardRef } from "react";

const ServiceCard = forwardRef(function ServiceCard({ item, isActive, onClick, ctaLabel = "View work" }, ref) {
  return (
    <div
      className={`serviceCard${isActive ? " serviceCard--active" : ""}`}
      ref={ref}
      style={{ "--card-color": item.color }}
      onClick={onClick}
    >
      <div
        className="serviceCard__bg-img"
        style={
          item.image
            ? { backgroundImage: `url(${item.image})` }
            : { background: `linear-gradient(150deg, ${item.color} 0%, #05070f 78%)` }
        }
      />

      <div className="serviceCard__top">
        <span className="serviceCard__id">{item.id}</span>
        <span className="serviceCard__tag">{item.tag}</span>
      </div>

      <div className="serviceCard__bg-num">{item.id}</div>
      <div className="serviceCard__line" />

      <div className="serviceCard__content">
        <h3 className="serviceCard__title">
          {item.title.split("\n").map((line, li) => (
            <span key={li} style={{ display: "block" }}>{line}</span>
          ))}
        </h3>
        <p className="serviceCard__desc">{item.desc}</p>
      </div>

      <div className="serviceCard__cta">
        <span>{ctaLabel}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
});

export default ServiceCard;