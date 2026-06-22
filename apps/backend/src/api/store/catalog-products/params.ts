import { z } from "zod"

const sortSchema = z.enum(["created_at", "price_asc", "price_desc"])
const stringListSchema = z.union([z.string(), z.array(z.string())]).optional()

export type CatalogSort = z.infer<typeof sortSchema>

export type CatalogParams = {
  limit: number
  offset: number
  sortBy: CatalogSort
  q?: string
  categoryIds: string[]
  collectionIds: string[]
  price?: string
  sale?: "true" | "false"
  newArrivals: boolean
  regionId?: string
  includeStats: boolean
}

type ParseCatalogParamsResult =
  | { success: true; data: CatalogParams }
  | { success: false }

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(12),
  offset: z.coerce.number().int().min(0).default(0),
  sortBy: z.string().optional(),
  order: z.string().optional(),
  q: z.string().trim().optional(),
  category_id: stringListSchema,
  collection_id: stringListSchema,
  price: z.string().trim().optional(),
  sale: z.enum(["true", "false"]).optional(),
  new_arrivals: z.enum(["true", "false"]).optional(),
  region_id: z.string().trim().optional(),
  include_stats: z.enum(["true", "false"]).optional(),
})

const toArray = (value?: string | string[]) =>
  (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean)

const getSort = (sortBy?: string, order?: string): CatalogSort => {
  const parsedSort = sortSchema.safeParse(sortBy)

  if (parsedSort.success) {
    return parsedSort.data
  }

  return order === "created_at" || order === "-created_at"
    ? "created_at"
    : "created_at"
}

export function parseCatalogParams(query: unknown): ParseCatalogParamsResult {
  const parsed = querySchema.safeParse(query)

  if (!parsed.success) {
    return { success: false }
  }

  const data = parsed.data
  return {
    success: true as const,
    data: {
      limit: data.limit,
      offset: data.offset,
      sortBy: getSort(data.sortBy, data.order),
      q: data.q || undefined,
      categoryIds: toArray(data.category_id),
      collectionIds: toArray(data.collection_id),
      price: data.price || undefined,
      sale: data.sale,
      newArrivals: data.new_arrivals === "true",
      regionId: data.region_id || undefined,
      includeStats: data.include_stats === "true",
    },
  }
}
