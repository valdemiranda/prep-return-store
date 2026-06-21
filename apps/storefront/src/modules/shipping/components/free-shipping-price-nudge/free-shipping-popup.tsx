"use client"

import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, XMark } from "@medusajs/icons"
import { StoreCart } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, clx } from "@modules/common/components/ui"
import { useState } from "react"
import { StoreFreeShippingPrice } from "types/global"

// Session cookie (no maxAge) storing the dismissed cart id. Mirrored by the
// server-side reader `getFreeShippingDismissal` in `src/lib/data/cookies.ts`.
const DISMISSAL_COOKIE = "_medusa_freeship_nudge"

function dismissFreeShipping(cartId: string) {
  if (typeof document === "undefined") {
    return
  }

  const secure = process.env.NODE_ENV === "production"
  document.cookie = `${DISMISSAL_COOKIE}=${encodeURIComponent(
    cartId
  )}; path=/; SameSite=Lax${secure ? "; Secure" : ""}`
}

export default function FreeShippingPopup({
  cart,
  price,
}: {
  cart: StoreCart
  price: StoreFreeShippingPrice
}) {
  const [isClosed, setIsClosed] = useState(false)

  const handleClose = () => {
    dismissFreeShipping(cart.id)
    setIsClosed(true)
  }

  return (
    <div
      className={clx(
        "fixed bottom-5 right-5 flex flex-col items-end gap-2 transition-all duration-500 ease-in-out z-10",
        {
          "opacity-0 invisible delay-1000": price.target_reached,
          "opacity-0 invisible": isClosed,
          "opacity-100 visible": !price.target_reached && !isClosed,
        }
      )}
    >
      <div>
        <Button
          className="rounded-full bg-neutral-900 shadow-none outline-none border-none text-[15px] p-2"
          onClick={handleClose}
        >
          <XMark />
        </Button>
      </div>

      <div className="w-[400px] bg-black text-white p-6 rounded-lg ">
        <div className="pb-4">
          <div className="space-y-3">
            <div className="flex justify-between text-[15px] text-neutral-400">
              <div>
                {price.target_reached ? (
                  <div className="flex items-center gap-1.5">
                    {" "}
                    <CheckCircleSolid className="text-green-500 inline-block" />{" "}
                    Free Shipping unlocked!
                  </div>
                ) : (
                  `Unlock Free Shipping`
                )}
              </div>

              <div
                className={clx("visible", {
                  "opacity-0 invisible": price.target_reached,
                })}
              >
                Only{" "}
                <span className="text-white">
                  {convertToLocale({
                    amount: price.target_remaining,
                    currency_code: cart.currency_code,
                  })}
                </span>{" "}
                away
              </div>
            </div>
            <div className="flex justify-between gap-1">
              <div
                className={clx(
                  "bg-gradient-to-r from-zinc-400 to-zinc-500 h-1.5 rounded-full max-w-full duration-500 ease-in-out",
                  {
                    "from-green-400 to-green-500": price.target_reached,
                  }
                )}
                style={{ width: `${price.remaining_percentage}%` }}
              ></div>
              <div className="bg-zinc-600 h-1.5 rounded-full w-fit flex-grow"></div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <LocalizedClientLink
            className="rounded-2xl bg-transparent shadow-none outline-none border-[1px] border-white text-[15px] py-2.5 px-4"
            href="/cart"
          >
            View cart
          </LocalizedClientLink>

          <LocalizedClientLink
            className="flex-grow rounded-2xl bg-white text-neutral-950 shadow-none outline-none border-[1px] border-white text-[15px] py-2.5 px-4 text-center"
            href="/store"
          >
            View products
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
