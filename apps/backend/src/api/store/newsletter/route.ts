import { createElement } from "react"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"

import {
  SENDGRID_MARKETING_MODULE,
} from "../../../modules/sendgrid-marketing"
import SendgridMarketingModuleService from "../../../modules/sendgrid-marketing/service"
import { NewsletterWelcomeEmail } from "../../../email-templates/newsletter-welcome"
import { getStoreUrl } from "../../../email-templates/formatters"
import { sendEmail } from "../../../subscribers/send-email"

const newsletterSignupSchema = z.object({
  email: z.string().trim().email(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
})

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = newsletterSignupSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ message: "A valid email is required." })
    return
  }

  const { email, first_name, last_name } = parsed.data
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)
  const sendgridMarketing: SendgridMarketingModuleService = req.scope.resolve(
    SENDGRID_MARKETING_MODULE
  )

  try {
    await sendgridMarketing.addContact({
      email,
      firstName: first_name,
      lastName: last_name,
    })
  } catch (error) {
    logger.error("Failed to subscribe email to the newsletter", error)
    res
      .status(502)
      .json({ message: "We could not complete your subscription. Please try again later." })
    return
  }

  // Welcome email is best-effort: a SendGrid hiccup here should not fail
  // the subscription that already succeeded above.
  try {
    await sendEmail({
      container: req.scope,
      to: email,
      subject: "Welcome to One Stop Liquidation",
      template: createElement(NewsletterWelcomeEmail, {
        email,
        storeUrl: getStoreUrl(),
      }),
    })
  } catch (error) {
    logger.error("Failed to send newsletter welcome email", error)
  }

  res.json({ success: true })
}
