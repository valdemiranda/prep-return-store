import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
    category?: string
    price?: string
    sale?: string
    new_arrivals?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, q, category, price, sale, new_arrivals } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      query={q}
      filterCategory={category}
      price={price}
      sale={sale}
      newArrivals={new_arrivals}
      countryCode={params.countryCode}
    />
  )
}
