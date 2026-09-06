"use client";

import DetailHeader from "./DetailHeader";
import DetailWorkGrid from "./DetailWorkGrid";
import DetailCardPanel from "./DetailCardPanel";

export default function DetailOverlay({
  detailRef,
  portfolioRef,
  detailCardRef,
  closeBtnRef,
  workItemRefs,
  selectedService,
  onClose,
  onWorksCta,
  statLabel = "Позиций",
  secondaryStatLabel,
  secondaryStatValue,
  worksCtaLabel = "Связаться с нами",
  worksCtaHref = "#contacts",
  showWorksCta = false,
  showStats = false,
}) {
  const handleCta = (e) => {
    // Якорь на этой же странице: закрываем оверлей, снимаем scroll-lock,
    // и только потом скроллим (см. ServicesSlider.onWorksCta).
    if (onWorksCta && onWorksCta(worksCtaHref)) e.preventDefault();
  };

  return (
    <div
      className="services__detail"
      ref={detailRef}
      style={{ display: "none" }}
      role="dialog"
      aria-modal="true"
      aria-label={selectedService?.title?.replace("\n", " ") || "Подробнее"}
    >

      {/* Левая панель */}
      <div className="detail__portfolio" ref={portfolioRef}>
        <DetailHeader
          closeBtnRef={closeBtnRef}
          onClose={onClose}
          service={selectedService}
          statLabel={statLabel}
          secondaryStatLabel={secondaryStatLabel}
          secondaryStatValue={secondaryStatValue}
          showStats={showStats}
        />

        <DetailWorkGrid
          works={selectedService?.works ?? []}
          serviceId={selectedService?.id}
          workItemRefs={workItemRefs}
        />

        {showWorksCta && (
          <div className="detail__cta-row">
            <a href={worksCtaHref} className="detail__all-btn" onClick={handleCta}>
              {worksCtaLabel}
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Правая панель: раскрытая карточка (только десктоп, на мобайле скрыта CSS) */}
      <DetailCardPanel detailCardRef={detailCardRef} service={selectedService} />
    </div>
  );
}
