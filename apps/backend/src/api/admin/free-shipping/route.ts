import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

import { getFreeShippingState } from "./queries"
import { applyFreeShipping } from "./mutations"

const applySchema = z
  .object({
    shipping_option_id: z.string().trim().min(1),
    threshold: z.number().nonnegative(),
    enabled: z.boolean(),
  })
  .refine((data) => !data.enabled || data.threshold > 0, {
    message: "threshold must be greater than 0 when free shipping is enabled",
    path: ["threshold"],
  })

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({ free_shipping: await getFreeShippingState(req.scope) })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const input = applySchema.parse(req.body)
  await applyFreeShipping(req.scope, input)

  res.json({ free_shipping: await getFreeShippingState(req.scope) })
}
