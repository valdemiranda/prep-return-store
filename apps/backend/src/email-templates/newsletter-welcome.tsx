import * as React from "react"
import { colors } from "./theme"
import {
  EmailLayout,
  EmailHeader,
  EmailFooter,
  EmailButton,
  Text,
} from "./components"

export interface NewsletterWelcomeEmailProps {
  email: string
  storeUrl: string
}

export const NewsletterWelcomeEmail = ({
  email,
  storeUrl,
}: NewsletterWelcomeEmailProps) => {
  return (
    <EmailLayout previewText="Welcome to One Stop Liquidation — first access to new shipments.">
      <EmailHeader
        title="You're In! Welcome to One Stop Liquidation"
        subtitle={`Subscribed as ${email}`}
      />
      <Text
        style={{
          fontSize: "14px",
          color: colors.onSurface,
          margin: "0 0 16px 0",
          lineHeight: "1.5",
        }}
      >
        Thanks for subscribing. You now have first access to new shipment
        alerts and unbeatable volume pricing on electronics, home goods, and
        more — direct from major retailers.
      </Text>
      <Text
        style={{
          fontSize: "14px",
          color: colors.onSurfaceVariant,
          margin: "0 0 24px 0",
          lineHeight: "1.5",
        }}
      >
        Watch your inbox for new arrivals and members-only deals.
      </Text>
      <EmailButton href={storeUrl} text="Shop Latest Deals" />
      <EmailFooter />
    </EmailLayout>
  )
}
