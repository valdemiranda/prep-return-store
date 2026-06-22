import { MedusaService } from "@medusajs/framework/utils"

import { DEFAULT_STORE_CONTENT, StoreContentData } from "./defaults"
import StoreContent from "./models/store-content"

type StoreContentRecord = {
  id: string
  key: string
  data: StoreContentData
}

const MAIN_KEY = "main"
const LEGACY_HERO_IMAGE = "/hero-small-goods.png"

function mergeStaticPages(data?: Partial<StoreContentData["staticPages"]>) {
  return {
    termsOfUse:
      data?.termsOfUse ?? DEFAULT_STORE_CONTENT.staticPages.termsOfUse,
    privacy: data?.privacy ?? DEFAULT_STORE_CONTENT.staticPages.privacy,
    returnPolicy:
      data?.returnPolicy ?? DEFAULT_STORE_CONTENT.staticPages.returnPolicy,
  }
}

function mergeContent(data?: Partial<StoreContentData>): StoreContentData {
  const content = {
    ...DEFAULT_STORE_CONTENT,
    ...data,
    hero: {
      ...DEFAULT_STORE_CONTENT.hero,
      ...data?.hero,
    },
    staticPages: mergeStaticPages(data?.staticPages),
    benefitCards: data?.benefitCards ?? DEFAULT_STORE_CONTENT.benefitCards,
    promotionalBanners:
      data?.promotionalBanners ?? DEFAULT_STORE_CONTENT.promotionalBanners,
  }

  if (content.hero.backgroundImage === LEGACY_HERO_IMAGE) {
    content.hero.backgroundImage = ""
  }

  content.promotionalBanners = content.promotionalBanners.filter(
    (banner) => !banner.image.startsWith("/promos/")
  )

  return content
}

class StoreContentModuleService extends MedusaService({
  StoreContent,
}) {
  async retrieveMainContent(): Promise<StoreContentData> {
    const records = (await this.listStoreContents(
      { key: MAIN_KEY },
      { take: 1 }
    )) as unknown as StoreContentRecord[]

    return mergeContent(records[0]?.data)
  }

  async upsertMainContent(
    data: Partial<StoreContentData>
  ): Promise<StoreContentData> {
    const records = (await this.listStoreContents(
      { key: MAIN_KEY },
      { take: 1 }
    )) as unknown as StoreContentRecord[]
    const content = mergeContent(data)

    if (records[0]) {
      await this.updateStoreContents({
        id: records[0].id,
        data: content,
      })
    } else {
      await this.createStoreContents({
        key: MAIN_KEY,
        data: content,
      })
    }

    return content
  }
}

export default StoreContentModuleService
