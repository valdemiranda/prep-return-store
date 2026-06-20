import { Module } from "@medusajs/framework/utils"

import SendgridMarketingModuleService from "./service"

export const SENDGRID_MARKETING_MODULE = "sendgridMarketing"

export default Module(SENDGRID_MARKETING_MODULE, {
  service: SendgridMarketingModuleService,
})
