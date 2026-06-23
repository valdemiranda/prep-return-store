import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { resolveUniqueSlug, toUrlSlug } from "../../utils/slug"

type AdminCatalogBody = {
  handle?: unknown
  metadata?: Record<string, unknown> | null
  name?: unknown
  title?: unknown
}

function getBody(req: MedusaRequest): AdminCatalogBody | undefined {
  return req.body && typeof req.body === "object"
    ? (req.body as AdminCatalogBody)
    : undefined
}

export async function adminProductSlugMiddleware(
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction
) {
  const body = getBody(req)

  if (!body) {
    next()
    return
  }

  const productModule = req.scope.resolve<IProductModuleService>(
    Modules.PRODUCT
  )
  const baseSlug = toUrlSlug(body.handle ?? body.title, "product")
  const condition =
    typeof body.metadata?.condition === "string"
      ? body.metadata.condition
      : undefined

  body.handle = await resolveUniqueSlug(
    baseSlug,
    async (handle) => {
      const [, count] = await productModule.listAndCountProducts(
        { handle },
        { select: ["id"], take: 1 }
      )

      return count > 0
    },
    condition
  )

  next()
}

export function adminCategorySlugMiddleware(
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction
) {
  const body = getBody(req)

  if (body) {
    body.handle = toUrlSlug(body.handle ?? body.name, "category")
  }

  next()
}
