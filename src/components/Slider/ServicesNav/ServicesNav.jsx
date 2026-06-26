"use client";

export default function ServicesNav({ navRef, total, activeIndex, onPrev, onNext, onDotClick }) {
  const fillPercent = total > 1 ? (activeIndex / (total - 1)) * 100 : 100;

  return (
    <div className="services__nav-row" ref={navRef}>
      <button
        type="button"
        className="services__arrow"
        onClick={onPrev}
        disabled={activeIndex === 0}
        aria-label="Предыдущий слайд"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9.5 2L4 7l5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Прогресс-трек с кликабельными сегментами */}
      <div className="services__progress-track" aria-hidden="true">
        <div
          className="services__progress-fill"
          style={{ width: `${fillPercent}%` }}
        />
        <div className="services__progress-segments">
          {Array.from({ length: total }).map((_, i) => (
            <button
              type="button"
              key={i}
              className="services__progress-seg"
              onClick={() => onDotClick(i)}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Счётчик текущий / общий */}
      <span className="services__nav-counter">
        {String(activeIndex + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(total).padStart(2, "0")}
      </span>

      <button
        type="button"
        className="services__arrow"
        onClick={onNext}
        disabled={activeIndex === total - 1}
        aria-label="Следующий слайд"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M4.5 2L10 7l-5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}