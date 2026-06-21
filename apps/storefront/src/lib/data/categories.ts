import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"
import { listProducts } from "./products"
import { isProductAvailable } from "@lib/util/product"

const availableProductCategoryFields =
  "*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,*variants.images,+metadata,+tags,+categories.id,+categories.name,+categories.parent_category_id,+categories.handle"

const listAvailableProducts = async (countryCode?: string) => {
  if (!countryCode) {
    return []
  }

  const products: HttpTypes.StoreProduct[] = []
  let pageParam = 1
  let hasMoreProducts = true

  while (hasMoreProducts) {
    const { response, nextPage } = await listProducts({
      pageParam,
      countryCode,
      queryParams: {
        limit: 100,
        fields: availableProductCategoryFields,
      },
    })

    products.push(...response.products.filter(isProductAvailable))
    hasMoreProducts = !!nextPage
    pageParam = nextPage ?? pageParam
  }

  return products
}

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
            "*category_children, *products, *products.images, *parent_category, *parent_category.parent_category",
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
          fields: "*category_children, *products",
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
  const allCategories = await listCategories(query)
  const availableProducts = await listAvailableProducts(countryCode).catch(
    () => [],
  )

  const categoryMap = new Map<string, HttpTypes.StoreProductCategory>()
  for (const cat of allCategories) {
    categoryMap.set(cat.id, cat)
  }

  const activeCategoryIds = new Set<string>()
  const markActive = (categoryId: string) => {
    if (activeCategoryIds.has(categoryId)) return
    activeCategoryIds.add(categoryId)
    const cat = categoryMap.get(categoryId)
    const parentId = cat?.parent_category_id || cat?.parent_category?.id
    if (parentId) {
      markActive(parentId)
    }
  }

  for (const product of availableProducts) {
    if (product.categories) {
      for (const cat of product.categories) {
        if (cat.id) {
          markActive(cat.id)
        }
      }
    }
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
        category_children: filteredChildren,
      })
    }
  }

  return filteredCategories
}
