const NON_ALPHANUMERIC = /[^a-z0-9]+/g
const EDGE_HYPHENS = /^-+|-+$/g
const COMBINING_MARKS = /[\u0300-\u036f]/g

export function toUrlSlug(value: unknown, fallback: string): string {
  const normalized = String(value ?? "")
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(NON_ALPHANUMERIC, "-")
    .replace(EDGE_HYPHENS, "")

  return normalized || fallback
}

export async function resolveUniqueSlug(
  baseSlug: string,
  exists: (slug: string) => Promise<boolean>,
  preferredSuffix?: string
): Promise<string> {
  if (!(await exists(baseSlug))) {
    return baseSlug
  }

  const suffixSlug = preferredSuffix ? toUrlSlug(preferredSuffix, "") : ""
  if (suffixSlug) {
    const slugWithSuffix = `${baseSlug}-${suffixSlug}`

    if (!(await exists(slugWithSuffix))) {
      return slugWithSuffix
    }
  }

  for (let suffix = 2; ; suffix++) {
    const candidate = `${baseSlug}-${suffix}`

    if (!(await exists(candidate))) {
      return candidate
    }
  }
}
