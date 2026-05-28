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
import { BenefitCard, HeroContent } from "@lib/data/store-content"

const cardIcons = {
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

const Hero = ({
  content,
  benefitCards,
}: {
  content: HeroContent
  benefitCards: BenefitCard[]
}) => {
  return (
    <section className="relative w-full min-h-[620px] md:min-h-[500px] md:h-[580px] overflow-hidden bg-primary-container flex flex-col justify-between p-6 md:p-8 max-w-container-max mx-auto mt-4 rounded-sm">
      {content.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            alt={content.imageAlt}
            src={content.backgroundImage}
          />
        </div>
      )}

      <div className="relative z-10 w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {benefitCards.map((card) => {
          const Icon = cardIcons[card.icon as keyof typeof cardIcons] ?? Truck

          return (
            <div
              key={`${card.icon}-${card.title}`}
              className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2px] transition-all hover:bg-white/15"
            >
              <Icon className="text-white w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                  {card.title}
                </h3>
                <p className="text-[10px] text-white/80">{card.subtitle}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="relative z-10 max-w-2xl text-white my-auto pt-4 pb-4">
        <div className="bg-white text-primary px-3 py-1 inline-block font-bold mb-4 rounded-[2px] text-xs tracking-wider">
          {content.eyebrow}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight uppercase">
          {content.title}
        </h1>
        <p className="font-sans text-base md:text-lg mb-8 text-white/90 max-w-lg">
          {content.subtitle}
        </p>
        <div className="flex gap-4">
          <LocalizedClientLink
            href={content.primaryCtaLink}
            className="bg-white text-primary px-8 py-3 text-sm rounded-[4px] hover:scale-105 active:scale-95 transition-all shadow-md inline-block text-center font-bold uppercase tracking-wider"
          >
            {content.primaryCtaLabel}
          </LocalizedClientLink>
          <LocalizedClientLink
            href={content.secondaryCtaLink}
            className="border-2 border-white text-white px-8 py-3 text-sm rounded-[4px] hover:bg-white/10 active:scale-95 transition-all inline-block text-center font-bold uppercase tracking-wider"
          >
            {content.secondaryCtaLabel}
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default Hero
