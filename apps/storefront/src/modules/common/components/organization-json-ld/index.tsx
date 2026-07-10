import { getBaseURL } from "@lib/util/env"
import { SITE_NAME } from "@lib/constants/site"

export default function OrganizationJsonLd() {
  const base = getBaseURL()
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: base,
    logo: `${base}/logo.png`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
