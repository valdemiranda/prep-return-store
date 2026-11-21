import { HttpTypes } from "@medusajs/types"

import { shuffle } from "./shuffle"

type CategoryRef = Pick<HttpTypes.StoreProductCategory, "id"> & {
  parent_category_id?: string | null
}

/**
 * Fica só com as categorias mais específicas do produto. Se ele está em
 * "Electronics" e também em "Headphones" (filha), usar as duas traria qualquer
 * eletrônico como relacionado; a filha já descreve melhor o produto.
 */
export function getMostSpecificCategoryIds(
  categories?: CategoryRef[] | null,
): string[] {
  const list = categories ?? []
  const parentIds = new Set(list.map((category) => category.parent_category_id))

  return list
    .filter((category) => !parentIds.has(category.id))
    .map((category) => category.id)
}

/** Página aleatória (base 1) entre as que cobrem `count` itens. */
export function pickRandomPage(count: number, pageSize: number) {
  const totalPages = Math.ceil(count / pageSize)

  if (totalPages <= 1) {
    return 1
  }

  return Math.floor(Math.random() * totalPages) + 1
}

/**
 * Produtos em sale vêm primeiro (em ordem aleatória); as vagas que sobrarem são
 * preenchidas com o restante da categoria, também embaralhado. Sem nenhum item
 * em sale, a seleção inteira sai da categoria em ordem aleatória.
 */
export function selectRelatedProductIds({
  saleIds,
  otherIds,
  excludeId,
  size,
}: {
  saleIds: string[]
  otherIds: string[]
  excludeId: string
  size: number
}): string[] {
  const seen = new Set([excludeId])
  const selected: string[] = []

  for (const id of [...shuffle(saleIds), ...shuffle(otherIds)]) {
    if (selected.length >= size) {
      break
    }

    if (!seen.has(id)) {
      seen.add(id)
      selected.push(id)
    }
  }

  return selected
}

/** Reordena `items` na ordem de `ids`; a API devolve na ordem dela. */
export function sortByIdOrder<T extends { id: string }>(
  items: T[],
  ids: string[],
): T[] {
  const position = new Map(ids.map((id, index) => [id, index]))

  return items
    .filter((item) => position.has(item.id))
    .sort((a, b) => position.get(a.id)! - position.get(b.id)!)
}
