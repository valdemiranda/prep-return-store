import {
  getTotalVariantAvailability,
  getVariantAvailability,
} from "@medusajs/framework/utils";

type IndexedVariant = {
  id: string;
  manage_inventory?: boolean | null;
  allow_backorder?: boolean | null;
  inventory_quantity?: number | null;
};

type IndexedProduct = { variants?: IndexedVariant[] | null };

/**
 * `inventory_quantity` não é coluna do banco: o Medusa o calcula a partir dos
 * inventory items e dos níveis de estoque das locations do canal de vendas.
 * Pedido direto no `query.graph` ele volta `undefined`, então o catálogo
 * paginava produtos sem estoque que o storefront depois escondia, deixando
 * cada página com uma quantidade diferente. Usamos a mesma função da rota
 * `/store/products` para que backend e storefront concordem sobre o estoque.
 */
export async function attachInventoryQuantities(
  query: any,
  products: IndexedProduct[],
  salesChannelIds: string[],
) {
  // Variantes com backorder ou sem controle de estoque são sempre vendáveis,
  // então só calculamos a disponibilidade das demais.
  const variants = products
    .flatMap((product) => product.variants ?? [])
    .filter((variant) => variant.manage_inventory && !variant.allow_backorder);

  if (!variants.length) {
    return;
  }

  const variantIds = variants.map((variant) => variant.id);
  // Com um único canal na chave usamos o mesmo cálculo do `/store/products`.
  // Com zero ou vários canais o Medusa lança erro; aqui preferimos não
  // derrubar a listagem e somamos o estoque de todas as locations.
  const availability =
    salesChannelIds.length === 1
      ? await getVariantAvailability(query, {
          variant_ids: variantIds,
          sales_channel_id: salesChannelIds[0],
        })
      : await getTotalVariantAvailability(query, { variant_ids: variantIds });

  for (const variant of variants) {
    variant.inventory_quantity = availability[variant.id]?.availability ?? 0;
  }
}
