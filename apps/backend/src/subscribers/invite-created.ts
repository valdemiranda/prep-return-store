import { createElement } from "react"
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { InviteUserEmail } from "../email-templates/invite-user"
import { getAdminUrl } from "../email-templates/formatters"
import { sendEmail } from "../utils/send-email"

type InvitePayload = { id: string }

/**
 * Builds the admin invite URL, normalizing slashes so a trailing slash on the
 * base URL or a leading slash on the admin path never produces a `//`.
 */
function buildInviteUrl(base: string, adminPath: unknown, token: string) {
  const cleanBase = (base || "").replace(/\/+$/, "")
  const cleanPath = String(adminPath || "app").replace(/^\/+/, "")

  return `${cleanBase}/${cleanPath}/invite?token=${token}`
}

export default async function inviteCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<InvitePayload>) {
  const query = container.resolve("query")

  const {
    data: [invite],
  } = await query.graph({
    entity: "invite",
    fields: ["email", "token"],
    filters: { id: data.id },
  })

  if (!invite?.email || !invite?.token) {
    return
  }

  const {
    data: [store],
  } = await query.graph({
    entity: "store",
    fields: ["name"],
  })

  const config = container.resolve("configModule")
  const storeName = store?.name || "our store"
  const inviteUrl = buildInviteUrl(getAdminUrl(), config?.admin?.path, invite.token)

  await sendEmail({
    container,
    to: invite.email,
    subject: `You've been invited to join ${storeName}`,
    template: createElement(InviteUserEmail, {
      inviteUrl,
      storeName,
      email: invite.email,
    }),
  })
}

export const config: SubscriberConfig = {
  event: ["invite.created", "invite.resent"],
}
