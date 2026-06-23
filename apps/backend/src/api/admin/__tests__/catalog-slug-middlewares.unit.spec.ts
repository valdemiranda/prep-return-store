import {
  adminBatchProductSlugMiddleware,
  adminCategorySlugMiddleware,
  adminProductSlugMiddleware,
} from "../catalog-slug-middlewares"

const makeReq = (payload: Record<string, unknown>, existing: string[] = []) =>
  ({
    body: payload,
    validatedBody: structuredClone(payload),
    scope: {
      resolve: () => ({
        listAndCountProducts: async ({ handle }: { handle: string }) => [
          [],
          existing.includes(handle) ? 1 : 0,
        ],
      }),
    },
  }) as any

describe("catalog slug middlewares", () => {
  it("updates the validated product body used by Medusa routes", async () => {
    const req = makeReq(
      {
        title: "Funko Pop Demon Slayer Kagaya Ubuyashiki 1289 Special Edition Figure",
        metadata: { condition: "Open Box" },
      },
      ["funko-pop-demon-slayer-kagaya-ubuyashiki-1289-special-edition-figure"]
    )
    const next = jest.fn()

    await adminProductSlugMiddleware(req, {} as any, next)

    expect(req.validatedBody.handle).toBe(
      "funko-pop-demon-slayer-kagaya-ubuyashiki-1289-special-edition-figure-open-box"
    )
    expect(req.body.handle).toBe(req.validatedBody.handle)
    expect(next).toHaveBeenCalled()
  })

  it("deduplicates batch-created products against the database and request", async () => {
    const req = makeReq(
      {
        create: [
          { title: "iPhone", metadata: { condition: "Used" } },
          { title: "iPhone", metadata: { condition: "Used" } },
        ],
      },
      ["iphone", "iphone-used"]
    )

    await adminBatchProductSlugMiddleware(req, {} as any, jest.fn())

    expect(req.validatedBody.create.map((product: any) => product.handle)).toEqual([
      "iphone-2",
      "iphone-3",
    ])
    expect(req.body.create[0].handle).toBe("iphone-2")
  })

  it("updates the validated category body used by Medusa routes", () => {
    const req = makeReq({ name: "Câmeras & Áudio / TV 4K!!!" })

    adminCategorySlugMiddleware(req, {} as any, jest.fn())

    expect(req.validatedBody.handle).toBe("cameras-audio-tv-4k")
    expect(req.body.handle).toBe(req.validatedBody.handle)
  })
})
