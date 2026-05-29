/**
 * Free shipping is modeled as a conditional shipping-option price of `0`
 * that only applies when the cart's item total is greater than or equal to
 * a configurable threshold. Medusa evaluates this rule natively at checkout.
 */
export const FREE_SHIPPING_ATTRIBUTE = "item_total"
export const FREE_SHIPPING_OPERATOR = "gte"

export type FreeShippingConfig = {
  shipping_option_id: string
  threshold: number
}

export type FreeShippingState = {
  currency_code: string
  shipping_options: { id: string; name: string }[]
  config: FreeShippingConfig | null
}
