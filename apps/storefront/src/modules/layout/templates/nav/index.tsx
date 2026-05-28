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
      <header className="relative mx-auto border-b duration-200 bg-surface border-surface-container-highest">
        <nav className="content-container flex flex-col md:flex-row items-center justify-between w-full text-body-sm font-label-bold gap-3 md:gap-4 py-3 md:py-0 md:h-16">
          <div className="flex items-center justify-between md:justify-start gap-6 w-full md:w-auto flex-1">
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

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-x-3 shrink-0">
              <LocalizedClientLink
                className="text-on-surface hover:text-primary transition-colors flex items-center justify-center p-2 hover:bg-surface-container-low rounded-full min-h-[40px] min-w-[40px]"
                href="/account"
                data-testid="nav-account-link"
              >
                <User className="w-5 h-5" />
              </LocalizedClientLink>
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="text-on-surface hover:text-primary transition-colors flex items-center justify-center p-2 hover:bg-surface-container-low rounded-full relative min-h-[40px]"
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
          </div>

          {/* Centered search bar */}
          <div className="w-full md:flex-[2] md:max-w-xl flex justify-center order-3 md:order-2 px-1 md:px-0">
            <StoreSearch />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-x-4 flex-1 justify-end shrink-0 order-2 md:order-3">
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
