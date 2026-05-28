import {
  listCategories,
  listCategoriesWithAvailableProducts,
} from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Send, Globe, Mail, MessageSquare } from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrandLogo from "@modules/layout/components/brand-logo"
import InstitutionalLinks from "./institutional-links"

export default async function Footer({
  countryCode,
}: {
  countryCode?: string
}) {
  const [productCategories, { collections }] = await Promise.all([
    (countryCode
      ? listCategoriesWithAvailableProducts({ countryCode })
      : listCategories()
    ).catch(() => []),
    listCollections({ fields: "id,handle,title" }).catch(() => ({
      collections: [],
    })),
  ])

  return (
    <footer className="w-full py-12 px-4 md:px-6 max-w-container-max mx-auto border-t border-outline-variant mt-12 bg-surface text-on-surface">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <BrandLogo />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Unbeatable volume pricing direct to shoppers. Upgrade your space
            while saving more.
          </p>
          <div className="flex gap-4 text-on-surface-variant/70">
            <Globe className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
            <Mail className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
            <MessageSquare className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
          </div>
        </div>

        <InstitutionalLinks />

        <div>
          <h4 className="font-bold text-sm text-on-surface uppercase tracking-wider mb-4">
            Departments
          </h4>
          <ul
            className="space-y-2 text-xs text-on-surface-variant"
            data-testid="footer-categories"
          >
            {productCategories && productCategories.length > 0 ? (
              productCategories.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink
                    className="hover:text-primary transition-colors"
                    href={`/categories/${c.handle}`}
                    data-testid="category-link"
                  >
                    {c.name}
                  </LocalizedClientLink>
                </li>
              ))
            ) : collections && collections.length > 0 ? (
              collections.slice(0, 5).map((col) => (
                <li key={col.id}>
                  <LocalizedClientLink
                    className="hover:text-primary transition-colors"
                    href={`/collections/${col.handle}`}
                  >
                    {col.title}
                  </LocalizedClientLink>
                </li>
              ))
            ) : (
              <>
                <li>
                  <span className="opacity-60">Electronics</span>
                </li>
                <li>
                  <span className="opacity-60">Home</span>
                </li>
                <li>
                  <span className="opacity-60">Fashion</span>
                </li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm text-on-surface uppercase tracking-wider mb-4">
            Newsletter
          </h4>
          <p className="text-xs text-on-surface-variant mb-4">
            Get first access to new shipment alerts.
          </p>
          <div className="flex">
            <input
              className="bg-surface-container border border-r-0 border-outline-variant rounded-l-base w-full px-4 py-2 text-xs focus:ring-1 focus:ring-primary text-on-surface"
              placeholder="Your email"
              type="email"
            />
            <button className="bg-primary hover:bg-primary-container text-white px-4 rounded-r-base transition-colors flex items-center justify-center">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-surface-container-highest mt-12 pt-6 text-center text-xs text-on-surface-variant">
        <p>
          © {new Date().getFullYear()} One Stop Liquidation. All rights
          reserved. Unbeatable volume pricing.
        </p>
      </div>
    </footer>
  )
}
