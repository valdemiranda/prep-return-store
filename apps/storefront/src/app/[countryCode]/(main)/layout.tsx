import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { getFreeShippingDismissal } from "@lib/data/cookies"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: {
  children: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []
  let isFreeShippingDismissed = false

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options

    // The free-shipping popup is dismissed per-cart (session cookie set when the
    // user closes it). Skip rendering while the dismissal matches this cart.
    const dismissedCartId = await getFreeShippingDismissal()
    isFreeShippingDismissed = dismissedCartId === cart.id
  }

  return (
    <>
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && !isFreeShippingDismissed && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      {props.children}
      <Footer countryCode={countryCode} />
    </>
  )
}
