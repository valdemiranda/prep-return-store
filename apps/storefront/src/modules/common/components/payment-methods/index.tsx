import Image from "next/image"

export default function PaymentMethods({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center gap-2 md:items-end ${
        className || ""
      }`}
    >
      <span className="font-bold uppercase tracking-wider text-on-surface">
        Accepted payments
      </span>
      <Image
        src="/payment/accepted-payment-methods.png"
        alt="Accepted payment methods: credit cards via Stripe and PayPal"
        width={964}
        height={167}
        className="h-10 w-auto max-w-[min(100%,260px)] object-contain md:h-12 md:max-w-[320px]"
      />
      <span className="sr-only">
        We accept Visa, Mastercard, American Express, and PayPal. Credit card
        payments are processed via Stripe.
      </span>
    </div>
  )
}
