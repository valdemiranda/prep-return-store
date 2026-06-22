import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import {
  emptyAvailableCategoryData,
  getRepresentativeProducts,
  listAvailableCategoryData,
} from "./category-availability"
import { getCacheOptions } from "./cookies"

export const listCategories = async (query?: Record<string, unknown>) => {
  const next = {
    ...(await getCacheOptions("categories", { global: true })),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      },
    )
    .then(({ product_categories }) => product_categories)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories", { global: true })),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields:
            "*category_children, *parent_category, *parent_category.parent_category",
          handle,
        },
        next,
        cache: "force-cache",
      },
    )
    .then(({ product_categories }) => product_categories[0])
}

export const listCategoriesWithAvailableProducts = async ({
  countryCode,
  query,
}: {
  countryCode?: string
  query?: Record<string, unknown>
}) => {
  if (!countryCode) {
    return []
  }

  const allCategories = await listCategories(query)
  const availableData = await listAvailableCategoryData().catch(
    emptyAvailableCategoryData
  )
  const categoryImages = new Map(
    Object.entries(availableData.category_images ?? {})
  )

  const categoryMap = new Map<string, HttpTypes.StoreProductCategory>()
  for (const cat of allCategories) {
    categoryMap.set(cat.id, cat)
  }

  const activeCategoryIds = new Set<string>()
  const markActive = (categoryId: string, fallbackImage?: string) => {
    if (fallbackImage && !categoryImages.has(categoryId)) {
      categoryImages.set(categoryId, fallbackImage)
    }

    if (activeCategoryIds.has(categoryId)) return
    activeCategoryIds.add(categoryId)
    const cat = categoryMap.get(categoryId)
    const parentId = cat?.parent_category_id || cat?.parent_category?.id
    if (parentId) {
      markActive(parentId, categoryImages.get(categoryId))
    }
  }

  for (const categoryId of availableData.category_ids) {
    markActive(categoryId, categoryImages.get(categoryId))
  }

  const filteredCategories: HttpTypes.StoreProductCategory[] = []
  for (const cat of allCategories) {
    if (activeCategoryIds.has(cat.id)) {
      const filteredChildren = cat.category_children
        ? cat.category_children.filter((child) =>
            activeCategoryIds.has(child.id),
          )
        : []

      filteredCategories.push({
        ...cat,
        products: getRepresentativeProducts(cat, categoryImages.get(cat.id)),
        category_children: filteredChildren,
      })
    }
  }

  return filteredCategories
}

export const isRootCategory = (category: HttpTypes.StoreProductCategory) =>
  !category.parent_category_id && !category.parent_category?.id

export const listRootCategoriesWithAvailableProducts = async ({
  countryCode,
  query,
}: {
  countryCode?: string
  query?: Record<string, unknown>
}) => {
  const categories = await listCategoriesWithAvailableProducts({
    countryCode,
    query,
  })

  return categories.filter(isRootCategory)
}
