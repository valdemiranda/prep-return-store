import React from "react"
import { Input, Label, Heading, Select } from "@medusajs/ui"
import { TruckFast } from "@medusajs/icons"
import { BenefitCard } from "../lib/sdk"
import { benefitIconMap, benefitIconOptions } from "./benefit-icon-options"

interface BenefitCardsSectionProps {
  value: BenefitCard[]
  onChange: (value: BenefitCard[]) => void
}

export const BenefitCardsSection: React.FC<BenefitCardsSectionProps> = ({
  value = [],
  onChange,
}) => {
  // Ensure we always have 4 cards
  const cards = Array.from({ length: 4 }, (_, i) => {
    return value[i] || { icon: "truck", title: "", subtitle: "" }
  })

  const handleCardChange = (index: number, key: keyof BenefitCard, val: string) => {
    const updatedCards = [...cards]
    updatedCards[index] = {
      ...updatedCards[index],
      [key]: val,
    }
    onChange(updatedCards)
  }

  return (
    <div className="flex flex-col gap-4 p-4 border border-outline-variant rounded-[4px] bg-surface-container-low">
      <Heading level="h2" className="text-lg font-bold text-on-surface font-headline uppercase">
        Hero Benefit Cards (4 Cards)
      </Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const IconComponent = benefitIconMap[card.icon] || TruckFast
          return (
            <div
              key={index}
              className="flex flex-col gap-3 p-3 border border-outline-variant rounded-[2px] bg-surface-container-high relative"
            >
              <div className="flex items-center justify-between border-b border-surface-container-highest pb-2 mb-1">
                <span className="text-xs font-bold text-primary uppercase font-headline">
                  Card #{index + 1}
                </span>
                <IconComponent className="w-5 h-5 text-secondary" />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`icon-${index}`} className="text-xs font-semibold text-on-surface-variant">
                  Icon Choice
                </Label>
                <Select
                  value={card.icon || "truck"}
                  onValueChange={(val) => handleCardChange(index, "icon", val)}
                >
                  <Select.Trigger id={`icon-${index}`} className="bg-surface-container border border-outline-variant rounded-[4px] text-sm">
                    <Select.Value placeholder="Select icon..." />
                  </Select.Trigger>
                  <Select.Content className="bg-surface-container border border-outline-variant rounded-[4px] z-50">
                    {benefitIconOptions.map(({ value, label, Icon }) => (
                      <Select.Item key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-ui-fg-muted" />
                          <span>{label}</span>
                        </div>
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`title-${index}`} className="text-xs font-semibold text-on-surface-variant">
                  Title
                </Label>
                <Input
                  id={`title-${index}`}
                  placeholder="e.g. Free Shipping"
                  value={card.title || ""}
                  onChange={(e) => handleCardChange(index, "title", e.target.value)}
                  className="bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`subtitle-${index}`} className="text-xs font-semibold text-on-surface-variant">
                  Subtitle
                </Label>
                <Input
                  id={`subtitle-${index}`}
                  placeholder="e.g. On orders over $50"
                  value={card.subtitle || ""}
                  onChange={(e) => handleCardChange(index, "subtitle", e.target.value)}
                  className="bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
