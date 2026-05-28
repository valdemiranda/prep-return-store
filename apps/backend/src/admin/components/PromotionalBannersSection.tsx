import React from "react";
import { Input, Label, Heading, Button, Text } from "@medusajs/ui";
import { Image as ImageIcon, Plus, Trash } from "@medusajs/icons";
import { PromotionalBanner } from "../lib/sdk";
import { ImageUrlField } from "./ImageUrlField";

interface PromotionalBannersSectionProps {
  value: PromotionalBanner[];
  onChange: (value: PromotionalBanner[]) => void;
}

export const PromotionalBannersSection: React.FC<
  PromotionalBannersSectionProps
> = ({ value = [], onChange }) => {
  const handleBannerChange = (
    index: number,
    key: keyof PromotionalBanner,
    val: string,
  ) => {
    const updated = [...value];
    updated[index] = {
      ...updated[index],
      [key]: val,
    };
    onChange(updated);
  };

  const addBanner = () => {
    onChange([...value, { image: "", ctaLink: "", accessibilityLabel: "" }]);
  };

  const removeBanner = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border border-outline-variant rounded-[4px] bg-surface-container-low">
      <div className="flex items-center justify-between">
        <Heading
          level="h2"
          className="text-lg font-bold text-on-surface font-headline uppercase"
        >
          Promotional Banners Carousel
        </Heading>
        <Button
          type="button"
          onClick={addBanner}
          className="flex items-center gap-1.5 bg-[#9e0000] text-white font-bold rounded-[4px] hover:bg-[#7f0000] active:scale-95 transition-all text-xs"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          Add Banner
        </Button>
      </div>

      {value.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-outline-variant rounded-[4px] bg-surface-container">
          <ImageIcon className="w-8 h-8 text-on-surface-variant opacity-60 mb-2" />
          <Text className="text-sm text-on-surface-variant font-sans">
            No promotional banners added yet.
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {value.map((banner, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border border-outline-variant rounded-[2px] bg-surface-container-high relative"
            >
              <div className="md:col-span-4">
                <ImageUrlField
                  id={`banner-img-${index}`}
                  label="Image (1983px 793px .webp)"
                  value={banner.image}
                  previewAlt={banner.accessibilityLabel}
                  onChange={(url) => handleBannerChange(index, "image", url)}
                />
              </div>

              <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <Label
                    htmlFor={`banner-label-${index}`}
                    className="text-xs font-semibold text-on-surface-variant"
                  >
                    Accessibility Label
                  </Label>
                  <Input
                    id={`banner-label-${index}`}
                    placeholder="e.g. Summer Sale Banner"
                    value={banner.accessibilityLabel || ""}
                    onChange={(e) =>
                      handleBannerChange(
                        index,
                        "accessibilityLabel",
                        e.target.value,
                      )
                    }
                    className="bg-surface-container border border-outline-variant rounded-[4px] text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor={`banner-link-${index}`}
                    className="text-xs font-semibold text-on-surface-variant"
                  >
                    CTA Link
                  </Label>
                  <Input
                    id={`banner-link-${index}`}
                    placeholder="/collections/sale"
                    value={banner.ctaLink || ""}
                    onChange={(e) =>
                      handleBannerChange(index, "ctaLink", e.target.value)
                    }
                    className="bg-surface-container border border-outline-variant rounded-[4px] text-sm"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="md:col-span-1 flex items-center justify-center">
                <Button
                  type="button"
                  variant="transparent"
                  onClick={() => removeBanner(index)}
                  className="text-primary hover:bg-surface-container p-2 rounded-full transition-colors"
                >
                  <Trash className="w-4 h-4 text-primary" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
