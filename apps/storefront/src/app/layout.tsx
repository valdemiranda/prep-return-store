import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { GoogleAnalytics } from "@next/third-parties/google"
import { SITE_NAME, SITE_DESCRIPTION } from "@lib/constants/site"
import OrganizationJsonLd from "@modules/common/components/organization-json-ld"
import "styles/globals.css"
import { Inter, Chivo } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
  display: "swap",
})

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-chivo",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const gtagId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

  return (
    <html
      lang="en"
      data-mode="light"
      className={`${inter.variable} ${chivo.variable}`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="1Stop Liq" />
      </head>
      <body className="bg-surface text-on-surface antialiased">
        <OrganizationJsonLd />
        <main className="relative">{props.children}</main>
      </body>
      {gtagId && <GoogleAnalytics gaId={gtagId} />}
    </html>
  )
}
