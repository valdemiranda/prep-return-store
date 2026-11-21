import { HttpTypes } from "@medusajs/types"
import { SITE_NAME } from "@lib/constants/site"
import {
  getProductBrand,
  getProductCondition,
} from "@modules/products/utils/product-metadata"
import type { FeedContext } from "./google-merchant"
import { mapCondition, stripHtml } from "./xml"
import { formatCategoryPath, serializeCsv } from "./csv"
import {
  canFormVariantGroup,
  extractVariantDict,
  findOptionValue,
  isVariantInStock,
  resolveVariantImages,
  type VariantOptionDict,
} from "./openai-ads-variants"
import {
  buildItemTitle,
  OPENAI_ADS_FEED_COLUMNS,
  resolveUniqueItemId,
  resolveVariantGtin,
  resolveVariantPrices,
  type OpenAiAdsFeedRow,
} from "./openai-ads-schema"

export { OPENAI_ADS_FEED_COLUMNS } from "./openai-ads-schema"
export type { OpenAiAdsFeedColumn, OpenAiAdsFeedRow } from "./openai-ads-schema"

type PreparedVariant = {
  variant: HttpTypes.StoreProductVariant
  dict: VariantOptionDict
  primaryImage: string
  additionalImages: string[]
  price: string
  salePrice: string
}

const prepareVariants = (
  product: HttpTypes.StoreProduct,
  baseUrl: string,
): PreparedVariant[] => {
  const prepared: PreparedVariant[] = []
  for (const variant of product.variants ?? []) {
    const prices = resolveVariantPrices(variant)
    const images = resolveVariantImages(product, variant, baseUrl)
    if (!prices || !images.primary) {
      continue
    }
    prepared.push({
      variant,
      dict: extractVariantDict(product, variant),
      primaryImage: images.primary,
      additionalImages: images.additional,
      price: prices.price,
      salePrice: prices.salePrice,
    })
  }
  return prepared
}

export const buildOpenAiAdsRows = (
  products: HttpTypes.StoreProduct[],
  ctx: FeedContext,
): OpenAiAdsFeedRow[] => {
  const baseUrl = ctx.baseUrl.replace(/\/+$/, "")
  const countryLower = ctx.country.trim().toLowerCase()
  const countryUpper = countryLower.toUpperCase()
  const sellerUrl = `${baseUrl}/${countryLower}`
  const returnPolicyUrl = `${sellerUrl}/return-policy`
  const seenItemIds = new Set<string>()
  const rows: OpenAiAdsFeedRow[] = []

  for (const product of products) {
    const handle = product.handle?.trim()
    const rawTitle = product.title?.trim()
    if (!handle || !rawTitle) {
      continue
    }

    const prepared = prepareVariants(product, baseUrl)
    if (prepared.length === 0) {
      continue
    }

    const isGroup = canFormVariantGroup(prepared.map((item) => item.dict))
    const groupId = isGroup ? product.id : ""
    const brand = getProductBrand(product) || SITE_NAME
    const condition = mapCondition(getProductCondition(product))
    const categoryPath = formatCategoryPath(product.categories, product.collection?.title)
    const rawDescription = stripHtml(product.description || "")
    const baseProductUrl = `${sellerUrl}/products/${encodeURIComponent(handle)}`

    for (const item of prepared) {
      const { variant, dict } = item
      const title = buildItemTitle(rawTitle, variant.title, prepared.length > 1)
      if (!title) {
        continue
      }

      rows.push({
        item_id: resolveUniqueItemId(variant, groupId, seenItemIds),
        group_id: groupId,
        listing_has_variations: isGroup ? "true" : "",
        variant_dict: isGroup ? JSON.stringify(dict) : "",
        title,
        description: (rawDescription || title).slice(0, 5000),
        url:
          prepared.length > 1
            ? `${baseProductUrl}?v_id=${encodeURIComponent(variant.id)}`
            : baseProductUrl,
        brand,
        image_url: item.primaryImage,
        additional_image_urls: item.additionalImages
          .map((u) => u.replace(/,/g, "%2C"))
          .join(","),
        price: item.price,
        sale_price: item.salePrice,
        availability: isVariantInStock(variant) ? "in_stock" : "out_of_stock",
        condition,
        product_category: categoryPath,
        gtin: resolveVariantGtin(variant),
        mpn: variant.sku?.trim() || "",
        material: (variant.material || product.material || "").trim(),
        color: findOptionValue(dict, /^(color|colour|cor)$/i),
        size: findOptionValue(dict, /^(size|tamanho)$/i),
        seller_name: SITE_NAME,
        seller_url: sellerUrl,
        return_policy: returnPolicyUrl,
        target_countries: countryUpper,
        store_country: countryUpper,
        is_eligible_search: "true",
        is_eligible_checkout: "false",
        is_ads_eligible: "true",
      })
    }
  }

  return rows
}

export const buildOpenAiAdsFeed = (
  products: HttpTypes.StoreProduct[],
  ctx: FeedContext,
): string => serializeCsv(OPENAI_ADS_FEED_COLUMNS, buildOpenAiAdsRows(products, ctx))
