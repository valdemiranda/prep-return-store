import { MedusaError } from "@medusajs/framework/utils"

const SENDGRID_CONTACTS_URL = "https://api.sendgrid.com/v3/marketing/contacts"

type AddContactInput = {
  email: string
  firstName?: string
  lastName?: string
}

type AddContactResult = {
  job_id?: string
}

/**
 * Adds (or updates) a contact in a SendGrid Marketing list.
 *
 * SendGrid's Marketing Contacts API is a separate surface from the
 * transactional Mail Send API used by `@medusajs/medusa/notification-sendgrid`,
 * so it is handled by its own module rather than the notification provider.
 */
class SendgridMarketingModuleService {
  async addContact({
    email,
    firstName,
    lastName,
  }: AddContactInput): Promise<AddContactResult> {
    const apiKey = process.env.SENDGRID_API_KEY
    const listId = process.env.SENDGRID_NEWSLETTER_LIST_ID

    if (!apiKey || !listId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "SENDGRID_API_KEY and SENDGRID_NEWSLETTER_LIST_ID must be configured to subscribe to the newsletter."
      )
    }

    const response = await fetch(SENDGRID_CONTACTS_URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        list_ids: [listId],
        contacts: [
          {
            email: email.toLowerCase(),
            first_name: firstName,
            last_name: lastName,
          },
        ],
      }),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to subscribe email to the newsletter: ${response.status} ${detail}`
      )
    }

    return response.json().catch(() => ({})) as Promise<AddContactResult>
  }
}

export default SendgridMarketingModuleService
