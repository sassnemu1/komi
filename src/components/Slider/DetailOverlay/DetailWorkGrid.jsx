"use client";

const initialOf = (name = "") => name.replace(/^[«"'\s]+/, "").charAt(0);

export default function DetailWorkGrid({ works, serviceId, workItemRefs }) {
  return (
    <div className="detail__work-grid">
      {works.map((work, i) => {
        const hasImage = Boolean(work.image);
        const isLink   = Boolean(work.href);
        const Tag      = isLink ? "a" : "div";
        const tagProps = isLink
          ? { href: work.href, target: "_blank", rel: "noopener noreferrer" }
          : {};
        const title = (work.title ?? "").replace("\n", " ");
        const visualStyle = hasImage
          ? { backgroundImage: `url(${work.image})` }
          : work.thumbBg
            ? { background: work.thumbBg }
            : undefined;

        return (
          <Tag
            {...tagProps}
            className={`detail__work-card${hasImage ? "" : " detail__work-card--poster"}`}
            key={`${serviceId}-${work.href ?? i}`}
            ref={(el) => { workItemRefs.current[i] = el; }}
          >
            <div className="detail__work-card-img" style={visualStyle}>
              {hasImage ? (
                <div className="detail__work-card-img-inner" style={visualStyle} />
              ) : (
                <>
                  <div className="card__ornament" aria-hidden="true" />
                  <span className="card__poster-letter" aria-hidden="true">{initialOf(title)}</span>
                </>
              )}
              {work.sub && <span className="detail__work-card-tag">{work.sub}</span>}
              {work.year && <span className="detail__work-card-year-badge">{work.year}</span>}
            </div>

            <div className="detail__work-card-body">
              <div className="detail__work-card-info">
                <span className="detail__work-card-title">{title}</span>
                {(work.badge || work.location) ? (
                  <span className="detail__work-card-chips">
                    {work.badge && <span className="card__badge">{work.badge}</span>}
                    {work.location && <span className="card__location">{work.location}</span>}
                  </span>
                ) : (
                  work.sub && <span className="detail__work-card-sub">{work.sub}</span>
                )}
              </div>
              {isLink && (
                <div className="detail__work-card-arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          </Tag>
        );
      })}
    </div>
  );
}
