"use client"

import { useState } from "react"

import { updateLineItem } from "@lib/data/cart"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import Spinner from "@modules/common/icons/spinner"

type QuantityControlProps = {
  itemId: string
  maxQuantity: number
  quantity: number
}

const QuantityControl = ({
  itemId,
  maxQuantity,
  quantity,
}: QuantityControlProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (nextQuantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: itemId,
      quantity: nextQuantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <DeleteButton id={itemId} data-testid="product-delete-button" />
        <CartItemSelect
          value={quantity}
          onChange={(value) => changeQuantity(parseInt(value.target.value))}
          className="h-10 w-14 p-2"
          data-testid="product-select-button"
        >
          {Array.from({ length: Math.min(maxQuantity, 10) }, (_, i) => (
            <option value={i + 1} key={i}>
              {i + 1}
            </option>
          ))}
        </CartItemSelect>
        {updating && <Spinner />}
      </div>
      <ErrorMessage error={error} data-testid="product-error-message" />
    </div>
  )
}

export default QuantityControl
