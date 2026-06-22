import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { parseCatalogParams } from "./params"
import { listCatalogProducts } from "./query"

function getSalesChannelIds(req: MedusaRequest) {
  const context = (req as any).publishable_key_context
  const ids = context?.sales_channel_ids
  return Array.isArray(ids) ? ids.filter(Boolean) : []
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const parsed = parseCatalogParams(req.query)

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid catalog query parameters." })
    return
  }

  const catalogProducts = await listCatalogProducts(
    req.scope,
    parsed.data,
    getSalesChannelIds(req)
  )

  res.json({ catalog_products: catalogProducts })
}
