import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import { listCatalogProducts } from "./catalog-products"
import { listProducts } from "./products"
import { type ProductListQueryParams } from "./products"

export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
  price,
  sale,
  newArrivals,
}: {
  page?: number
  queryParams?: ProductListQueryParams
  sortBy?: SortOptions
  countryCode: string
  price?: string
  sale?: string
  newArrivals?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  const limit = queryParams?.limit || 12
  const pageNumber = Math.max(page, 1)

  const catalog = await listCatalogProducts({
    page: pageNumber,
    queryParams,
    sortBy,
    countryCode,
    price,
    sale,
    newArrivals,
  })

  if (!catalog.product_ids.length) {
    return {
      response: { products: [], count: catalog.count },
      nextPage: null,
      queryParams,
    }
  }

  // O catálogo já filtrou o estoque antes de paginar; filtrar de novo aqui
  // removeria itens da página já montada e cada página teria um tamanho.
  // Também não pedimos `+variants.inventory_quantity`: o card não exibe
  // estoque e o campo faria o Medusa recalcular a disponibilidade à toa.
  const {
    response: { products },
  } = await listProducts({
    pageParam: 1,
    queryParams: {
      id: catalog.product_ids,
      limit: catalog.product_ids.length,
      fields: "*variants.calculated_price,*variants.images,+metadata,+tags,",
    },
    countryCode,
    includeUnavailable: true,
  })

  const productsById = new Map(products.map((product) => [product.id, product]))
  const orderedProducts = catalog.product_ids
    .map((id) => productsById.get(id))
    .filter((product): product is HttpTypes.StoreProduct => !!product)

  return {
    response: {
      products: orderedProducts,
      count: catalog.count,
    },
    nextPage: catalog.count > pageNumber * limit ? pageNumber + 1 : null,
    queryParams,
  }
}
