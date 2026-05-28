import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

const priceRanges: Record<string, [number, number]> = {
  "0-500": [0, 500],
  "500-1500": [500, 1500],
  "1500-3000": [1500, 3000],
  "3000-infinite": [3000, Infinity],
}

export function filterProductsBySale(
  products: HttpTypes.StoreProduct[],
  sale?: string
) {
  if (sale === "true") {
    return products.filter((product) => {
      const { cheapestPrice } = getProductPrice({ product })
      return cheapestPrice?.price_type === "sale"
    })
  }

  if (sale === "false") {
    return products.filter((product) => {
      const { cheapestPrice } = getProductPrice({ product })
      return !!cheapestPrice && cheapestPrice.price_type !== "sale"
    })
  }

  return products
}

export function filterProductsByPrice(
  products: HttpTypes.StoreProduct[],
  price?: string
) {
  if (!price) {
    return products
  }

  if (price.includes("-") && !price.includes(",")) {
    const parts = price.split("-")
    if (parts.length === 2) {
      const min = parseFloat(parts[0])
      const max = parts[1] === "infinite" ? Infinity : parseFloat(parts[1])
      if (!isNaN(min) && !isNaN(max)) {
        return products.filter((product) => {
          const { cheapestPrice } = getProductPrice({ product })
          const amount = cheapestPrice?.calculated_price_number
          if (amount === undefined) {
            return false
          }
          return amount >= min && amount <= max
        })
      }
    }
  }

  const selectedRanges = price.split(",")

  return products.filter((product) => {
    const { cheapestPrice } = getProductPrice({ product })
    const amount = cheapestPrice?.calculated_price_number

    if (amount === undefined) {
      return false
    }

    return selectedRanges.some((bucket) => {
      const range = priceRanges[bucket]

      if (!range) {
        return false
      }

      const [min, max] = range
      return max === Infinity ? amount > min : amount > min && amount <= max
    })
  })
}
