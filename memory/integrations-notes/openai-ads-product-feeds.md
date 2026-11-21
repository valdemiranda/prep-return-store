# OpenAI / ChatGPT Ads Product Feeds

Resumo da documentação oficial da OpenAI para ingestão de catálogo de produtos no ChatGPT Ads e Commerce Product Discovery (consultada via Firecrawl em 2026-11-21).

## Fontes oficiais

- Ads Product Feeds: `https://developers.openai.com/ads/product-feeds.md`
- Commerce Product Feed Schema: `https://developers.openai.com/commerce/specs/file-upload/products.md`
- Submit Product Feeds: `https://developers.openai.com/commerce/guides/submit-product-feeds.md`

## Formatos e entrega

- **Entrega suportada**: upload manual no Business Hub (`https://chatgpt.com/business-hub/`), **URL HTTPS hospedada** (hosted URL) ou **SFTP** (via Ads API `POST /v1/feeds/{feed_id}/sftp_access`).
- **Formato principal no guia de Ads**: **UTF-8 CSV** (uma linha por item ou variante), RFC 4180 (aspas duplas em células com vírgula, aspas ou quebras de linha; aspas internas duplicadas `""`). Também há suporte a JSONL/TSV no schema de Commerce.
- **No storefront deste projeto**: exposto em `GET /chatgpt-feed.csv` (`apps/storefront/src/app/chatgpt-feed.csv/route.ts`), com `Content-Type: text/csv; charset=utf-8` e `revalidate = 3600` (invalidado pela tag `"products"` via webhook de catálogo).

## Campos obrigatórios (Basic + Geo + Ads)

| Campo | Regras |
| --- | --- |
| `item_id` | String estável e única por item/variante no feed. Nunca reutilizar para outro produto. |
| `title` | Texto simples, máx. 150 caracteres. |
| `description` | Texto simples factual (sem HTML), máx. 5.000 caracteres. |
| `url` | URL absoluta HTTP/HTTPS pública da página do produto (com variante selecionada quando houver). |
| `brand` | Marca real do produto (sem placeholders como `n/a` ou `unknown`). |
| `seller_name` | Nome do vendedor exibido na oferta. |
| `image_url` | URL absoluta HTTP/HTTPS direta da imagem principal (JPEG/PNG). Obrigatória. |
| `availability` | `in_stock`, `out_of_stock`, `pre_order`, `backorder` ou `unknown`. Valores vazios ou inválidos rejeitam a linha. |
| `price` | Preço regular positivo em unidades principais + ISO 4217 uppercase (ex.: `79.99 USD`, `7999 JPY`). |
| `target_countries` | Código ISO 3166-1 alpha-2 uppercase (`US`, `CA`, `MX`). Em CSV: `US` (em JSONL: `["US"]`). |
| `store_country` | Código ISO 3166-1 alpha-2 uppercase da loja (`US`). |
| `is_ads_eligible` | Booleano minúsculo (`true`/`false`). Deve ser `true` para processamento em ChatGPT Ads. |

## Campos condicionais e opcionais importantes

- **Variantes**: emitir 1 linha por variante com `item_id` distinto, mesmo `group_id` (diferente de cada `item_id`), `listing_has_variations=true` e `variant_dict` serializado como JSON (`{"Color":"Black","Size":"10"}`). Todas as variantes do grupo devem compartilhar os mesmos nomes de opção e ter combinações únicas.
- **`sale_price`**: opcional; deve ser `> 0`, estritamente menor que `price` e na mesma moeda. Omitir (célula vazia) quando não houver desconto.
- **`condition`**: `new`, `refurbished` ou `used`. Sempre informar para itens usados/recondicionados/open-box (omissão pode ser tratada como `new`).
- **`gtin`**: exatamente 8, 12, 13 ou 14 dígitos numéricos com dígito verificador GS1 válido, preservando zeros à esquerda (sem espaços/hifens). Omitir se inválido.
- **`additional_image_urls`**: em CSV, lista separada por vírgula (vírgulas dentro de URLs devem ser escapadas como `%2C`).
- **`product_category`**: hierarquia separada por ` > ` (ex.: `Apparel & Accessories > Shoes`).
- **`is_eligible_search` / `is_eligible_checkout`**: `true` / `false` para feeds focados em Ads + discovery sem checkout nativo habilitado.
- **Dimensões/peso**: não enviar `length`/`width`/`height`/`weight` sem unidade explícita (`dimensions_unit`/`item_weight_unit`); a OpenAI não infere unidades pelo país. Como o Medusa não armazena unidades, omitimos esses campos.
- **Placeholders proibidos**: nunca preencher opcionais vazios com `"null"`, `"n/a"` ou `"unknown"` (usar célula vazia).

## Gotchas de atualização

- Para tirar um item de circulação quando esgota, manter o item no feed com `availability=out_of_stock` (não omitir silenciosamente, a menos que `is_full_refresh: true` esteja habilitado na conta de Ads).
- No Delta API (`PATCH /v1/feeds/{feed_id}/products`), o preço usa centavos inteiros (`{"amount": 7999, "currency": "USD"}`), diferente do CSV (`79.99 USD`).
