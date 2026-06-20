import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
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
}

export default function RootLayout(props: { children: React.ReactNode }) {
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
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
