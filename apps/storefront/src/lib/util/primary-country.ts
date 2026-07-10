import { listRegions } from "@lib/data/regions"

// País canônico usado para sitemap, feed do Merchant e canonical URLs.
// As páginas são prefixadas por região; para SEO consolidamos tudo em um único
// país (evita conteúdo duplicado sem depender de hreflang). Prioriza a região
// padrão do ambiente e cai para a primeira região existente se ela não existir.
export const getPrimaryCountryCode = async (): Promise<string> => {
  const envDefault = process.env.NEXT_PUBLIC_DEFAULT_REGION?.toLowerCase()

  const regions = await listRegions().catch(() => [])
  const countries = regions.flatMap(
    (r) =>
      r.countries
        ?.map((c) => c.iso_2?.toLowerCase())
        .filter((c): c is string => Boolean(c)) ?? [],
  )

  if (envDefault && countries.includes(envDefault)) {
    return envDefault
  }

  return countries[0] ?? envDefault ?? "us"
}
