import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { PRODUCT_GRID_COLUMNS, PRODUCT_PAGE_SIZE } from "@modules/store/constants"

const SkeletonProductGrid = ({
  numberOfProducts = PRODUCT_PAGE_SIZE,
}: {
  numberOfProducts?: number
}) => {
  return (
    <ul
      className={`grid ${PRODUCT_GRID_COLUMNS} gap-x-6 gap-y-8 flex-1`}
      data-testid="products-list-loader"
    >
      {repeat(numberOfProducts).map((index) => (
        <li key={index}>
          <SkeletonProductPreview />
        </li>
      ))}
    </ul>
  )
}

export default SkeletonProductGrid
