import React from "react"
import { Textarea, Label, Heading } from "@medusajs/ui"
import { StaticPages } from "../lib/sdk"

interface StaticPagesSectionProps {
  value: StaticPages
  onChange: (value: StaticPages) => void
}

export const StaticPagesSection: React.FC<StaticPagesSectionProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (key: keyof StaticPages, val: string) => {
    onChange({
      ...value,
      [key]: val,
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4 border border-outline-variant rounded-[4px] bg-surface-container-low">
      <Heading level="h2" className="text-lg font-bold text-on-surface font-headline uppercase">
        Static Pages Content (HTML Supported)
      </Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="terms-page" className="text-xs font-semibold text-on-surface-variant">
            Terms of Use HTML
          </Label>
          <Textarea
            id="terms-page"
            placeholder="<h1>Terms of Use</h1><p>Your terms here...</p>"
            value={value.termsOfUse || ""}
            onChange={(e) => handleChange("termsOfUse", e.target.value)}
            rows={8}
            className="font-mono bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm p-3"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="privacy-page" className="text-xs font-semibold text-on-surface-variant">
            Privacy Policy HTML
          </Label>
          <Textarea
            id="privacy-page"
            placeholder="<h1>Privacy Policy</h1><p>Your privacy policy...</p>"
            value={value.privacy || ""}
            onChange={(e) => handleChange("privacy", e.target.value)}
            rows={8}
            className="font-mono bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm p-3"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="return-page" className="text-xs font-semibold text-on-surface-variant">
            Return Policy HTML
          </Label>
          <Textarea
            id="return-page"
            placeholder="<h1>Return Policy</h1><p>Your return policy...</p>"
            value={value.returnPolicy || ""}
            onChange={(e) => handleChange("returnPolicy", e.target.value)}
            rows={8}
            className="font-mono bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm p-3"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="about-page" className="text-xs font-semibold text-on-surface-variant">
            About Us HTML
          </Label>
          <Textarea
            id="about-page"
            placeholder="<h1>About Us</h1><p>Your about us content...</p>"
            value={value.aboutUs || ""}
            onChange={(e) => handleChange("aboutUs", e.target.value)}
            rows={8}
            className="font-mono bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm p-3"
          />
        </div>
      </div>
    </div>
  )
}
