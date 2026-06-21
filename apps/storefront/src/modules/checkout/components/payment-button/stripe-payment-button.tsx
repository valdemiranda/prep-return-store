"use client"

import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import Turnstile, {
  isTurnstileConfigured,
} from "@modules/common/components/turnstile"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { useState } from "react"
import ErrorMessage from "../error-message"
import type { PaymentSession } from "."

type StripePaymentButtonProps = {
  cart: HttpTypes.StoreCart
  notReady: boolean
  paymentSession?: PaymentSession
  "data-testid"?: string
}

const StripePaymentButton = ({
  cart,
  notReady,
  paymentSession,
  "data-testid": dataTestId,
}: StripePaymentButtonProps) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState("")
  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")
  // Quando o captcha está habilitado, exige o token antes de habilitar o envio.
  const captchaReady = !isTurnstileConfigured || Boolean(captchaToken)

  const onPaymentCompleted = async () => {
    await placeOrder(undefined, captchaToken)
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart || !captchaReady) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(paymentSession?.data?.client_secret as string, {
        payment_method: {
          card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }
      })
  }

  return (
    <>
      {isTurnstileConfigured && <Turnstile onVerify={setCaptchaToken} />}
      <Button
        disabled={!stripe || !elements || notReady || !captchaReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

export default StripePaymentButton
