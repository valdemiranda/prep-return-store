import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { revalidateStorefront } from "../utils/revalidate-storefront"

/**
 * Mapeia o prefixo do evento de catálogo para as tags da storefront a invalidar.
 * A ordem importa: prefixos mais específicos (product-category,
 * product-collection) precisam vir antes de "product".
 */
const TAGS_BY_PREFIX: ReadonlyArray<{ prefix: string; tags: string[] }> = [
  { prefix: "product-category", tags: ["categories", "products"] },
  { prefix: "product-collection", tags: ["collections", "products"] },
  { prefix: "product", tags: ["products"] },
]

function tagsForEvent(eventName: string): string[] {
  for (const { prefix, tags } of TAGS_BY_PREFIX) {
    if (eventName.startsWith(prefix)) {
      return tags
    }
  }
  return []
}

/**
 * Quando o catálogo muda no admin (produto/categoria/coleção criado, alterado
 * ou removido), notifica a storefront para invalidar o cache correspondente via
 * webhook. Ver src/utils/revalidate-storefront.ts.
 */
export default async function catalogCacheHandler({
  event: { name },
}: SubscriberArgs<unknown>) {
  const tags = tagsForEvent(name)
  if (tags.length) {
    await revalidateStorefront(tags)
  }
}

export const config: SubscriberConfig = {
  event: [
    "product.created",
    "product.updated",
    "product.deleted",
    "product-category.created",
    "product-category.updated",
    "product-category.deleted",
    "product-collection.created",
    "product-collection.updated",
    "product-collection.deleted",
  ],
}
