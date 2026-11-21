import { HttpTypes } from "@medusajs/types"

// Helpers puros para serialização CSV (RFC 4180) e validação de valores
// conforme a especificação de Product Feeds da OpenAI / ChatGPT Ads.

export const escapeCsvCell = (value: string): string => {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export const serializeCsv = <T extends readonly string[]>(
  headers: T,
  rows: ReadonlyArray<Record<T[number], string>>,
): string => {
  const headerLine = headers.map(escapeCsvCell).join(",")
  if (rows.length === 0) {
    return `${headerLine}\n`
  }

  const lines = rows.map((row) =>
    headers.map((col) => escapeCsvCell(row[col as T[number]] ?? "")).join(","),
  )

  return `${headerLine}\n${lines.join("\n")}\n`
}

const currencyDecimalsCache = new Map<string, number>()

const getCurrencyDecimals = (currency: string): number => {
  const code = currency.toUpperCase()
  const cached = currencyDecimalsCache.get(code)
  if (cached !== undefined) {
    return cached
  }

  let decimals = 2
  try {
    const resolved = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).resolvedOptions()
    if (typeof resolved.maximumFractionDigits === "number") {
      decimals = resolved.maximumFractionDigits
    }
  } catch {
    decimals = 2
  }

  currencyDecimalsCache.set(code, decimals)
  return decimals
}

// OpenAI exige "amount CURRENCY" (ex.: "79.99 USD"), respeitando as casas
// decimais da moeda ISO 4217 (0 para JPY, 2 para USD/BRL, etc.).
export const formatFeedMoney = (amount: number, currency: string): string => {
  const code = currency.trim().toUpperCase()
  const decimals = getCurrencyDecimals(code)
  return `${amount.toFixed(decimals)} ${code}`
}

export const resolveHttpUrl = (
  raw: string | null | undefined,
  baseUrl: string,
): string | undefined => {
  const trimmed = raw?.trim()
  if (!trimmed) {
    return undefined
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  if (trimmed.startsWith("/") && /^https?:\/\//i.test(baseUrl)) {
    return `${baseUrl.replace(/\/+$/, "")}${trimmed}`
  }
  return undefined
}

const hasValidGs1CheckDigit = (digits: string): boolean => {
  let sum = 0
  let weight = 3
  for (let i = digits.length - 2; i >= 0; i -= 1) {
    sum += Number(digits[i]) * weight
    weight = weight === 3 ? 1 : 3
  }
  const expected = (10 - (sum % 10)) % 10
  return expected === Number(digits[digits.length - 1])
}

// GTIN válido na OpenAI: 8, 12, 13 ou 14 dígitos numéricos com dígito
// verificador GS1 válido, preservando zeros à esquerda.
export const normalizeValidGtin = (
  raw?: string | null,
): string | undefined => {
  if (!raw) {
    return undefined
  }
  const digits = raw.replace(/[\s-]+/g, "")
  if (!/^(?:\d{8}|\d{12}|\d{13}|\d{14})$/.test(digits)) {
    return undefined
  }
  return hasValidGs1CheckDigit(digits) ? digits : undefined
}

const buildCategoryTrail = (
  category: HttpTypes.StoreProductCategory,
): string[] => {
  const trail: string[] = []
  const visited = new Set<string>()
  let current: HttpTypes.StoreProductCategory | null | undefined = category

  while (current && !visited.has(current.id)) {
    visited.add(current.id)
    const name = current.name?.trim()
    if (name) {
      trail.unshift(name)
    }
    current = current.parent_category
  }

  return trail
}

// Retorna o caminho de categoria mais específico separado por " > ",
// caindo para o título da coleção quando o produto não tem categorias.
export const formatCategoryPath = (
  categories?: HttpTypes.StoreProductCategory[] | null,
  fallbackCollection?: string | null,
): string => {
  const trails = (categories ?? [])
    .map(buildCategoryTrail)
    .filter((trail) => trail.length > 0)
    .sort((a, b) => b.length - a.length)

  if (trails.length > 0) {
    return trails[0].join(" > ")
  }

  return fallbackCollection?.trim() || ""
}
