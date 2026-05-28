import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

import StoreContentModuleService from "../../../modules/store-content/service"
import { STORE_CONTENT_MODULE } from "../../../modules/store-content"

const text = z.string().trim()
const link = z.string().trim().default("")

const storeContentSchema = z.object({
  hero: z.object({
    backgroundImage: text,
    imageAlt: text,
    eyebrow: text,
    title: text,
    subtitle: text,
    primaryCtaLabel: text,
    primaryCtaLink: link,
    secondaryCtaLabel: text,
    secondaryCtaLink: link,
  }),
  benefitCards: z.array(
    z.object({
      icon: z.string(),
      title: text,
      subtitle: text,
    })
  ),
  promotionalBanners: z.array(
    z.object({
      image: text,
      ctaLink: link,
      accessibilityLabel: text,
    })
  ),
  staticPages: z.object({
    support: z.string(),
    termsOfUse: z.string(),
    privacy: z.string(),
    returnPolicy: z.string(),
  }),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: StoreContentModuleService = req.scope.resolve(
    STORE_CONTENT_MODULE
  )

  res.json({
    store_content: await service.retrieveMainContent(),
  })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const service: StoreContentModuleService = req.scope.resolve(
    STORE_CONTENT_MODULE
  )
  const body = req.body as { store_content?: unknown }
  const storeContent = storeContentSchema.parse(body.store_content)

  res.json({
    store_content: await service.upsertMainContent(storeContent),
  })
}
