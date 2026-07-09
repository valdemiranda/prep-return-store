"use client"

import { sendGAEvent } from "@next/third-parties/google"
import { useEffect, useRef } from "react"

type PurchaseConversionProps = {
  transactionId: string
  value: number
  currency: string
}

const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL

// Dispara o evento de conversão do Google Ads na confirmação do pedido.
// O `transaction_id` permite ao Google deduplicar caso a página seja revisitada.
export default function PurchaseConversion({
  transactionId,
  value,
  currency,
}: PurchaseConversionProps) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current || !conversionId || !conversionLabel) return
    fired.current = true

    sendGAEvent("event", "conversion", {
      send_to: `${conversionId}/${conversionLabel}`,
      value,
      currency: currency.toUpperCase(),
      transaction_id: transactionId,
    })
  }, [transactionId, value, currency])

  return null
}
