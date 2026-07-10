import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import { hasAvailableStock } from "@lib/util/product-availability"
import {
  getProductBrand,
  getProductCondition,
} from "@modules/products/utils/product-metadata"
import { SITE_NAME } from "@lib/constants/site"

const conditionUrl = (product: HttpTypes.StoreProduct): string => {
  const c = getProductCondition(product)?.toLowerCase() ?? ""
  if (c.includes("refurb")) return "https://schema.org/RefurbishedCondition"
  if (c.includes("used") || c.includes("open") || c.includes("return")) {
    return "https://schema.org/UsedCondition"
  }
  return "https://schema.org/NewCondition"
}

// Monta o schema.org/Product (com Offer) para rich results de preço/estoque.
export const buildProductSchema = (
  product: HttpTypes.StoreProduct,
  url: string,
) => {
  const { cheapestPrice } = getProductPrice({ product })
  const images = (product.images ?? [])
    .map((i) => i.url)
    .filter((u): u is string => Boolean(u))

  const offers = cheapestPrice
    ? {
        "@type": "Offer",
        priceCurrency: cheapestPrice.currency_code.toUpperCase(),
        price: cheapestPrice.calculated_price_number.toFixed(2),
        availability: hasAvailableStock(product)
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: conditionUrl(product),
        url,
      }
    : undefined

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    description: product.description || product.title,
    image: images.length
      ? images
      : product.thumbnail
        ? [product.thumbnail]
        : undefined,
    sku: product.variants?.[0]?.sku || undefined,
    brand: { "@type": "Brand", name: getProductBrand(product) || SITE_NAME },
    ...(offers ? { offers } : {}),
  }
}
