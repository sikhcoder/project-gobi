import type { CeremonyType, Tradition, VendorCategory, TemplateTheme } from "./types";

export const CEREMONY_COLORS: Record<string, string> = {
  mehndi: "#D4537E",
  haldi: "#EF9F27",
  sangeet: "#1D9E75",
  baraat: "#534AB7",
  wedding: "#534AB7",
  reception: "#D85A30",
  chunni: "#7F77DD",
  vatna: "#EF9F27",
  "anand-karaj": "#534AB7",
  nikah: "#534AB7",
  custom: "#888888",
};

export const VENDOR_CATEGORIES: { value: VendorCategory; label: string }[] = [
  { value: "photography", label: "Photography & Film" },
  { value: "catering", label: "Catering" },
  { value: "decor", label: "Decor & Florals" },
  { value: "hair-makeup", label: "Hair & Makeup" },
  { value: "mehndi-artist", label: "Mehndi Artist" },
  { value: "pandit-officiant", label: "Pandit & Officiant" },
  { value: "music-entertainment", label: "Music & Entertainment" },
  { value: "invitations", label: "Invitations & Stationery" },
  { value: "attire-jewellery", label: "Attire & Jewellery" },
  { value: "transportation", label: "Transportation" },
];

export const TRADITIONS: { value: Tradition; label: string }[] = [
  { value: "hindu", label: "Hindu" },
  { value: "sikh", label: "Sikh" },
  { value: "muslim", label: "Muslim" },
  { value: "christian", label: "Christian" },
  { value: "jain", label: "Jain" },
  { value: "south-indian", label: "South Indian" },
];

export const CEREMONY_PRESETS: Record<Tradition, CeremonyType[]> = {
  hindu: ["mehndi", "haldi", "sangeet", "baraat", "wedding", "reception"],
  sikh: ["chunni", "mehndi", "vatna", "sangeet", "anand-karaj", "reception"],
  muslim: ["mehndi", "nikah", "reception"],
  christian: ["mehndi", "sangeet", "wedding", "reception"],
  jain: ["mehndi", "haldi", "sangeet", "wedding", "reception"],
  "south-indian": ["mehndi", "haldi", "sangeet", "wedding", "reception"],
};

export const CEREMONY_LABELS: Record<CeremonyType, string> = {
  mehndi: "Mehndi",
  haldi: "Haldi",
  sangeet: "Sangeet",
  baraat: "Baraat",
  wedding: "Wedding Ceremony",
  reception: "Reception",
  chunni: "Chunni / Kurmai",
  vatna: "Vatna",
  "anand-karaj": "Anand Karaj",
  nikah: "Nikah",
  custom: "Custom Ceremony",
};

export const TEMPLATE_THEMES: TemplateTheme[] = [
  { id: "mughal", name: "Mughal", bgColor: "#2C1A4E", textColor: "#E8D5B7" },
  { id: "dravidian", name: "Dravidian", bgColor: "#1A2E1A", textColor: "#D4E8C4" },
  { id: "minimalist", name: "Minimalist", bgColor: "#F5F0EB", textColor: "#3C3489" },
  { id: "vibrant", name: "Vibrant Maximalist", bgColor: "#7B1F3A", textColor: "#FFD700" },
];

export const DASHBOARD_TABS = [
  { label: "Overview", href: "/dashboard" },
  { label: "Guests", href: "/dashboard/guests" },
  { label: "Vendors", href: "/dashboard/vendors" },
  { label: "Budget", href: "/dashboard/budget" },
  { label: "Timeline", href: "/dashboard/timeline" },
  { label: "Registry", href: "/dashboard/registry" },
  { label: "Your site", href: "/dashboard/site" },
];
