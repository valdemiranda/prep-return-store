import { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"

export default function robots(): MetadataRoute.Robots {
  const base = getBaseURL()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Rotas prefixadas por país (ex: /us/checkout) e páginas sem valor de busca.
      disallow: [
        "/*/account",
        "/*/cart",
        "/*/checkout",
        "/*/order/",
        "/*/track-order",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
