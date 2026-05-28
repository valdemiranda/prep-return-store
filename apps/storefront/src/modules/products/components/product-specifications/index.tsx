import { HttpTypes } from "@medusajs/types"

const rows = (product: HttpTypes.StoreProduct) => [
  ["Material", product.material || "-"],
  ["Country of Origin", product.origin_country || "-"],
  ["Tipo", product.type?.value || "-"],
  ["Weight", product.weight ? `${product.weight} g` : "-"],
]

const ProductSpecifications = ({
  product,
}: {
  product: HttpTypes.StoreProduct
}) => {
  return (
    <section className="space-y-4">
      <h2 className="border-l-4 border-primary pl-4 font-headline text-2xl font-bold uppercase tracking-tight text-on-surface">
        Technical Specifications
      </h2>
      <div className="overflow-hidden rounded-sm border border-outline-variant bg-white text-sm">
        {rows(product).map(([label, value], index) => (
          <div
            className={index < 3 ? "grid grid-cols-2 border-b border-outline-variant" : "grid grid-cols-2"}
            key={label}
          >
            <div className="border-r border-outline-variant bg-surface-container-low p-4 font-bold text-on-surface-variant">
              {label}
            </div>
            <div className="p-4 text-on-surface">{value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProductSpecifications
