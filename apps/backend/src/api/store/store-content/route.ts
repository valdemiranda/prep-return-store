import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import StoreContentModuleService from "../../../modules/store-content/service"
import { STORE_CONTENT_MODULE } from "../../../modules/store-content"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: StoreContentModuleService = req.scope.resolve(
    STORE_CONTENT_MODULE
  )

  res.json({
    store_content: await service.retrieveMainContent(),
  })
}
