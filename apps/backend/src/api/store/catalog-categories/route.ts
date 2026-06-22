import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { listSalesChannelProductIds } from "../catalog-products/sales-channels"

const PAGE_SIZE = 500

type CatalogCategoryProduct = {
  thumbnail?: string | null
  images?: { url?: string | null }[] | null
  categories?: { id?: string | null }[] | null
}

function getSalesChannelIds(req: MedusaRequest) {
  const context = (req as any).publishable_key_context
  const ids = context?.sales_channel_ids
  return Array.isArray(ids) ? ids.filter(Boolean) : []
}

function getFilters(productIds?: string[]) {
  const filters: Record<string, any> = { status: "published" }

  if (productIds) {
    filters.id = productIds
  }

  return filters
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const productIds = await listSalesChannelProductIds(query, getSalesChannelIds(req))
  const categoryIds = new Set<string>()
  const categoryImages = new Map<string, string>()
  let skip = 0
  let count = 0

  do {
    const { data, metadata } = await query.graph(
      {
        entity: "product",
        fields: ["thumbnail", "images.url", "categories.id"],
        filters: getFilters(productIds),
        pagination: { take: PAGE_SIZE, skip },
      },
      { cache: { enable: true } }
    )

    count = metadata?.count ?? 0
    skip += PAGE_SIZE

    for (const product of data as CatalogCategoryProduct[]) {
      const image =
        product.thumbnail || product.images?.find((item) => item?.url)?.url

      for (const category of product.categories ?? []) {
        if (category?.id) {
          categoryIds.add(category.id)

          if (image && !categoryImages.has(category.id)) {
            categoryImages.set(category.id, image)
          }
        }
      }
    }
  } while (skip < count)

  res.json({
    category_ids: Array.from(categoryIds),
    category_images: Object.fromEntries(categoryImages),
  })
}
