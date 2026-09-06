import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll/SmoothScroll";

const SITE = "https://komi.world";
const MAP_URL = "https://map.komi.world";

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Республика Коми — komi.world",
    template: "%s · komi.world",
  },
  description:
    "Республика Коми: интерактивная карта районов, мифология и предания, достопримечательности, отели и рестораны, впечатления, кемпинг, местные бренды, аренда транспорта и такси.",
  keywords: [
    "Республика Коми", "Коми", "Сыктывкар", "Маньпупунёр", "Югыд ва",
    "мифология коми", "туризм Коми", "карта Коми", "komi.world",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE,
    siteName: "komi.world",
    title: "Республика Коми — komi.world",
    description:
      "Интерактивная карта, предания, достопримечательности, отели, рестораны и местные бренды Республики Коми.",
  },
  alternates: { canonical: SITE },
};

export const viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
};

// ─── JSON-LD ──────────────────────────────────────────────────────
const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "УК «Велес И К»",
  alternateName: "komi.world",
  url: SITE,
  email: "info@komi.world",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Сыктывкар",
    addressRegion: "Республика Коми",
    addressCountry: "RU",
  },
  sameAs: [MAP_URL],
};

const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  name: "komi.world",
  alternateName: "Республика Коми — komi.world",
  url: SITE,
  inLanguage: "ru-RU",
  description:
    "Портал Республики Коми: карта районов, мифология и предания, достопримечательности, отели, рестораны и местные бренды.",
  publisher: { "@id": `${SITE}/#organization` },
};

// Экранируем «<», чтобы содержимое JSON не могло закрыть тег <script>
function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <SmoothScroll />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(ORGANIZATION_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(WEBSITE_LD) }}
        />
      </body>
    </html>
  );
}
