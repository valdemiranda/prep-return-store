"use client"

import { Button } from "@modules/common/components/ui"
import type { PaymentSession } from "."

type PaypalPaymentButtonProps = {
  notReady: boolean
  paymentSession?: PaymentSession
  "data-testid"?: string
}

const PaypalPaymentButton = ({
  notReady,
  paymentSession,
  "data-testid": dataTestId,
}: PaypalPaymentButtonProps) => {
  const approvalUrl = paymentSession?.data?.approval_url
  const paypalCheckoutUrl =
    typeof approvalUrl === "string" ? approvalUrl : undefined

  const handlePayment = () => {
    if (paypalCheckoutUrl) {
      window.location.assign(paypalCheckoutUrl)
    }
  }

  return (
    <Button
      disabled={notReady || !paypalCheckoutUrl}
      onClick={handlePayment}
      size="large"
      data-testid={dataTestId}
    >
      Continue with PayPal
    </Button>
  )
}

export default PaypalPaymentButton
