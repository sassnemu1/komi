"use client";

export default function DetailHeader({
  closeBtnRef,
  onClose,
  service,
  statLabel = "Позиций",
  secondaryStatLabel,
  secondaryStatValue,
  showStats = false,
}) {
  const hasSecondary = Boolean(secondaryStatValue);

  return (
    <div className="detail__portfolio-header">
      <div className="detail__header-top">
        <button className="detail__close" ref={closeBtnRef} onClick={onClose} aria-label="Закрыть">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        {service && <span className="detail__portfolio-tag">{service.tag}</span>}
      </div>

      {service && (
        <div className="detail__portfolio-meta">
          <h3 className="detail__portfolio-title">{(service.title ?? "").replace("\n", " ")}</h3>

          {(service.badge || service.location) && (
            <div className="detail__portfolio-chips">
              {service.badge && <span className="card__badge">{service.badge}</span>}
              {service.location && <span className="card__location">{service.location}</span>}
            </div>
          )}

          {service.desc && <p className="detail__portfolio-sub">{service.desc}</p>}

          {service.href && (
            <a
              className="detail__all-btn detail__site-link"
              href={service.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Перейти на сайт
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 9L9 3M4.5 3H9v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          )}

          {showStats && (
            <div className="detail__portfolio-stats">
              <span className="detail__stat">
                <span className="detail__stat-num">{service.works?.length ?? 0}</span>
                <span className="detail__stat-label">{statLabel}</span>
              </span>
              {hasSecondary && (
                <>
                  <span className="detail__stat-divider" />
                  <span className="detail__stat">
                    <span className="detail__stat-num">{secondaryStatValue}</span>
                    {secondaryStatLabel && (
                      <span className="detail__stat-label">{secondaryStatLabel}</span>
                    )}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
