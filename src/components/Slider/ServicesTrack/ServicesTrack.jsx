"use client";

import ServiceCard from "../ServiceCard/ServiceCard";

export default function ServicesTrack({
  viewportRef,
  trackRef,
  services,
  activeIndex,
  cardRefs,
  onCardClick,
  ctaLabel,
  dragHandlers,
}) {
  return (
    <div className="services__track-outer" ref={viewportRef}>
      <div
        className="services__track"
        ref={trackRef}
        onPointerDown={dragHandlers.onPointerDown}
        onPointerMove={dragHandlers.onPointerMove}
        onPointerUp={dragHandlers.onPointerUp}
        onPointerCancel={dragHandlers.onPointerUp}
        onDragStart={(e) => e.preventDefault()}
      >
        {services.map((item, index) => (
          <ServiceCard
            key={item.id}
            item={item}
            isActive={activeIndex === index}
            ctaLabel={ctaLabel}
            ref={(el) => { cardRefs.current[index] = el; }}
            onClick={() => onCardClick(item, cardRefs.current[index])}
          />
        ))}
      </div>
    </div>
  );
}
