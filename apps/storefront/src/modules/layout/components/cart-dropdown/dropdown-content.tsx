"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@modules/common/components/ui"
import Thumbnail from "@modules/products/components/thumbnail"

type DropdownContentProps = {
  cart: HttpTypes.StoreCart | null | undefined
  subtotal: number
  onClose: () => void
}

const DropdownContent = ({ cart, subtotal, onClose }: DropdownContentProps) => {
  if (!cart?.items?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-y-4 py-16">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-on-surface">
          0
        </div>
        <span className="text-sm text-on-surface-variant">
          Your cart is empty.
        </span>
        <LocalizedClientLink href="/store">
          <Button onClick={onClose}>Shop deals</Button>
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <>
      <div className="grid max-h-[402px] grid-cols-1 gap-y-6 overflow-y-scroll px-4 p-px no-scrollbar">
        {cart.items
          .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
          .map((item) => (
            <div
              className="grid grid-cols-[96px_1fr] gap-x-4"
              data-testid="cart-item"
              key={item.id}
            >
              <LocalizedClientLink
                className="w-24"
                href={`/products/${item.product_handle}`}
              >
                <Thumbnail
                  images={item.product?.images}
                  isContain
                  size="square"
                  thumbnail={item.thumbnail}
                />
              </LocalizedClientLink>
              <div className="flex flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="whitespace-normal break-words text-sm font-bold text-on-surface">
                      <LocalizedClientLink
                        data-testid="product-link"
                        href={`/products/${item.product_handle}`}
                      >
                        {item.title}
                      </LocalizedClientLink>
                    </h3>
                    <LineItemOptions
                      data-testid="cart-item-variant"
                      data-value={item.variant}
                      variant={item.variant}
                    />
                    <span
                      className="text-xs text-on-surface-variant"
                      data-testid="cart-item-quantity"
                      data-value={item.quantity}
                    >
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <LineItemPrice
                    currencyCode={cart.currency_code}
                    item={item}
                    style="tight"
                  />
                </div>
                <DeleteButton
                  className="mt-1 text-xs text-on-surface-variant hover:text-primary"
                  data-testid="cart-item-remove-button"
                  id={item.id}
                >
                  Remove
                </DeleteButton>
              </div>
            </div>
          ))}
      </div>
      <div className="flex flex-col gap-y-4 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-on-surface">
            Subtotal <span className="font-normal">(excl. taxes)</span>
          </span>
          <span
            className="font-headline text-lg font-extrabold text-primary"
            data-testid="cart-subtotal"
            data-value={subtotal}
          >
            {convertToLocale({ amount: subtotal, currency_code: cart.currency_code })}
          </span>
        </div>
        <LocalizedClientLink href="/cart" passHref>
          <Button className="w-full" data-testid="go-to-cart-button" size="large">
            Go to cart
          </Button>
        </LocalizedClientLink>
      </div>
    </>
  )
}

export default DropdownContent
