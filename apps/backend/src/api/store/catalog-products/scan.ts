import { mapWithConcurrency } from "../../../utils/map-with-concurrency";
import { attachInventoryQuantities } from "./availability";
import { ProductSummary, summarizeProduct } from "./pricing";

const INDEX_BATCH_SIZE = 500;
// Cada lote faz várias consultas (produtos, preços, inventory items, níveis de
// estoque), então poucos lotes simultâneos já bastam sem esgotar o pool do
// Postgres.
const BATCH_CONCURRENCY = 3;

const INDEX_FIELDS = [
  "id",
  "created_at",
  "variants.id",
  "variants.calculated_price.*",
  "variants.manage_inventory",
  "variants.allow_backorder",
];

type ScanInput = {
  filters: Record<string, unknown>;
  context?: Record<string, unknown>;
  maxScan: number;
  salesChannelIds: string[];
};

async function fetchBatch(
  query: any,
  input: ScanInput,
  skip: number,
  take: number,
) {
  const { data, metadata } = await query.graph(
    {
      entity: "product",
      fields: INDEX_FIELDS,
      filters: input.filters,
      pagination: { take, skip, order: { created_at: "DESC" } },
      context: input.context,
    },
    { cache: { enable: true } },
  );

  await attachInventoryQuantities(query, data, input.salesChannelIds);

  return {
    summaries: data.map(summarizeProduct) as ProductSummary[],
    count: (metadata?.count ?? 0) as number,
  };
}

/**
 * Lê até `maxScan` produtos que batem com os filtros, já com o estoque real.
 * O primeiro lote revela o total; os demais rodam em paralelo (com limite)
 * porque, somando o cálculo de estoque, varrer lote a lote fazia a latência
 * crescer linearmente com o tamanho do catálogo.
 */
export async function scanProductSummaries(
  query: any,
  input: ScanInput,
): Promise<ProductSummary[]> {
  const firstTake = Math.min(INDEX_BATCH_SIZE, input.maxScan);
  const first = await fetchBatch(query, input, 0, firstTake);
  const total = Math.min(first.count, input.maxScan);

  const skips: number[] = [];
  for (let skip = firstTake; skip < total; skip += INDEX_BATCH_SIZE) {
    skips.push(skip);
  }

  const rest = await mapWithConcurrency(skips, BATCH_CONCURRENCY, (skip) =>
    fetchBatch(query, input, skip, Math.min(INDEX_BATCH_SIZE, total - skip)),
  );

  return [first, ...rest].flatMap((batch) => batch.summaries);
}
