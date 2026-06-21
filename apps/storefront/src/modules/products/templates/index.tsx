import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductBreadcrumbs from "@modules/products/components/product-breadcrumbs"
import ProductBrand from "@modules/products/components/product-brand"
import ProductCondition from "@modules/products/components/product-condition"
import ProductKeyFeatures from "@modules/products/components/product-key-features"
import ProductShare from "@modules/products/components/product-share"
import ProductTrustBadges from "@modules/products/components/product-trust-badges"
import ProductStockIndicator from "@modules/products/components/product-stock-indicator"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div data-testid="product-container">
      <div className="max-w-[1280px] w-full mx-auto px-margin-mobile md:px-gutter py-8">
        <ProductBreadcrumbs product={product} />

        <div className="grid grid-cols-1 small:grid-cols-12 gap-gutter items-start">
          <div className="w-full small:col-span-7 flex flex-col gap-6">
            <ImageGallery images={images} />
            {/* Desktop: badges fill the empty space below the image */}
            <ProductTrustBadges className="hidden small:block" />
          </div>

          <div className="w-full small:col-span-5 space-y-6">
            <div className="space-y-2">
              <ProductBrand product={product} />
              <h1 className="font-headline text-3xl font-extrabold uppercase text-on-surface tracking-tight leading-tight">
                {product.title}
              </h1>
              <ProductCondition product={product} />
              <div className="flex items-center justify-between gap-4 text-on-surface-variant font-sans text-xs">
                <span>SKU: {product.variants?.[0]?.sku || "LQD-PRD-GEN"}</span>
                <ProductShare product={product} />
              </div>
              <ProductStockIndicator product={product} />
            </div>

            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
            {/* Mobile: badges appear after the add-to-cart, before the description */}
            <ProductTrustBadges className="block small:hidden" />
          </div>
        </div>

        {/* Bottom Grid: Description and Tabs */}
        <div className="mt-12 pt-12 border-t border-outline-variant grid grid-cols-1 small:grid-cols-12 gap-gutter">
          <div className="w-full small:col-span-8 space-y-8 font-sans">
            <ProductKeyFeatures product={product} />

            <section className="space-y-4">
              <h2 className="font-headline text-2xl font-bold border-l-4 border-primary pl-4 uppercase tracking-tight text-on-surface">
                Product Description
              </h2>
              <p className="text-on-surface-variant leading-relaxed text-sm whitespace-pre-line">
                {product.description || "No description available."}
              </p>
            </section>
          </div>

          <div className="w-full small:col-span-4 space-y-6">
            <ProductTabs product={product} />
          </div>
        </div>
      </div>

      <div
        className="mt-8 small:mt-12"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
