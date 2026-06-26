"use client";

export default function DetailCardPanel({ detailCardRef, service }) {
  return (
    <div
      className="detail__card"
      ref={detailCardRef}
      style={service ? { "--card-color": service.color } : {}}
    >
      {service && (
        <>
          <div
            className="detail__card-bg-img"
            style={
              service.image
                ? { backgroundImage: `url(${service.image})` }
                : { background: `linear-gradient(160deg, ${service.color} 0%, #05070f 80%)` }
            }
          />

          <div className="serviceCard__top">
            <span className="serviceCard__id">{service.id}</span>
            <span className="serviceCard__tag">{service.tag}</span>
          </div>

          <div className="serviceCard__bg-num" style={{ fontSize: "14rem", opacity: 0.05 }}>
            {service.id}
          </div>

          <div className="serviceCard__line" style={{ transform: "scaleX(1)" }} />

          <div className="serviceCard__content">
            <h3 className="serviceCard__title" style={{ fontSize: "3rem" }}>
              {service.title.split("\n").map((line, li) => (
                <span key={li} style={{ display: "block" }}>{line}</span>
              ))}
            </h3>
            <p className="serviceCard__desc" style={{ fontSize: "1rem", maxWidth: "none" }}>
              {service.desc}
            </p>
          </div>
        </>
      )}
    </div>
  );
}