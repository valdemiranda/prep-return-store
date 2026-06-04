import { Input } from "@modules/common/components/ui/input"
import { Button } from "@modules/common/components/ui/button"

export default function TrackingForm({
  defaultOrderId = "",
  defaultEmail = "",
}: {
  defaultOrderId?: string
  defaultEmail?: string
}) {
  return (
    <form
      method="GET"
      className="bg-white border border-outline-variant p-6 rounded-sm w-full max-w-md mx-auto flex flex-col gap-4 shadow-sm"
    >
      <h2 className="font-headline text-lg font-extrabold uppercase text-on-surface">
        Track Your Order
      </h2>
      <p className="text-xs text-on-surface-variant">
        Enter your order number and the email used at checkout to view the
        latest delivery status.
      </p>
      <Input
        label="Order Number"
        name="orderid"
        defaultValue={defaultOrderId}
        placeholder="order_..."
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        defaultValue={defaultEmail}
        placeholder="you@example.com"
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-2">
        Track Order
      </Button>
    </form>
  )
}
