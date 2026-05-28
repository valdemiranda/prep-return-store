"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { addToCart } from "@lib/data/cart"
import { Button } from "@modules/common/components/ui/button"

export default function AddToCartButton({ variantId }: { variantId: string }) {
  const params = useParams()
  const countryCode = (params.countryCode as string) || "us"
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    try {
      await addToCart({ variantId, quantity: 1, countryCode })
    } catch (err) {
      console.error(err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      onClick={handleAdd}
      type="button"
      variant="primary"
      className="w-full uppercase font-bold text-xs tracking-wider py-2.5 h-10"
      isLoading={isAdding}
    >
      Add to cart
    </Button>
  )
}
