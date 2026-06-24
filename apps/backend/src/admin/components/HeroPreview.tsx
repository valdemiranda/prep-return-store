import React from "react";
import { HeroContent } from "../lib/sdk";
import {
  Archive,
  BadgePercent,
  BarChart3,
  Bell,
  Box,
  Calendar,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Flame,
  Gift,
  Globe,
  Headphones,
  Heart,
  Inbox,
  LifeBuoy,
  Lightbulb,
  Lock,
  MapPin,
  MessageCircle,
  Puzzle,
  RotateCcw,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tags,
  Target,
  Truck,
  Wrench,
} from "lucide-react";

interface HeroPreviewProps {
  content: HeroContent;
}

const lucideIconMap = {
  truck: Truck,
  "shield-check": ShieldCheck,
  headphones: Headphones,
  "rotate-ccw": RotateCcw,
  "credit-card": CreditCard,
  lock: Lock,
  gift: Gift,
  tag: Tags,
  clock: Clock,
  star: Star,
  heart: Heart,
  sparkles: Sparkles,
  "shopping-bag": ShoppingBag,
  "receipt-percent": BadgePercent,
  globe: Globe,
  chat: MessageCircle,
  archive: Archive,
  bell: Bell,
  calendar: Calendar,
  chart: BarChart3,
  cube: Box,
  document: FileText,
  eye: Eye,
  fire: Flame,
  inbox: Inbox,
  lifebuoy: LifeBuoy,
  lightbulb: Lightbulb,
  "map-pin": MapPin,
  puzzle: Puzzle,
  rocket: Rocket,
  target: Target,
  wrench: Wrench,
};

const positionClasses: Record<string, string> = {
  none: "justify-center items-start",
  "left-top": "justify-start items-start",
  "left-center": "justify-center items-start",
  "left-bottom": "justify-end items-start",
  "center-top": "justify-start items-center",
  center: "justify-center items-center",
  "center-bottom": "justify-end items-center",
  "right-top": "justify-start items-end",
  "right-center": "justify-center items-end",
  "right-bottom": "justify-end items-end",
};

export const HeroPreview: React.FC<HeroPreviewProps> = ({ content }) => {
  const PrimaryIcon = content.primaryCtaIcon
    ? lucideIconMap[content.primaryCtaIcon as keyof typeof lucideIconMap]
    : null;
  const SecondaryIcon = content.secondaryCtaIcon
    ? lucideIconMap[content.secondaryCtaIcon as keyof typeof lucideIconMap]
    : null;

  const ctaPosition = content.ctaPosition || "left-center";
  const alignClasses =
    positionClasses[ctaPosition] || positionClasses["left-center"];
  const shouldShowCtas = ctaPosition !== "none";

  return (
    <div className="flex flex-col gap-1.5 md:col-span-2">
      <span className="text-xs font-semibold text-on-surface-variant">
        Storefront Hero Preview
      </span>
      <section
        className={`relative w-full overflow-hidden bg-[#cc0000] flex flex-col ${alignClasses} p-3 sm:p-5 md:p-8 rounded-[2px] border border-outline-variant shadow-sm`}
        style={{
          aspectRatio: "1920/580",
          minHeight: "160px",
          maxHeight: "360px",
        }}
      >
        {content.backgroundImage && (
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              alt={content.imageAlt || "Hero background preview"}
              src={content.backgroundImage}
            />
          </div>
        )}

        {shouldShowCtas && (
          <div className="relative z-10 max-w-[40%] pt-[0.8%] pb-[1.2%] flex flex-col sm:flex-row gap-1.5 md:gap-2 w-full sm:w-auto">
            {content.primaryCtaLabel && (
              <div className="bg-white text-[#9e0000] px-3 py-1.5 md:px-4 md:py-2 text-[9px] md:text-[11px] rounded-[4px] shadow-md inline-flex text-center font-bold uppercase tracking-wider min-h-[28px] md:min-h-[34px] items-center justify-center gap-1.5 select-none">
                {PrimaryIcon && (
                  <PrimaryIcon className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
                )}
                <span>{content.primaryCtaLabel}</span>
              </div>
            )}
            {content.secondaryCtaLabel && (
              <div className="border-2 border-white text-white px-3 py-1.5 md:px-4 md:py-2 text-[9px] md:text-[11px] rounded-[4px] inline-flex text-center font-bold uppercase tracking-wider min-h-[28px] md:min-h-[34px] items-center justify-center gap-1.5 select-none bg-transparent">
                {SecondaryIcon && (
                  <SecondaryIcon className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
                )}
                <span>{content.secondaryCtaLabel}</span>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
