import { Metadata } from "next"
import SupportTemplate from "@modules/support/templates"

export const metadata: Metadata = {
  title: "Customer Support",
  description:
    "Have questions or need assistance? Our support team is here to help you.",
}

export default function SupportPage() {
  return (
    <main className="bg-background py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl px-margin-mobile md:px-gutter">
        <SupportTemplate />
      </div>
    </main>
  )
}
