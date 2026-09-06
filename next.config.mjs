import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Явный корень: рядом лежат другие lockfile (домашняя папка), и без этого
  // Turbopack угадывает корень неверно и предупреждает на каждом запуске.
  turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) },
  images: {
    // Next 16 отдаёт 400 на любое quality вне этого списка; в компонентах
    // используются 70–78 (hero, интерлюдии, плитки, достопримечательности).
    qualities: [70, 72, 74, 75, 76, 78],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
