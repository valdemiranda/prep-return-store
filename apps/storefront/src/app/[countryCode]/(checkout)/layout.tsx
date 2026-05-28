import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrandLogo from "@modules/layout/components/brand-logo"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative w-full bg-surface small:min-h-screen">
      <div className="h-20 border-b border-surface-container-highest bg-surface">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="flex flex-1 basis-0 items-center gap-x-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block">Back to cart</span>
            <span className="mt-px block small:hidden">Back</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="transition-all duration-200 hover:scale-[1.02] active:scale-95"
            data-testid="store-link"
          >
            <BrandLogo />
          </LocalizedClientLink>
          <div className="hidden flex-1 basis-0 justify-end text-xs font-bold uppercase tracking-widest text-primary small:flex">
            Secure checkout
          </div>
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
    </div>
  )
}
