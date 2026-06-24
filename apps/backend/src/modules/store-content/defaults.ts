export const CTA_POSITIONS = [
  "none",
  "left-top",
  "left-center",
  "left-bottom",
  "center-top",
  "center",
  "center-bottom",
  "right-top",
  "right-center",
  "right-bottom",
] as const;

export type HeroCtaPosition = (typeof CTA_POSITIONS)[number];

export type StoreContentData = {
  hero: {
    backgroundImage: string;
    imageAlt: string;
    primaryCtaLabel: string;
    primaryCtaLink: string;
    primaryCtaIcon?: string;
    secondaryCtaLabel: string;
    secondaryCtaLink: string;
    secondaryCtaIcon?: string;
    ctaPosition?: HeroCtaPosition;
  };
  promotionalBanners: {
    image: string;
    ctaLink: string;
    accessibilityLabel: string;
  }[];
  staticPages: {
    termsOfUse: string;
    privacy: string;
    returnPolicy: string;
  };
};

export const DEFAULT_STORE_CONTENT: StoreContentData = {
  hero: {
    backgroundImage: "",
    imageAlt: "",
    primaryCtaLabel: "Shop Deals",
    primaryCtaLink: "/store?sale=true",
    primaryCtaIcon: "tag",
    secondaryCtaLabel: "New Arrivals",
    secondaryCtaLink: "/store?new_arrivals=true",
    secondaryCtaIcon: "sparkles",
    ctaPosition: "left-center",
  },
  promotionalBanners: [],
  staticPages: {
    termsOfUse:
      "<h1>Terms of Use</h1><p>Review the terms that govern purchases from our store.</p>",
    privacy:
      "<h1>Privacy</h1><p>Learn how we collect, use, and protect customer information.</p>",
    returnPolicy:
      "<h1>Return Policy</h1><p>Review eligibility and instructions for returns.</p>",
  },
};
