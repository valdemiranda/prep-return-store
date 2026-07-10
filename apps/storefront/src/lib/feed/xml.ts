// Helpers puros (sem dependências) para montar o feed XML do Google Merchant.

export const escapeXml = (value: string): string =>
  value.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c] as string,
  )

export const stripHtml = (value: string): string =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

// Google espera "19.99 USD".
export const formatPrice = (amount: number, currency: string): string =>
  `${amount.toFixed(2)} ${currency.toUpperCase()}`

export const mapCondition = (raw?: string): "new" | "used" | "refurbished" => {
  const c = raw?.toLowerCase() ?? ""
  if (c.includes("refurb")) return "refurbished"
  if (c.includes("used") || c.includes("open") || c.includes("return")) {
    return "used"
  }
  return "new"
}

// Emite <name>valor</name>, escapando o valor; retorna "" quando vazio.
export const xmlTag = (name: string, value?: string | number): string =>
  value === undefined || value === ""
    ? ""
    : `<${name}>${escapeXml(String(value))}</${name}>`
