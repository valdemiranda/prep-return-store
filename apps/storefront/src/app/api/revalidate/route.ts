import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

/**
 * Webhook de invalidação de cache, chamado pelo backend (subscriber
 * catalog-cache) quando produtos/categorias/coleções mudam no admin. Não é
 * exposto ao browser: valida um secret compartilhado (REVALIDATE_SECRET) e
 * dispara revalidateTag/revalidatePath. O matcher do middleware já exclui /api,
 * então esta rota não sofre redirect nem recebe o cookie _medusa_cache_id.
 *
 * Body: { tag?: string, tags?: string[], path?: string, paths?: string[] }.
 */
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET
  const provided = req.headers.get("x-revalidate-secret")

  if (!secret || !provided || provided !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const tagList = body?.tags ?? (body?.tag ? [body.tag] : [])
  const pathList = body?.paths ?? (body?.path ? [body.path] : [])

  const revalidatedTags: string[] = []
  const revalidatedPaths: string[] = []

  for (const tag of tagList) {
    if (typeof tag === "string") {
      revalidateTag(tag)
      revalidatedTags.push(tag)
    }
  }

  for (const path of pathList) {
    if (typeof path === "string") {
      revalidatePath(path)
      revalidatedPaths.push(path)
    }
  }

  return NextResponse.json({
    ok: true,
    revalidated: { tags: revalidatedTags, paths: revalidatedPaths },
  })
}
