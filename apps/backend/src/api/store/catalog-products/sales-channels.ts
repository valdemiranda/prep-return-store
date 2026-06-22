const PAGE_SIZE = 1000

export async function listSalesChannelProductIds(
  query: any,
  salesChannelIds: string[]
) {
  if (!salesChannelIds.length) {
    return undefined
  }

  const productIds = new Set<string>()
  let skip = 0
  let count = 0

  do {
    const { data, metadata } = await query.graph(
      {
        entity: "product_sales_channel",
        fields: ["product_id"],
        filters: { sales_channel_id: salesChannelIds },
        pagination: { take: PAGE_SIZE, skip },
      },
      { cache: { enable: true } }
    )

    count = metadata?.count ?? 0
    skip += PAGE_SIZE

    for (const link of data) {
      if (link.product_id) {
        productIds.add(link.product_id)
      }
    }
  } while (skip < count)

  return Array.from(productIds)
}
