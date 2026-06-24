import React from "react";
import { Input, Label, Heading, Select } from "@medusajs/ui";
import { HeroContent } from "../lib/sdk";
import { ImageUrlField } from "./ImageUrlField";
import { CtaEditor } from "./CtaEditor";
import { HeroPreview } from "./HeroPreview";

interface HeroSectionProps {
  value: HeroContent;
  onChange: (value: HeroContent) => void;
}

const positionOptions = [
  { value: "none", label: "No CTA" },
  { value: "left-top", label: "Left top" },
  { value: "left-center", label: "Left center" },
  { value: "left-bottom", label: "Left bottom" },
  { value: "center-top", label: "Center top" },
  { value: "center", label: "Center" },
  { value: "center-bottom", label: "Center bottom" },
  { value: "right-top", label: "Right top" },
  { value: "right-center", label: "Right center" },
  { value: "right-bottom", label: "Right bottom" },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (key: keyof HeroContent, val: string) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  const selectedPosition = value.ctaPosition || "left-center";

  return (
    <div className="flex flex-col gap-4 p-4 border border-outline-variant rounded-[4px] bg-surface-container-low">
      <Heading
        level="h2"
        className="text-lg font-bold text-on-surface font-headline uppercase"
      >
        Hero Banner Content
      </Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HeroPreview content={value} />

        <div className="md:col-span-2">
          <ImageUrlField
            id="backgroundImage"
            label="Background Image (1920px 580px .webp)"
            value={value.backgroundImage}
            previewAlt={value.imageAlt}
            onChange={(url) => handleChange("backgroundImage", url)}
            hidePreview={true}
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label
            htmlFor="imageAlt"
            className="text-xs font-semibold text-on-surface-variant"
          >
            Hero Image Alt Text
          </Label>
          <Input
            id="imageAlt"
            placeholder="Hero Image Alt Text"
            value={value.imageAlt || ""}
            onChange={(e) => handleChange("imageAlt", e.target.value)}
            className="bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label
            htmlFor="ctaPosition"
            className="text-xs font-semibold text-on-surface-variant"
          >
            CTA Position
          </Label>
          <Select
            value={selectedPosition}
            onValueChange={(val) => handleChange("ctaPosition", val)}
          >
            <Select.Trigger
              id="ctaPosition"
              className="bg-surface-container border border-outline-variant rounded-[4px] text-sm"
            >
              <Select.Value placeholder="Select CTA Position..." />
            </Select.Trigger>
            <Select.Content className="bg-surface-container border border-outline-variant rounded-[4px] z-50">
              {positionOptions.map(({ value: val, label }) => (
                <Select.Item key={val} value={val}>
                  {label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        <CtaEditor type="primary" value={value} onChange={handleChange} />
        <CtaEditor type="secondary" value={value} onChange={handleChange} />
      </div>
    </div>
  );
};
