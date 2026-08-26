import { listCatalogProducts } from "@lib/data/catalog-products"

// Teto aceito por /store/catalog-products (limit máx. 100).
const CANDIDATES_PER_ROTATION = 100
// Alinhado ao CATALOG_REVALIDATE_SECONDS: a janela só muda quando o cache expira.
const ROTATION_SECONDS = 300

/**
 * Quando há mais produtos em promoção do que cabe numa página, a página exibida
 * gira a cada ROTATION_SECONDS. Assim todo o conjunto passa pelas posições da
 * vitrine sem precisar hidratar o catálogo inteiro a cada request.
 */
const getRotationPage = (count: number) => {
  const totalPages = Math.ceil(count / CANDIDATES_PER_ROTATION)

  if (totalPages <= 1) {
    return 1
  }

  const bucket = Math.floor(Date.now() / (ROTATION_SECONDS * 1000))

  return (bucket % totalPages) + 1
}

/**
 * IDs dos produtos que estão em alguma lista de preços ativa (price_list_type
 * "sale") e com estoque, resolvidos pelo backend sobre o catálogo completo.
 */
export const listSaleProductIds = async (countryCode: string) => {
  const firstPage = await listCatalogProducts({
    countryCode,
    sale: "true",
    queryParams: { limit: CANDIDATES_PER_ROTATION },
  })

  const page = getRotationPage(firstPage.count)

  if (page === 1) {
    return firstPage.product_ids
  }

  const { product_ids } = await listCatalogProducts({
    countryCode,
    sale: "true",
    page,
    queryParams: { limit: CANDIDATES_PER_ROTATION },
  })

  return product_ids
}
