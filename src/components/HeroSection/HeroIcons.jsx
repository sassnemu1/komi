// Иконки боковых рельсов hero — свои, монолинейные, в северной пластике
// сайта: острые углы, ромбы орнамента коми, без заливок. Сетка 24×24,
// штрих 1.6, скруглённые концы. Каждая — про свой раздел:
//   compass — карта районов, tree — мифология (мировое древо), pillars —
//   Маньпупунёр, izba — отели, bowl — рестораны, sun — впечатления
//   (шондi, солнечный знак), chum — кемпинг, mark — «Сделано в Коми»
//   (ромб-перна), sled — снегоход, taxi — такси.

function Svg({ children, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconCompass = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 5.5 14.2 12 12 18.5 9.8 12Z" />
    <path d="M5.5 12h2.3M16.2 12h2.3" />
  </Svg>
);

export const IconTree = () => (
  <Svg>
    <path d="M12 21V6" />
    <path d="M12 6 10 4l2-2 2 2Z" />
    <path d="M12 9.5 8.6 7.2M12 9.5l3.4-2.3M12 13.5 7.8 10.8M12 13.5l4.2-2.7M12 17.5 7 14.4M12 17.5l5-3.1" />
    <path d="M8.5 21h7" />
  </Svg>
);

export const IconPillars = () => (
  <Svg>
    <path d="M4 20h16" />
    <path d="M6.5 20V9.5l1.2-2 1.3 2V20" />
    <path d="M11 20V6l1-2 1 2v14" />
    <path d="M15.6 20v-8.5l1.2-1.8 1.2 1.8V20" />
  </Svg>
);

export const IconIzba = () => (
  <Svg>
    <path d="M3.5 11 12 4l8.5 7" />
    <path d="M5.5 10v10h13V10" />
    <path d="M12 13.2l2 2-2 2-2-2Z" />
    <path d="M9.5 20v-2.6M14.5 20v-2.6" />
  </Svg>
);

export const IconBowl = () => (
  <Svg>
    <path d="M4 12h16c0 3.6-2.5 6.2-6 6.8V20H10v-1.2c-3.5-.6-6-3.2-6-6.8Z" />
    <path d="M9.5 9c0-1.2 1-1.4 1-2.5S9.5 5 9.5 4M14.5 9c0-1.2 1-1.4 1-2.5S14.5 5 14.5 4" />
  </Svg>
);

export const IconSun = () => (
  <Svg>
    <path d="M12 9.2 14.8 12 12 14.8 9.2 12Z" />
    <path d="M12 2.5v3.6M12 17.9v3.6M2.5 12h3.6M17.9 12h3.6" />
    <path d="M5.3 5.3l2.5 2.5M16.2 16.2l2.5 2.5M18.7 5.3l-2.5 2.5M7.8 16.2l-2.5 2.5" />
  </Svg>
);

export const IconChum = () => (
  <Svg>
    <path d="M4 20 11.2 5.5M20 20 12.8 5.5" />
    <path d="M9.6 3.2 12 7.5l2.4-4.3" />
    <path d="M3 20h18" />
    <path d="M12 20v-5.5l-2 2.2M12 14.5l2 2.2" />
  </Svg>
);

export const IconMark = () => (
  <Svg>
    <path d="M12 3 21 12l-9 9-9-9Z" />
    <path d="M12 7.8 16.2 12 12 16.2 7.8 12Z" />
    <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21" />
  </Svg>
);

export const IconSled = () => (
  <Svg>
    <path d="M3.5 17.5h4a3 3 0 0 0 0-6H6" />
    <path d="M9.5 11.5h6.8a3 3 0 0 1 2.9 2.2l.8 2.8h-13" />
    <path d="M10.5 11.5 12 8h4.5" />
    <path d="M2.5 20h19" />
    <circle cx="8" cy="18.5" r="1.4" />
    <circle cx="16" cy="18.5" r="1.4" />
  </Svg>
);

export const IconTaxi = () => (
  <Svg>
    <path d="M4 16.5V13l2-4.5h12l2 4.5v3.5" />
    <path d="M3 13h18" />
    <path d="M6.5 16.5v2M17.5 16.5v2" />
    <path d="M7.5 15h1M15.5 15h1" />
    <path d="M10 8.5V6.2h4v2.3" />
  </Svg>
);
