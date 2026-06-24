import React from "react";
import { Input, Label, Select } from "@medusajs/ui";
import { HeroContent } from "../lib/sdk";
import { iconOptions, iconMap } from "./icon-options";

interface CtaEditorProps {
  type: "primary" | "secondary";
  value: HeroContent;
  onChange: (key: keyof HeroContent, val: string) => void;
}

export const CtaEditor: React.FC<CtaEditorProps> = ({
  type,
  value,
  onChange,
}) => {
  const isPrimary = type === "primary";
  const labelKey = isPrimary ? "primaryCtaLabel" : "secondaryCtaLabel";
  const linkKey = isPrimary ? "primaryCtaLink" : "secondaryCtaLink";
  const iconKey = isPrimary ? "primaryCtaIcon" : "secondaryCtaIcon";

  const label = value[labelKey] || "";
  const link = value[linkKey] || "";
  const icon = value[iconKey] || "";
  const selectedIcon = icon || "none";

  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor={labelKey}
          className="text-xs font-semibold text-on-surface-variant capitalize"
        >
          {type} CTA Label
        </Label>
        <Input
          id={labelKey}
          placeholder={`${isPrimary ? "Primary" : "Secondary"} CTA Label`}
          value={label}
          onChange={(e) => onChange(labelKey, e.target.value)}
          className="bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor={linkKey}
          className="text-xs font-semibold text-on-surface-variant capitalize"
        >
          {type} CTA Link
        </Label>
        <Input
          id={linkKey}
          placeholder={isPrimary ? "/products" : "/contact"}
          value={link}
          onChange={(e) => onChange(linkKey, e.target.value)}
          className="bg-surface-container border border-outline-variant rounded-[4px] focus:ring-2 focus:ring-primary focus:border-primary text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5 md:col-span-2">
        <Label
          htmlFor={iconKey}
          className="text-xs font-semibold text-on-surface-variant flex items-center gap-2 capitalize"
        >
          {type} CTA Icon
          {IconComponent && (
            <IconComponent className="h-4 w-4 text-ui-fg-muted" />
          )}
        </Label>
        <Select
          value={selectedIcon}
          onValueChange={(val) => onChange(iconKey, val === "none" ? "" : val)}
        >
          <Select.Trigger
            id={iconKey}
            className="bg-surface-container border border-outline-variant rounded-[4px] text-sm"
          >
            <Select.Value placeholder="Select icon..." />
          </Select.Trigger>
          <Select.Content className="bg-surface-container border border-outline-variant rounded-[4px] z-50">
            <Select.Item value="none">
              <span className="text-ui-fg-muted">None</span>
            </Select.Item>
            {iconOptions.map(({ value: val, label, Icon }) => (
              <Select.Item key={val} value={val}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-ui-fg-muted" />
                  <span>{label}</span>
                </div>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
    </>
  );
};
