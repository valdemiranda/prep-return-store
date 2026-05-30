import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronRight } from "lucide-react"

const ProductBreadcrumbs = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const parent = product.categories?.[0]
    ? {
        href: `/categories/${product.categories[0].handle}`,
        label: product.categories[0].name,
      }
    : product.collection
    ? {
        href: `/collections/${product.collection.handle}`,
        label: product.collection.title,
      }
    : { href: "/store", label: "Deals" }

  return (
    <nav className="mb-6 flex items-center gap-2 text-sm text-on-surface-variant">
      <LocalizedClientLink href="/" className="hover:text-primary">
        Home
      </LocalizedClientLink>
      <ChevronRight className="h-4 w-4" />
      <LocalizedClientLink href={parent.href} className="hover:text-primary">
        {parent.label}
      </LocalizedClientLink>
      <ChevronRight className="h-4 w-4" />
      <span className="line-clamp-1 font-bold text-on-surface">
        {product.title}
      </span>
    </nav>
  )
}

export default ProductBreadcrumbs
