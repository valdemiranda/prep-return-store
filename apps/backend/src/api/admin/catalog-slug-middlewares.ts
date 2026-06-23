import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { resolveUniqueSlug, toUrlSlug } from "../../utils/slug"

type AdminCatalogBody = {
  create?: AdminCatalogBody[]
  handle?: unknown
  metadata?: Record<string, unknown> | null
  name?: unknown
  title?: unknown
}

type RequestWithValidatedBody = MedusaRequest & {
  validatedBody?: unknown
}

function asCatalogBody(value: unknown): AdminCatalogBody | undefined {
  return value && typeof value === "object"
    ? (value as AdminCatalogBody)
    : undefined
}

function getPayloadPair(req: RequestWithValidatedBody) {
  return {
    body: asCatalogBody(req.body),
    validatedBody: asCatalogBody(req.validatedBody),
  }
}

function assignHandle(
  handle: string,
  ...payloads: (AdminCatalogBody | undefined)[]
) {
  payloads.forEach((payload) => {
    if (payload) {
      payload.handle = handle
    }
  })
}

async function resolveProductHandle(
  req: MedusaRequest,
  product: AdminCatalogBody,
  usedHandles: Set<string>
) {
  const productModule = req.scope.resolve<IProductModuleService>(
    Modules.PRODUCT
  )
  const baseSlug = toUrlSlug(product.handle ?? product.title, "product")
  const condition =
    typeof product.metadata?.condition === "string"
      ? product.metadata.condition
      : undefined

  return await resolveUniqueSlug(
    baseSlug,
    async (handle) => {
      if (usedHandles.has(handle)) {
        return true
      }

      const [, count] = await productModule.listAndCountProducts(
        { handle },
        { select: ["id"], take: 1 }
      )

      return count > 0
    },
    condition
  )
}

export async function adminProductSlugMiddleware(
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction
) {
  const { body, validatedBody } = getPayloadPair(req)
  const product = validatedBody ?? body

  if (product) {
    const handle = await resolveProductHandle(req, product, new Set())
    assignHandle(handle, body, validatedBody)
  }

  next()
}

export async function adminBatchProductSlugMiddleware(
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction
) {
  const { body, validatedBody } = getPayloadPair(req)
  const createProducts = validatedBody?.create ?? body?.create ?? []
  const usedHandles = new Set<string>()

  for (const [index, product] of createProducts.entries()) {
    const handle = await resolveProductHandle(req, product, usedHandles)

    usedHandles.add(handle)
    assignHandle(handle, body?.create?.[index], validatedBody?.create?.[index])
  }

  next()
}

export function adminCategorySlugMiddleware(
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction
) {
  const { body, validatedBody } = getPayloadPair(req)
  const category = validatedBody ?? body

  if (category) {
    const handle = toUrlSlug(category.handle ?? category.name, "category")
    assignHandle(handle, body, validatedBody)
  }

  next()
}
