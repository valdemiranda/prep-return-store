// Os tamanhos de página precisam ser múltiplos de todas as contagens de colunas
// da grade abaixo (2, 3, 4 e 6); senão a última linha de toda página fica com
// espaços vazios. Por isso a grade pula de 4 direto para 6 colunas: com 5,
// 12 e 24 produtos deixavam a última linha incompleta.
export const PRODUCT_PAGE_SIZE = 12
export const STORE_PRODUCT_PAGE_SIZE = 24

// Fica em `src/modules` (e não em `src/lib`) porque o Tailwind só gera as
// classes encontradas nos caminhos de `content` do tailwind.config.js.
export const PRODUCT_GRID_COLUMNS =
  "grid-cols-2 small:grid-cols-3 medium:grid-cols-4 xlarge:grid-cols-6"
