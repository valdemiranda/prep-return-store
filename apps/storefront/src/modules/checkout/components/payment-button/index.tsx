"use client"

import { isManual, isPaypal, isStripeLike } from "@lib/constants"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import React from "react"
import ManualTestPaymentButton from "./manual-test-payment-button"
import PaypalPaymentButton from "./paypal-payment-button"
import StripePaymentButton from "./stripe-payment-button"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

export type PaymentSession = NonNullable<
  NonNullable<HttpTypes.StoreCart["payment_collection"]>["payment_sessions"]
>[number]

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (session) => session.status === "pending"
  )

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          paymentSession={paymentSession}
          data-testid={dataTestId}
        />
      )
    case isPaypal(paymentSession?.provider_id):
      return (
        <PaypalPaymentButton
          notReady={notReady}
          paymentSession={paymentSession}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

export default PaymentButton
