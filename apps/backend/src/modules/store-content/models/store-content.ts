import { model } from "@medusajs/framework/utils"

const StoreContent = model.define("store_content", {
  id: model.id({ prefix: "stcnt" }).primaryKey(),
  key: model.text().unique(),
  data: model.json(),
})

export default StoreContent
