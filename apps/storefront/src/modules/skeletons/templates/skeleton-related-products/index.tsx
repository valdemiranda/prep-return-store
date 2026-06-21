import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonRelatedProducts = () => {
  return (
    <section className="bg-surface-container-low">
      <div className="max-w-[1280px] w-full mx-auto px-margin-mobile md:px-gutter py-12 small:py-16">
        <div className="mb-8 small:mb-10">
          <div className="h-7 w-48 animate-pulse bg-surface-container-high rounded-sm"></div>
          <div className="mt-2 pl-4 h-4 w-72 animate-pulse bg-surface-container-high rounded-sm"></div>
        </div>
        <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 xlarge:grid-cols-5 2xlarge:grid-cols-6 gap-x-6 gap-y-10 small:gap-y-12">
          {repeat(6).map((index) => (
            <li key={index}>
              <SkeletonProductPreview />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default SkeletonRelatedProducts
