"use client";

import Link from "next/link";

export default function DetailWorkGrid({ works, serviceId, workItemRefs }) {
  return (
    <div className="detail__work-grid">
      {works.map((work, i) => {
        const Tag = work.slug ? Link : "div";
        const tagProps = work.slug ? { href: `/work/${work.slug}` } : {};

        return (
          <Tag
            {...tagProps}
            className="detail__work-card"
            key={`${serviceId}-${i}`}
            ref={(el) => { workItemRefs.current[i] = el; }}
          >
            <div
              className="detail__work-card-img"
              style={work.image ? { backgroundImage: `url(${work.image})` } : { background: work.thumbBg }}
            >
              <div
                className="detail__work-card-img-inner"
                style={work.image ? { backgroundImage: `url(${work.image})` } : { background: work.thumbBg }}
              />
              <span className="detail__work-card-tag">{work.sub}</span>
              <span className="detail__work-card-year-badge">{work.year}</span>
            </div>

            <div className="detail__work-card-body">
              <div className="detail__work-card-info">
                <span className="detail__work-card-title">{work.title}</span>
                <span className="detail__work-card-sub">{work.sub}</span>
              </div>
              {work.slug && (
                <div className="detail__work-card-arrow">
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