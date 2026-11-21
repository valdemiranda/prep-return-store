"use server"

import { HttpTypes } from "@medusajs/types"
import { unstable_rethrow } from "next/navigation"
import {
  getMostSpecificCategoryIds,
  pickRandomPage,
  selectRelatedProductIds,
  sortByIdOrder,
} from "@lib/util/related-products"

import { listCatalogProducts } from "./catalog-products"
import { listProducts } from "./products"

const RELATED_PRODUCTS_COUNT = 12
// Folga para produtos que esgotaram depois que a lista de IDs foi cacheada: a
// busca final descarta os sem estoque e a grade ainda fecha em 12.
const SELECTION_BUFFER = 4
// Teto aceito por /store/catalog-products (limit máx. 100).
const CANDIDATES_PER_PAGE = 100

/**
 * IDs com estoque da categoria, resolvidos pelo backend sobre o catálogo
 * completo (só IDs, então a resposta é leve e fica no cache global). Em
 * categorias grandes sorteia uma das páginas, para que todo o conjunto tenha
 * chance de aparecer e não só os 100 mais recentes. A última página pode vir
 * quase vazia; nesse caso ela é completada com a primeira, já carregada.
 */
async function listCategoryCandidateIds({
  countryCode,
  categoryIds,
  sale,
}: {
  countryCode: string
  categoryIds: string[]
  sale?: "true"
}) {
  const queryParams = { category_id: categoryIds, limit: CANDIDATES_PER_PAGE }
  const firstPage = await listCatalogProducts({ countryCode, sale, queryParams })
  const page = pickRandomPage(firstPage.count, CANDIDATES_PER_PAGE)

  if (page === 1) {
    return firstPage.product_ids
  }

  const { product_ids } = await listCatalogProducts({
    countryCode,
    sale,
    page,
    queryParams,
  })

  return product_ids.length > RELATED_PRODUCTS_COUNT
    ? product_ids
    : [...product_ids, ...firstPage.product_ids]
}

const idsOrEmpty = (result: PromiseSettledResult<string[]>) =>
  result.status === "fulfilled" ? result.value : []

/**
 * Produtos da mesma categoria do produto exibido, priorizando os que estão em
 * sale. A seleção é sorteada a cada request, então um refresh da página pode
 * mostrar outros produtos.
 */
export async function listRelatedProducts({
  product,
  countryCode,
}: {
  product: HttpTypes.StoreProduct
  countryCode: string
}): Promise<HttpTypes.StoreProduct[]> {
  const categoryIds = getMostSpecificCategoryIds(product.categories)

  if (!categoryIds.length) {
    return []
  }

  try {
    // allSettled: se só a consulta de sale falhar, ainda mostramos a categoria.
    const [saleResult, otherResult] = await Promise.allSettled([
      listCategoryCandidateIds({ countryCode, categoryIds, sale: "true" }),
      listCategoryCandidateIds({ countryCode, categoryIds }),
    ])

    const ids = selectRelatedProductIds({
      saleIds: idsOrEmpty(saleResult),
      otherIds: idsOrEmpty(otherResult),
      excludeId: product.id,
      size: RELATED_PRODUCTS_COUNT + SELECTION_BUFFER,
    })

    if (!ids.length) {
      return []
    }

    const { response } = await listProducts({
      countryCode,
      cache: "no-store",
      queryParams: { id: ids, limit: ids.length, is_giftcard: false },
    })

    return sortByIdOrder(response.products, ids).slice(
      0,
      RELATED_PRODUCTS_COUNT,
    )
  } catch (error) {
    // Erros internos do Next (ex.: renderização dinâmica) precisam subir.
    unstable_rethrow(error)
    // Seção secundária: uma falha aqui não pode derrubar a página do produto.
    return []
  }
}
