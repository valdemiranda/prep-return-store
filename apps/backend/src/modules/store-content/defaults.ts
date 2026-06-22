export type StoreContentData = {
  hero: {
    backgroundImage: string
    imageAlt: string
    eyebrow: string
    title: string
    subtitle: string
    primaryCtaLabel: string
    primaryCtaLink: string
    secondaryCtaLabel: string
    secondaryCtaLink: string
  }
  benefitCards: {
    icon: string
    title: string
    subtitle: string
  }[]
  promotionalBanners: {
    image: string
    ctaLink: string
    accessibilityLabel: string
  }[]
  staticPages: {
    termsOfUse: string
    privacy: string
    returnPolicy: string
  }
}

export const DEFAULT_STORE_CONTENT: StoreContentData = {
  hero: {
    backgroundImage: "",
    imageAlt: "",
    eyebrow: "WAREHOUSE DEALS",
    title: "Up to 70% OFF on Electronics & Home",
    subtitle:
      "Upgrade your space with wholesale pricing. New loads arriving daily direct from major retailers.",
    primaryCtaLabel: "Shop Deals",
    primaryCtaLink: "/store?sale=true",
    secondaryCtaLabel: "New Arrivals",
    secondaryCtaLink: "/store?new_arrivals=true",
  },
  benefitCards: [
    {
      icon: "truck",
      title: "Free Shipping",
      subtitle: "On orders over $50",
    },
    {
      icon: "shield-check",
      title: "Secure Payment",
      subtitle: "100% protected",
    },
    {
      icon: "headphones",
      title: "24/7 Support",
      subtitle: "Dedicated support",
    },
    {
      icon: "rotate-ccw",
      title: "Easy Returns",
      subtitle: "30-day returns",
    },
  ],
  promotionalBanners: [],
  staticPages: {
    termsOfUse:
      "<h1>Terms of Use</h1><p>Review the terms that govern purchases from our store.</p>",
    privacy:
      "<h1>Privacy</h1><p>Learn how we collect, use, and protect customer information.</p>",
    returnPolicy:
      "<h1>Return Policy</h1><p>Review eligibility and instructions for returns.</p>",
  },
}
