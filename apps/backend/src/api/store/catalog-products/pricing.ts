import { CatalogParams } from "./params";

const priceRanges: Record<string, [number, number]> = {
  "0-500": [0, 500],
  "500-1500": [500, 1500],
  "1500-3000": [1500, 3000],
  "3000-infinite": [3000, Infinity],
};

export type ProductSummary = {
  id: string;
  createdAt: string;
  minPrice: number | null;
  isSale: boolean;
  hasStock: boolean;
};

type Price = {
  calculated_amount?: number;
  calculated_price?: { price_list_type?: string | null };
  price_list_type?: string | null;
};

const isSalePrice = (price?: Price | null) =>
  price?.calculated_price?.price_list_type === "sale" ||
  price?.price_list_type === "sale";

function hasAvailableStock(product: any) {
  return (product.variants ?? []).some((variant: any) => {
    if (variant.allow_backorder || !variant.manage_inventory) {
      return true;
    }

    return Number(variant.inventory_quantity ?? 0) > 0;
  });
}

export function summarizeProduct(product: any): ProductSummary {
  let minPrice: number | null = null;
  let isSale = false;

  for (const variant of product.variants ?? []) {
    const price = variant.calculated_price as Price | undefined;
    const amount = Number(price?.calculated_amount);

    if (Number.isFinite(amount)) {
      minPrice = minPrice === null ? amount : Math.min(minPrice, amount);
    }

    isSale ||= isSalePrice(price);
  }

  return {
    id: product.id,
    createdAt: product.created_at,
    minPrice,
    isSale,
    hasStock: hasAvailableStock(product),
  };
}

export function matchesSale(
  product: ProductSummary,
  sale?: CatalogParams["sale"],
) {
  if (sale === "true") {
    return product.isSale;
  }

  if (sale === "false") {
    return product.minPrice !== null && !product.isSale;
  }

  return true;
}

export function matchesPrice(product: ProductSummary, price?: string) {
  if (!price || product.minPrice === null) {
    return !price;
  }

  if (price.includes("-") && !price.includes(",")) {
    const [minRaw, maxRaw] = price.split("-");
    const min = Number(minRaw);
    const max = maxRaw === "infinite" ? Infinity : Number(maxRaw);

    return (
      Number.isFinite(min) && product.minPrice >= min && product.minPrice <= max
    );
  }

  return price.split(",").some((bucket) => {
    const range = priceRanges[bucket];
    if (!range) {
      return false;
    }

    const [min, max] = range;
    return max === Infinity
      ? product.minPrice! > min
      : product.minPrice! > min && product.minPrice! <= max;
  });
}

export function getPriceBounds(products: ProductSummary[]) {
  const prices = products
    .map((product) => product.minPrice)
    .filter((price): price is number => price !== null);

  if (!prices.length) {
    return null;
  }

  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

export function sortSummaries(
  products: ProductSummary[],
  sortBy: CatalogParams["sortBy"],
) {
  return [...products].sort((a, b) => {
    if (sortBy === "price_asc" || sortBy === "price_desc") {
      const aPrice = a.minPrice ?? Infinity;
      const bPrice = b.minPrice ?? Infinity;
      return sortBy === "price_asc" ? aPrice - bPrice : bPrice - aPrice;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
