import {
  ContainerRegistrationKeys,
  LINKS,
  Modules,
} from "@medusajs/framework/utils"
import { MedusaContainer } from "@medusajs/framework/types"
import {
  FREE_SHIPPING_ATTRIBUTE,
  FREE_SHIPPING_OPERATOR,
} from "./constants"
import {
  findFreeShippingPrice,
  getDefaultCurrency,
  listShippingOptions,
  ShippingOptionRow,
} from "./queries"

export type ApplyInput = {
  shipping_option_id: string
  threshold: number
  enabled: boolean
}

/** Remove every free-shipping conditional price across all options for the currency. */
async function clearAllFreeShipping(
  container: MedusaContainer,
  options: ShippingOptionRow[],
  currency: string
): Promise<void> {
  const pricing = container.resolve(Modules.PRICING)
  const priceIds = options
    .map((option) => findFreeShippingPrice(option, currency)?.id)
    .filter((id): id is string => Boolean(id))

  if (priceIds.length) {
    await pricing.removePrices(priceIds)
  }
}

/** Resolve the price set linked to a shipping option via the module link. */
async function getPriceSetId(
  container: MedusaContainer,
  shippingOptionId: string
): Promise<string | undefined> {
  const remoteQuery = container.resolve(
    ContainerRegistrationKeys.REMOTE_QUERY
  ) as (query: Record<string, unknown>) => Promise<{ price_set_id: string }[]>

  const rows = await remoteQuery({
    service: LINKS.ShippingOptionPriceSet,
    variables: { filters: { shipping_option_id: [shippingOptionId] } },
    fields: ["shipping_option_id", "price_set_id"],
  })

  return rows?.[0]?.price_set_id
}

export async function applyFreeShipping(
  container: MedusaContainer,
  input: ApplyInput
): Promise<void> {
  const currency = await getDefaultCurrency(container)
  const options = await listShippingOptions(container)

  // Enforce the single-option invariant: clear any existing rule first.
  await clearAllFreeShipping(container, options, currency)

  if (!input.enabled) {
    return
  }

  const target = options.find((o) => o.id === input.shipping_option_id)
  if (!target) {
    throw new Error("Shipping option not found")
  }

  const priceSetId = await getPriceSetId(container, input.shipping_option_id)
  if (!priceSetId) {
    throw new Error("Shipping option has no price set")
  }

  const pricing = container.resolve(Modules.PRICING)
  await pricing.addPrices({
    priceSetId,
    prices: [
      {
        currency_code: currency,
        amount: 0,
        rules: {
          [FREE_SHIPPING_ATTRIBUTE]: [
            { operator: FREE_SHIPPING_OPERATOR, value: input.threshold },
          ],
        },
      },
    ],
  })
}
