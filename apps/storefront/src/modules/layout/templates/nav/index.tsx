import { Suspense } from "react"
import { User } from "lucide-react"

import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import StoreSearch from "@modules/layout/components/store-search"
import BrandLogo from "@modules/layout/components/brand-logo"

export default async function Nav() {
  const { collections } = await listCollections({ fields: "id,handle,title" })

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-16 mx-auto border-b duration-200 bg-surface border-surface-container-highest">
        <nav className="content-container flex items-center justify-between w-full h-full text-body-sm font-label-bold gap-4">
          <div className="flex items-center gap-6 flex-1">
            <LocalizedClientLink
              href="/"
              className="transition-all duration-200 hover:scale-[1.02] active:scale-95 shrink-0"
              data-testid="nav-store-link"
            >
              <BrandLogo />
            </LocalizedClientLink>
            {/* Desktop collections */}
            <div className="hidden lg:flex items-center gap-4">
              {collections?.slice(0, 3).map((col) => (
                <LocalizedClientLink
                  key={col.id}
                  href={`/collections/${col.handle}`}
                  className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-bold uppercase text-[11px]"
                >
                  {col.title}
                </LocalizedClientLink>
              ))}
            </div>
          </div>

          {/* Centered search bar */}
          <div className="flex-[2] max-w-xl flex justify-center">
            <StoreSearch />
          </div>

          <div className="flex items-center gap-x-4 flex-1 justify-end shrink-0">
            <LocalizedClientLink
              className="text-on-surface hover:text-primary transition-colors flex items-center justify-center p-2 hover:bg-surface-container-low rounded-full"
              href="/account"
              data-testid="nav-account-link"
            >
              <User className="w-5 h-5" />
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-on-surface hover:text-primary transition-colors flex items-center justify-center p-2 hover:bg-surface-container-low rounded-full relative"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
