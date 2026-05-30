"use client"

import { HttpTypes } from "@medusajs/types"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Table, Text, clx } from "@modules/common/components/ui"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductCondition } from "@modules/products/utils/product-metadata"
import QuantityControl from "./quantity-control"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

// Upper bound for items that don't track inventory (or allow backorders),
// to keep the quantity selector reasonable.
const MAX_QUANTITY = 10

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const variant = item.variant
  const condition = item.product
    ? getProductCondition(item.product)
    : undefined

  // Quando o estoque não é gerenciado ou backorder é permitido, não há limite
  // real de estoque — usamos um teto razoável. Caso contrário, o máximo é a
  // quantidade efetivamente disponível em estoque.
  const maxQuantity =
    !variant?.manage_inventory || variant?.allow_backorder
      ? MAX_QUANTITY
      : variant?.inventory_quantity ?? 0

  const isFull = type === "full"

  return (
    <Table.Row
      className={clx("w-full", {
        "grid grid-cols-[80px_1fr] gap-x-4 border-b border-surface-container-highest py-4 small:table-row small:py-0":
          isFull,
      })}
      data-testid="product-row"
    >
      <Table.Cell className="!pl-0 p-0 small:p-4 small:w-24 small:table-cell">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "w-20 small:w-24": isFull,
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.product?.images}
            isContain
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="p-0 text-left small:p-4 small:table-cell">
        <Text
          className="txt-medium-plus text-sm font-bold text-ui-fg-base"
          data-testid="product-title"
        >
          {item.product_title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
        {isFull && condition && (
          <div className="mt-1 text-xs text-on-surface-variant font-medium uppercase tracking-wide">
            Condition:{" "}
            <span className="text-primary font-bold">{condition}</span>
          </div>
        )}

        {isFull && (
          <div className="mt-1 text-xs small:hidden">
            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        )}
      </Table.Cell>

      {isFull && (
        <Table.Cell className="col-span-2 mt-4 flex items-center justify-between border-t border-surface-container-highest p-0 pt-3 small:mt-0 small:table-cell small:border-t-0 small:p-4">
          <span className="text-xs font-bold uppercase text-on-surface-variant small:hidden">
            Quantity
          </span>
          <QuantityControl
            itemId={item.id}
            maxQuantity={maxQuantity}
            quantity={item.quantity}
          />
        </Table.Cell>
      )}

      {isFull && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell className="col-span-2 mt-2 flex items-center justify-between p-0 !pr-0 small:mt-0 small:table-cell small:p-4">
        {isFull && (
          <span className="text-xs font-bold uppercase text-on-surface-variant small:hidden">
            Total
          </span>
        )}
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
