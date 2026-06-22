import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"

import { sendSupportEmail } from "../../../utils/support-email"

const supportRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(5000),
})

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = supportRequestSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ message: "Please complete all support fields." })
    return
  }

  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    await sendSupportEmail(parsed.data)
  } catch (error) {
    logger.error("Failed to send support request email", error)
    res.status(502).json({
      message: "We could not send your message. Please try again later.",
    })
    return
  }

  res.json({ success: true })
}

