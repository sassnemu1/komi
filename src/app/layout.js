import "./globals.css";

const SITE = "https://komi.world";

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

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
