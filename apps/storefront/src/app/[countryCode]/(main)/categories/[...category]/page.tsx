import { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getCategoryByHandle,
  listCategories,
  listCategoriesWithAvailableProducts,
} from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { getPrimaryCountryCode } from "@lib/util/primary-country"
import { HttpTypes, StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    category?: string
    price?: string
    sale?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat(),
  )

  const categoryHandles = product_categories.map(
    (category: HttpTypes.StoreProductCategory) => category.handle,
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: string) => ({
        countryCode,
        category: [handle],
      })),
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)

    const primaryCountry = await getPrimaryCountryCode()
    const description =
      productCategory.description ??
      `Shop ${productCategory.name} at unbeatable liquidation prices.`

    return {
      title: productCategory.name,
      description,
      alternates: {
        canonical: `/${primaryCountry}/categories/${params.category.join("/")}`,
      },
      openGraph: {
        title: productCategory.name,
        description,
      },
    }
  } catch {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page, category: filterCategory, price, sale } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  const activeCategories = await listCategoriesWithAvailableProducts({
    countryCode: params.countryCode,
  }).catch(() => [])
  const isActive = activeCategories.some((c) => c.id === productCategory.id)

  if (!isActive) {
    notFound()
  }

  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      filterCategory={filterCategory}
      price={price}
      sale={sale}
      countryCode={params.countryCode}
    />
  )
}
