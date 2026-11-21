import { HttpTypes } from "@medusajs/types"
import { resolveHttpUrl } from "./csv"

export type VariantOptionDict = Record<string, string>

export const isVariantInStock = (
  variant: HttpTypes.StoreProductVariant,
): boolean => {
  if (variant.allow_backorder || !variant.manage_inventory) {
    return true
  }
  return (variant.inventory_quantity ?? 0) > 0
}

export const extractVariantDict = (
  product: HttpTypes.StoreProduct,
  variant: HttpTypes.StoreProductVariant,
): VariantOptionDict => {
  const titleByOptionId = new Map<string, string>()
  for (const opt of product.options ?? []) {
    const title = opt.title?.trim()
    if (opt.id && title) {
      titleByOptionId.set(opt.id, title)
    }
  }

  const dict: VariantOptionDict = {}
  for (const optVal of variant.options ?? []) {
    const key =
      (optVal.option_id ? titleByOptionId.get(optVal.option_id) : undefined) ||
      optVal.option?.title?.trim()
    const value = optVal.value?.trim()
    if (key && value) {
      dict[key] = value
    }
  }

  return dict
}

// A spec da OpenAI exige que um grupo de variantes tenha >= 2 variantes com
// variant_dict não vazio, exatamente os mesmos nomes de opção e combinações
// únicas dentro do grupo.
export const canFormVariantGroup = (
  dicts: ReadonlyArray<VariantOptionDict>,
): boolean => {
  if (dicts.length < 2) {
    return false
  }

  let expectedSignature: string | null = null
  const seenCombinations = new Set<string>()

  for (const dict of dicts) {
    const keys = Object.keys(dict).sort()
    if (keys.length === 0) {
      return false
    }

    const keySignature = JSON.stringify(keys)
    if (expectedSignature === null) {
      expectedSignature = keySignature
    } else if (expectedSignature !== keySignature) {
      return false
    }

    const comboSignature = JSON.stringify(keys.map((k) => [k, dict[k]]))
    if (seenCombinations.has(comboSignature)) {
      return false
    }
    seenCombinations.add(comboSignature)
  }

  return true
}

export const findOptionValue = (
  dict: VariantOptionDict,
  pattern: RegExp,
): string => {
  for (const [key, value] of Object.entries(dict)) {
    if (pattern.test(key.trim())) {
      return value
    }
  }
  return ""
}

export const resolveVariantImages = (
  product: HttpTypes.StoreProduct,
  variant: HttpTypes.StoreProductVariant,
  baseUrl: string,
): { primary?: string; additional: string[] } => {
  const candidates = [
    variant.thumbnail,
    ...(variant.images ?? []).map((img) => img.url),
    product.thumbnail,
    ...(product.images ?? []).map((img) => img.url),
  ]

  const unique: string[] = []
  const seen = new Set<string>()

  for (const raw of candidates) {
    const url = resolveHttpUrl(raw, baseUrl)
    if (url && !seen.has(url)) {
      seen.add(url)
      unique.push(url)
    }
  }

  const [primary, ...additional] = unique
  return { primary, additional }
}
