/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    // Next 16 отдаёт 400 на любое quality вне этого списка; в компонентах
    // используются 70–78 (hero, интерлюдии, плитки, достопримечательности).
    qualities: [70, 72, 74, 75, 76, 78],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
