"use client"

import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { useRef } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useProductActions } from "./use-product-actions"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

export default function ProductActions({ product, region, disabled }: ProductActionsProps) {
  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const {
    options,
    isAdding,
    selectedVariant,
    isValidVariant,
    inStock,
    setOptionValue,
    handleAddToCart,
  } = useProductActions(product)

  return (
    <div
      ref={actionsRef}
      className="p-5 bg-white border border-outline-variant rounded-sm space-y-4 shadow-sm font-sans"
      data-testid="product-actions"
    >
      <div className="space-y-1">
        <ProductPrice product={product} variant={selectedVariant} />
        {selectedVariant && (
          <p className="text-xs text-green-700 font-bold flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-700 inline-block" />
            In stock - Ready to ship
          </p>
        )}
      </div>

      <div>
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) => (
              <div key={option.id}>
                <OptionSelect
                  option={option}
                  current={options[option.id]}
                  updateOption={setOptionValue}
                  title={option.title ?? ""}
                  data-testid="product-options"
                  disabled={!!disabled || isAdding}
                />
              </div>
            ))}
            <Divider />
          </div>
        )}
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={!inStock || !selectedVariant || !!disabled || isAdding || !isValidVariant}
        variant="primary"
        className="w-full h-12 uppercase font-bold text-sm tracking-wider"
        isLoading={isAdding}
        data-testid="add-product-button"
      >
        {!selectedVariant
          ? "Select a variant"
          : !inStock || !isValidVariant
          ? "Out of stock"
          : "Add to cart"}
      </Button>

      <MobileActions
        product={product}
        variant={selectedVariant}
        options={options}
        updateOptions={setOptionValue}
        inStock={inStock}
        handleAddToCart={handleAddToCart}
        isAdding={isAdding}
        show={!inView}
        optionsDisabled={!!disabled || isAdding}
      />
    </div>
  )
}
