import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { MedusaContainer } from "@medusajs/framework/types"
import {
  FREE_SHIPPING_ATTRIBUTE,
  FreeShippingState,
} from "./constants"

export type PriceRuleRow = { attribute: string; operator: string; value: number }
export type PriceRow = {
  id: string
  amount: number
  currency_code: string | null
  price_rules?: PriceRuleRow[]
}
export type ShippingOptionRow = {
  id: string
  name: string
  prices?: PriceRow[]
}

// `shipping_option` exposes the price set's prices directly under `prices`
// (there is no queryable `price_set` relation on the entity itself).
const SHIPPING_OPTION_FIELDS = [
  "id",
  "name",
  "prices.id",
  "prices.amount",
  "prices.currency_code",
  "prices.price_rules.attribute",
  "prices.price_rules.operator",
  "prices.price_rules.value",
]

export async function getDefaultCurrency(
  container: MedusaContainer
): Promise<string> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "store",
    fields: [
      "supported_currencies.currency_code",
      "supported_currencies.is_default",
    ],
  })
  const currencies = data[0]?.supported_currencies ?? []
  const fallback = currencies[0]
  const def = currencies.find((c: any) => c.is_default) ?? fallback
  return def?.currency_code ?? "usd"
}

export async function listShippingOptions(
  container: MedusaContainer
): Promise<ShippingOptionRow[]> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "shipping_option",
    fields: SHIPPING_OPTION_FIELDS,
  })
  return data as ShippingOptionRow[]
}

/** The conditional `item_total` price of an option for the given currency. */
export function findFreeShippingPrice(
  option: ShippingOptionRow,
  currency: string
): PriceRow | undefined {
  return (option.prices ?? []).find(
    (p) =>
      p.currency_code === currency &&
      (p.price_rules ?? []).some(
        (r) => r.attribute === FREE_SHIPPING_ATTRIBUTE
      )
  )
}

function getThreshold(price: PriceRow): number {
  const rule = (price.price_rules ?? []).find(
    (r) => r.attribute === FREE_SHIPPING_ATTRIBUTE
  )
  return rule ? Number(rule.value) : 0
}

export async function getFreeShippingState(
  container: MedusaContainer
): Promise<FreeShippingState> {
  const currency_code = await getDefaultCurrency(container)
  const options = await listShippingOptions(container)

  let config: FreeShippingState["config"] = null
  for (const option of options) {
    const price = findFreeShippingPrice(option, currency_code)
    if (price) {
      config = { shipping_option_id: option.id, threshold: getThreshold(price) }
      break
    }
  }

  return {
    currency_code,
    shipping_options: options.map((o) => ({ id: o.id, name: o.name })),
    config,
  }
}
