import * as React from "react"
import { colors } from "./theme"
import {
  EmailLayout,
  EmailHeader,
  EmailFooter,
  EmailButton,
  Text,
} from "./components"

export interface InviteUserEmailProps {
  inviteUrl: string
  storeName: string
  email: string
}

export const InviteUserEmail = ({
  inviteUrl,
  storeName,
  email,
}: InviteUserEmailProps) => {
  return (
    <EmailLayout previewText={`You've been invited to join ${storeName}.`}>
      <EmailHeader
        title={`You're Invited to Join ${storeName}`}
        subtitle={`Invitation sent to ${email}`}
      />
      <Text
        style={{
          fontSize: "14px",
          color: colors.onSurface,
          margin: "0 0 16px 0",
          lineHeight: "1.5",
        }}
      >
        You've been invited to create an admin account for {storeName}. Accept
        your invitation to set up your password and access the dashboard.
      </Text>
      <Text
        style={{
          fontSize: "14px",
          color: colors.onSurfaceVariant,
          margin: "0 0 24px 0",
          lineHeight: "1.5",
        }}
      >
        This invitation link is private and tied to your email address. If you
        weren't expecting it, you can safely ignore this message.
      </Text>
      <EmailButton href={inviteUrl} text="Accept Invitation" />
      <Text
        style={{
          fontSize: "12px",
          color: colors.onSurfaceVariant,
          margin: "0 0 8px 0",
          lineHeight: "1.5",
        }}
      >
        If the button doesn't work, copy and paste this link into your browser:
      </Text>
      <Text
        style={{
          fontSize: "12px",
          color: colors.primary,
          margin: "0 0 8px 0",
          lineHeight: "1.5",
          wordBreak: "break-all",
        }}
      >
        {inviteUrl}
      </Text>
      <EmailFooter />
    </EmailLayout>
  )
}
