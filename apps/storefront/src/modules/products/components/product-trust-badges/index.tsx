import { BadgeCheck, Truck, RotateCcw, PackageCheck } from "lucide-react"

export default function ProductTrustBadges() {
  return (
    <div className="p-5 bg-white border border-outline-variant rounded-sm shadow-sm font-sans">
      <div className="flex flex-col gap-4 text-xs font-semibold text-on-surface">
        <div className="flex items-center gap-3">
          <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />
          <span>High Quality Product</span>
        </div>
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-primary flex-shrink-0" />
          <span>Fast Shipping Available</span>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="w-5 h-5 text-primary flex-shrink-0" />
          <span>30-Day Returns</span>
        </div>
        <div className="flex items-start gap-3">
          <PackageCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <span className="leading-tight">Free Shipping & Returns on all orders over $50</span>
        </div>
      </div>
    </div>
  )
}
