import Medusa from "@medusajs/js-sdk";

export const sdk = new Medusa({
  baseUrl: __BACKEND_URL__ ?? "/",
  auth: {
    type: __AUTH_TYPE__ ?? "session",
    jwtTokenStorageKey: __JWT_TOKEN_STORAGE_KEY__ || undefined,
  },
});

export interface HeroContent {
  backgroundImage: string;
  imageAlt: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  primaryCtaIcon?: string;
  secondaryCtaIcon?: string;
  secondaryCtaLabel: string;
  secondaryCtaLink: string;
  ctaPosition?: string;
}

export interface PromotionalBanner {
  image: string;
  ctaLink: string;
  accessibilityLabel: string;
}

export interface StaticPages {
  termsOfUse: string;
  privacy: string;
  returnPolicy: string;
}

export interface StoreContent {
  hero: HeroContent;
  promotionalBanners: PromotionalBanner[];
  staticPages: StaticPages;
}

export const getStoreContent = async (): Promise<StoreContent> => {
  const data = await sdk.client.fetch<{ store_content: StoreContent }>(
    "/admin/store-content",
  );
  return data.store_content;
};

export const updateStoreContent = async (
  storeContent: StoreContent,
): Promise<StoreContent> => {
  const data = await sdk.client.fetch<{ store_content: StoreContent }>(
    "/admin/store-content",
    {
      method: "PUT",
      body: { store_content: storeContent },
    },
  );
  return data.store_content;
};

export interface FreeShippingOption {
  id: string;
  name: string;
}

export interface FreeShippingConfig {
  shipping_option_id: string;
  threshold: number;
}

export interface FreeShippingState {
  currency_code: string;
  shipping_options: FreeShippingOption[];
  config: FreeShippingConfig | null;
}

export interface FreeShippingInput {
  shipping_option_id: string;
  threshold: number;
  enabled: boolean;
}

export const getFreeShipping = async (): Promise<FreeShippingState> => {
  const data = await sdk.client.fetch<{ free_shipping: FreeShippingState }>(
    "/admin/free-shipping",
  );
  return data.free_shipping;
};

export const updateFreeShipping = async (
  input: FreeShippingInput,
): Promise<FreeShippingState> => {
  const data = await sdk.client.fetch<{ free_shipping: FreeShippingState }>(
    "/admin/free-shipping",
    {
      method: "POST",
      body: input,
    },
  );
  return data.free_shipping;
};

export const uploadImage = async (file: File): Promise<string> => {
  const { files } = await sdk.admin.upload.create({ files: [file] });
  const uploaded = files[0];

  if (!uploaded?.url) {
    throw new Error("Upload finished without a file URL");
  }

  return uploaded.url;
};
