import LocalizedClientLink from "@modules/common/components/localized-client-link"
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
} from "lucide-react"
import { HeroContent } from "@lib/data/store-content"

const iconMap = {
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
}

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
}

const Hero = ({ content }: { content: HeroContent }) => {
  const PrimaryIcon = content.primaryCtaIcon
    ? iconMap[content.primaryCtaIcon as keyof typeof iconMap]
    : null
  const SecondaryIcon = content.secondaryCtaIcon
    ? iconMap[content.secondaryCtaIcon as keyof typeof iconMap]
    : null

  const ctaPosition = content.ctaPosition || "left-center"
  const alignClasses =
    positionClasses[ctaPosition] || positionClasses["left-center"]
  const shouldShowCtas = ctaPosition !== "none"

  return (
    <section
      className={`relative w-full aspect-[1920/580] overflow-hidden bg-primary-container flex flex-col ${alignClasses} p-3 sm:p-5 md:p-8 max-w-container-max mx-auto mt-4 rounded-sm`}
    >
      {content.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            alt={content.imageAlt}
            src={content.backgroundImage}
          />
        </div>
      )}

      {shouldShowCtas && (
        <div className="relative z-10 hidden sm:flex max-w-2xl pt-4 pb-6 flex-row gap-3 w-auto">
          <LocalizedClientLink
            href={content.primaryCtaLink}
            className="bg-white text-primary px-4 py-2 sm:px-8 sm:py-3 text-xs sm:text-sm rounded-[4px] hover:scale-105 active:scale-95 transition-all shadow-md inline-block text-center font-bold uppercase tracking-wider min-h-[32px] sm:min-h-[44px] flex items-center justify-center gap-1.5 sm:gap-2"
          >
            {PrimaryIcon && (
              <PrimaryIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            )}
            {content.primaryCtaLabel}
          </LocalizedClientLink>
          <LocalizedClientLink
            href={content.secondaryCtaLink}
            className="border-2 border-white text-white px-4 py-2 sm:px-8 sm:py-3 text-xs sm:text-sm rounded-[4px] hover:bg-white/10 active:scale-95 transition-all inline-block text-center font-bold uppercase tracking-wider min-h-[32px] sm:min-h-[44px] flex items-center justify-center gap-1.5 sm:gap-2"
          >
            {SecondaryIcon && (
              <SecondaryIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            )}
            {content.secondaryCtaLabel}
          </LocalizedClientLink>
        </div>
      )}
    </section>
  )
}

export default Hero
