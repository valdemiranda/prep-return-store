import { parseCatalogParams } from "../params"
import { listCatalogProducts } from "../query"

type StockSpec = {
  // `null` = managed variant without any inventory item linked.
  available?: number | null
  manageInventory?: boolean
  allowBackorder?: boolean
  noVariants?: boolean
}

const BASE_TIME = Date.UTC(2026, 0, 1)
const CHANNEL_LOCATION = "sloc_channel"
const OTHER_LOCATION = "sloc_other"

/**
 * Fake of Medusa's `query.graph` covering only the entities the catalog route
 * touches. Products are listed newest first, mirroring the route's
 * `order: { created_at: "DESC" }`.
 */
function makeCatalog(
  specs: StockSpec[],
  options: { stockLocation?: string } = {}
) {
  const productCalls: { skip: number; take: number }[] = []
  const entities: string[] = []
  const location = options.stockLocation ?? CHANNEL_LOCATION
  const products = specs.map((spec, index) => ({
    id: `prod_${String(index).padStart(4, "0")}`,
    createdAt: new Date(BASE_TIME - index * 1000).toISOString(),
    spec,
  }))

  const graph = async ({ entity, filters, pagination }: any) => {
    entities.push(entity)

    if (entity === "product_sales_channel") {
      const data = products.map(({ id }) => ({ product_id: id }))
      return { data, metadata: { count: data.length } }
    }

    if (entity === "region") {
      return { data: [{ id: "reg_us", currency_code: "usd" }] }
    }

    if (entity === "sales_channel_locations") {
      return { data: [{ stock_location_id: CHANNEL_LOCATION }] }
    }

    if (entity === "product_variant_inventory_items") {
      const data = products
        .filter(({ id, spec }) => {
          const variantId = `${id}_variant`
          return (
            filters.variant_id.includes(variantId) &&
            spec.available !== null &&
            spec.available !== undefined
          )
        })
        .map(({ id, spec }) => ({
          variant_id: `${id}_variant`,
          required_quantity: 1,
          inventory: {
            location_levels: [
              { location_id: location, available_quantity: spec.available },
            ],
          },
        }))
      return { data }
    }

    if (entity === "product") {
      productCalls.push({ skip: pagination.skip, take: pagination.take })
      const allowed = new Set(filters.id ?? products.map(({ id }) => id))
      const matching = products.filter(({ id }) => allowed.has(id))
      const data = matching
        .slice(pagination.skip, pagination.skip + pagination.take)
        .map(({ id, createdAt, spec }) => ({
          id,
          created_at: createdAt,
          variants: spec.noVariants
            ? []
            : [
                {
                  id: `${id}_variant`,
                  manage_inventory: spec.manageInventory ?? true,
                  allow_backorder: spec.allowBackorder ?? false,
                  calculated_price: { calculated_amount: 10 },
                },
              ],
        }))
      return { data, metadata: { count: matching.length } }
    }

    throw new Error(`Unexpected entity ${entity}`)
  }

  const container = { resolve: () => ({ graph }) } as any
  return { container, productCalls, entities, ids: products.map(({ id }) => id) }
}

function params(query: Record<string, string>) {
  const parsed = parseCatalogParams({ region_id: "reg_us", ...query })
  if (!parsed.success) {
    throw new Error("invalid params")
  }
  return parsed.data
}

describe("listCatalogProducts", () => {
  it("drops out-of-stock products before paginating, so every page is full", async () => {
    // Every third product is sold out: 20 of 30 are in stock.
    const specs = Array.from({ length: 30 }, (_, index) => ({
      available: index % 3 === 0 ? 0 : 5,
    }))
    const { container, ids } = makeCatalog(specs)
    const inStock = ids.filter((_, index) => index % 3 !== 0)

    const page1 = await listCatalogProducts(
      container,
      params({ limit: "12", offset: "0" }),
      ["sc_1"]
    )
    const page2 = await listCatalogProducts(
      container,
      params({ limit: "12", offset: "12" }),
      ["sc_1"]
    )

    expect(page1.count).toBe(20)
    expect(page1.product_ids).toEqual(inStock.slice(0, 12))
    expect(page2.product_ids).toEqual(inStock.slice(12))
  })

  it("applies the same stock rule as the storefront", async () => {
    const { container, ids } = makeCatalog([
      { manageInventory: false },
      { allowBackorder: true, available: 0 },
      { available: null },
      { noVariants: true },
      { available: 1 },
    ])

    const result = await listCatalogProducts(
      container,
      params({ limit: "12" }),
      ["sc_1"]
    )

    expect(result.product_ids).toEqual([ids[0], ids[1], ids[4]])
    expect(result.count).toBe(3)
  })

  it("only counts stock in the sales channel's locations", async () => {
    const { container } = makeCatalog([{ available: 7 }], {
      stockLocation: OTHER_LOCATION,
    })

    const result = await listCatalogProducts(
      container,
      params({ limit: "12" }),
      ["sc_1"]
    )

    expect(result.count).toBe(0)
  })

  it("sums every location when the key has several sales channels", async () => {
    const { container, entities } = makeCatalog([{ available: 7 }], {
      stockLocation: OTHER_LOCATION,
    })

    const result = await listCatalogProducts(
      container,
      params({ limit: "12" }),
      ["sc_1", "sc_2"]
    )

    expect(result.count).toBe(1)
    expect(entities).not.toContain("sales_channel_locations")
  })

  it("scans large catalogs in batches and keeps newest-first order", async () => {
    const specs = Array.from({ length: 1200 }, () => ({ available: 1 }))
    const { container, productCalls, ids } = makeCatalog(specs)

    const result = await listCatalogProducts(
      container,
      params({ limit: "12", offset: "1188" }),
      ["sc_1"]
    )

    expect(result.count).toBe(1200)
    expect(result.product_ids).toEqual(ids.slice(1188))
    expect(productCalls).toEqual(
      expect.arrayContaining([
        { skip: 0, take: 500 },
        { skip: 500, take: 500 },
        { skip: 1000, take: 200 },
      ])
    )
    expect(productCalls).toHaveLength(3)
  })

  it("caps new arrivals at the 50 newest products", async () => {
    const specs = Array.from({ length: 120 }, () => ({ available: 1 }))
    const { container, productCalls, ids } = makeCatalog(specs)

    const result = await listCatalogProducts(
      container,
      params({ limit: "12", new_arrivals: "true" }),
      ["sc_1"]
    )

    expect(productCalls).toEqual([{ skip: 0, take: 50 }])
    expect(result.count).toBe(50)
    expect(result.product_ids).toEqual(ids.slice(0, 12))
  })
})
