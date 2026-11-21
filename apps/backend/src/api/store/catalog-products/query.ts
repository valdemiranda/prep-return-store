import { MedusaContainer } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  QueryContext,
} from "@medusajs/framework/utils";

import { getProductFilters } from "./filters";
import { CatalogParams } from "./params";
import {
  getPriceBounds,
  matchesPrice,
  matchesSale,
  sortSummaries,
} from "./pricing";
import { listSalesChannelProductIds } from "./sales-channels";
import { scanProductSummaries } from "./scan";

const NEW_ARRIVALS_LIMIT = 50;

type CatalogResult = {
  product_ids: string[];
  count: number;
  offset: number;
  limit: number;
  price_bounds: { min: number; max: number } | null;
};

async function getPricingContext(query: any, regionId?: string) {
  if (!regionId) {
    return;
  }

  const { data } = await query.graph(
    {
      entity: "region",
      fields: ["id", "currency_code"],
      filters: { id: regionId },
      pagination: { take: 1, skip: 0 },
    },
    { cache: { enable: true } },
  );

  const region = data[0];
  return region
    ? { region_id: region.id, currency_code: region.currency_code }
    : undefined;
}

async function listIndexed(
  query: any,
  filters: any,
  params: CatalogParams,
  salesChannelIds: string[],
) {
  const pricingContext = await getPricingContext(query, params.regionId);
  const context = pricingContext
    ? { variants: { calculated_price: QueryContext(pricingContext) } }
    : undefined;
  const summaries = await scanProductSummaries(query, {
    filters,
    context,
    maxScan: params.newArrivals ? NEW_ARRIVALS_LIMIT : Infinity,
    salesChannelIds,
  });

  const stocked = summaries.filter((product) => product.hasStock);
  const saleMatched = stocked.filter((product) =>
    matchesSale(product, params.sale),
  );
  const priceMatched = saleMatched.filter((product) =>
    matchesPrice(product, params.price),
  );
  const sorted = sortSummaries(priceMatched, params.sortBy);

  return {
    product_ids: sorted
      .slice(params.offset, params.offset + params.limit)
      .map((product) => product.id),
    count: sorted.length,
    offset: params.offset,
    limit: params.limit,
    price_bounds: getPriceBounds(saleMatched),
  };
}

export async function listCatalogProducts(
  container: MedusaContainer,
  params: CatalogParams,
  salesChannelIds: string[],
): Promise<CatalogResult> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const productIds = await listSalesChannelProductIds(query, salesChannelIds);
  const filters = getProductFilters(params, productIds);

  return listIndexed(query, filters, params, salesChannelIds);
}
