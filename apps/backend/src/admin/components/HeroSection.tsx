import React from "react";
import { Input, Label, Heading } from "@medusajs/ui";
import { HeroContent } from "../lib/sdk";
import { ImageUrlField } from "./ImageUrlField";

interface HeroSectionProps {
  value: HeroContent;
  onChange: (value: HeroContent) => void;
}

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

  return (
    <div className="flex flex-col gap-4 p-4 border border-outline-variant rounded-[4px] bg-surface-container-low">
      <Heading
        level="h2"
        className="text-lg font-bold text-on-surface font-headline uppercase"
      >
        Hero Banner Content
      </Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageUrlField
          id="backgroundImage"
          label="Background Image (1672px 941px .webp)"
          value={value.backgroundImage}
          previewAlt={value.imageAlt}
          onChange={(url) => handleChange("backgroundImage", url)}
        />

        <div className="flex flex-col gap-1.5">
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

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="eyebrow"
            className="text-xs font-semibold text-on-surface-variant"
          >
            Eyebrow
          </Label>
          <Input
            id="eyebrow"
            placeholder="Eyebrow Text"
            value={value.eyebrow || ""}
            onChange={(e) => handleChange("eyebrow", e.target.value)}
            className="bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="title"
            className="text-xs font-semibold text-on-surface-variant"
          >
            Title
          </Label>
          <Input
            id="title"
            placeholder="Title"
            value={value.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label
            htmlFor="subtitle"
            className="text-xs font-semibold text-on-surface-variant"
          >
            Subtitle
          </Label>
          <Input
            id="subtitle"
            placeholder="Subtitle"
            value={value.subtitle || ""}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            className="bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="primaryCtaLabel"
            className="text-xs font-semibold text-on-surface-variant"
          >
            Primary CTA Label
          </Label>
          <Input
            id="primaryCtaLabel"
            placeholder="Primary CTA Label"
            value={value.primaryCtaLabel || ""}
            onChange={(e) => handleChange("primaryCtaLabel", e.target.value)}
            className="bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="primaryCtaLink"
            className="text-xs font-semibold text-on-surface-variant"
          >
            Primary CTA Link
          </Label>
          <Input
            id="primaryCtaLink"
            placeholder="/products"
            value={value.primaryCtaLink || ""}
            onChange={(e) => handleChange("primaryCtaLink", e.target.value)}
            className="bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="secondaryCtaLabel"
            className="text-xs font-semibold text-on-surface-variant"
          >
            Secondary CTA Label
          </Label>
          <Input
            id="secondaryCtaLabel"
            placeholder="Secondary CTA Label"
            value={value.secondaryCtaLabel || ""}
            onChange={(e) => handleChange("secondaryCtaLabel", e.target.value)}
            className="bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="secondaryCtaLink"
            className="text-xs font-semibold text-on-surface-variant"
          >
            Secondary CTA Link
          </Label>
          <Input
            id="secondaryCtaLink"
            placeholder="/contact"
            value={value.secondaryCtaLink || ""}
            onChange={(e) => handleChange("secondaryCtaLink", e.target.value)}
            className="bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>
      </div>
    </div>
  );
};
