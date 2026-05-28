import { HttpTypes } from "@medusajs/types"
import { Check, CreditCard, MapPin, PackageCheck } from "lucide-react"

type CheckoutProgressProps = {
  cart: HttpTypes.StoreCart
}

const CheckoutProgress = ({ cart }: CheckoutProgressProps) => {
  const steps = [
    {
      label: "Identification",
      icon: MapPin,
      done: Boolean(cart.email && cart.shipping_address?.address_1),
    },
    {
      label: "Delivery",
      icon: PackageCheck,
      done: Boolean(cart.shipping_methods?.length),
    },
    {
      label: "Payment",
      icon: CreditCard,
      done: Boolean(cart.payment_collection),
    },
  ]

  return (
    <nav className="flex w-full items-center overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const Icon = step.done ? Check : step.icon

        return (
          <div className="flex flex-1 items-center" key={step.label}>
            <div className="flex items-center gap-3">
              <span
                className={
                  step.done
                    ? "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white"
                    : "flex h-8 w-8 items-center justify-center rounded-full border-2 border-outline-variant text-on-surface-variant"
                }
              >
                <Icon className="h-4 w-4" />
              </span>
              <span
                className={
                  step.done
                    ? "whitespace-nowrap text-xs font-bold uppercase tracking-wider text-primary"
                    : "whitespace-nowrap text-xs font-bold uppercase tracking-wider text-on-surface-variant"
                }
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span className="mx-4 h-px min-w-8 flex-1 bg-surface-container-highest" />
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default CheckoutProgress
