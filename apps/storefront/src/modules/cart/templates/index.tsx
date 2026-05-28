import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="bg-surface py-8 small:py-12">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="flex flex-col gap-6">
            <nav className="mx-auto mb-2 flex w-full max-w-2xl items-center justify-between px-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  1
                </div>
                <span className="text-xs font-bold uppercase text-primary">
                  Cart
                </span>
              </div>
              <div className="mx-4 mb-6 h-px flex-grow bg-surface-container-highest" />
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-outline-variant text-sm font-bold text-on-surface-variant">
                  2
                </div>
                <span className="text-xs font-bold uppercase text-on-surface-variant">
                  Checkout
                </span>
              </div>
              <div className="mx-4 mb-6 h-px flex-grow bg-surface-container-highest" />
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-outline-variant text-sm font-bold text-on-surface-variant">
                  3
                </div>
                <span className="text-xs font-bold uppercase text-on-surface-variant">
                  Confirmation
                </span>
              </div>
            </nav>
            <div className="border-l-4 border-primary pl-4 mb-4">
              <h1 className="font-headline text-3xl font-extrabold uppercase text-on-surface tracking-tight">
                My cart
              </h1>
              <p className="text-xs text-on-surface-variant mt-1">
                Review your items and finalize your liquidation deal.
              </p>
            </div>
            
            <div className="grid grid-cols-1 small:grid-cols-[1fr_380px] gap-8 items-start">
              <div className="flex flex-col bg-white border border-outline-variant p-6 rounded-sm hover:shadow-sm transition-all gap-y-6">
                {!customer && (
                  <>
                    <SignInPrompt />
                    <Divider />
                  </>
                )}
                <ItemsTemplate cart={cart} />
              </div>
              <div className="relative sticky top-24">
                {cart && cart.region && (
                  <Summary cart={cart} />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
