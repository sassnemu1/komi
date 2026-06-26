"use client";

import Link from "next/link";
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
  statLabel = "Projects",
  secondaryStatLabel,
  secondaryStatValue,
  worksCtaLabel = "See all work",
  worksCtaHref = "/work",
  showWorksCta = true,
  showStats = true,
}) {
  return (
    <div className="services__detail" ref={detailRef} style={{ display: "none" }}>

      {/* Left panel: portfolio */}
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
            <Link href={worksCtaHref} className="detail__all-btn">
              {worksCtaLabel}
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Right panel: expanded card (desktop only, hidden via CSS on mobile) */}
      <DetailCardPanel detailCardRef={detailCardRef} service={selectedService} />
    </div>
  );
}