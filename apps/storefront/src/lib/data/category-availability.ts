import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export type AvailableCategoryData = {
  category_ids: string[]
  category_images: Record<string, string>
}

type CacheOptions = {
  tags?: string[]
  revalidate?: number
}

const getCatalogCategoryCacheOptions = async () => {
  const [categoryOptions, productOptions] = await Promise.all([
    getCacheOptions("categories", { global: true }),
    getCacheOptions("products", { global: true }),
  ])

  const categoryCache = categoryOptions as CacheOptions
  const productCache = productOptions as CacheOptions
  const tags = [...(categoryCache.tags ?? []), ...(productCache.tags ?? [])]
  const revalidate = categoryCache.revalidate ?? productCache.revalidate

  return {
    ...(tags.length ? { tags: Array.from(new Set(tags)) } : {}),
    ...(revalidate ? { revalidate } : {}),
  }
}

export const emptyAvailableCategoryData = (): AvailableCategoryData => ({
  category_ids: [],
  category_images: {},
})

export const listAvailableCategoryData = async () => {
  return sdk.client.fetch<AvailableCategoryData>("/store/catalog-categories", {
    next: await getCatalogCategoryCacheOptions(),
    cache: "force-cache",
  })
}

export const getRepresentativeProducts = (
  category: HttpTypes.StoreProductCategory,
  image?: string
) => {
  if (!image) {
    return category.products
  }

  return [
    {
      id: `${category.id}-representative-image`,
      title: category.name,
      thumbnail: image,
      images: [{ url: image }],
    },
  ] as unknown as HttpTypes.StoreProduct[]
}
