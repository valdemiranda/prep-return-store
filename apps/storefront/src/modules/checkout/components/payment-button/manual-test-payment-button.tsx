"use client"

import { placeOrder } from "@lib/data/cart"
import { Button } from "@modules/common/components/ui"
import Turnstile, {
  isTurnstileConfigured,
} from "@modules/common/components/turnstile"
import { useState } from "react"
import ErrorMessage from "../error-message"

type ManualTestPaymentButtonProps = {
  notReady: boolean
  "data-testid"?: string
}

const ManualTestPaymentButton = ({
  notReady,
  "data-testid": dataTestId,
}: ManualTestPaymentButtonProps) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState("")
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

  const handlePayment = () => {
    if (!captchaReady) {
      return
    }
    setSubmitting(true)
    onPaymentCompleted()
  }

  return (
    <>
      {isTurnstileConfigured && <Turnstile onVerify={setCaptchaToken} />}
      <Button
        disabled={notReady || !captchaReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default ManualTestPaymentButton
