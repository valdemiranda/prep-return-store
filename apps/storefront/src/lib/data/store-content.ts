import { sdk } from "@lib/config"

export type HeroContent = {
  backgroundImage: string
  imageAlt: string
  primaryCtaLabel: string
  primaryCtaLink: string
  primaryCtaIcon?: string
  secondaryCtaLabel: string
  secondaryCtaLink: string
  secondaryCtaIcon?: string
  ctaPosition?: string
}

export type PromotionalBanner = {
  image: string
  ctaLink: string
  accessibilityLabel: string
}

export type StoreContent = {
  hero: HeroContent
  promotionalBanners: PromotionalBanner[]
  staticPages: Record<string, string>
}

export const DEFAULT_STORE_CONTENT: StoreContent = {
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
    aboutUs:
      "<h1>About Us</h1><p>Learn more about our store and what we stand for.</p>",
  },
}

export const getStoreContent = async (): Promise<StoreContent | null> => {
  return sdk.client
    .fetch<{ store_content: StoreContent }>("/store/store-content", {
      cache: "no-store",
    })
    .then(({ store_content }) => store_content)
    .catch((error) => {
      console.error("Failed to load store content", error)
      return DEFAULT_STORE_CONTENT
    })
}
