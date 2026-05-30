import { ArrowRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SectionHeader = ({
  title,
  subtitle,
  viewAllHref,
}: {
  title: string
  subtitle?: string
  viewAllHref: string
}) => {
  return (
    <div className="mb-8 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-headline text-headline-lg uppercase text-on-surface">
          {title}
        </h2>
        {subtitle && (
          <p className="font-body-md text-body-md text-on-surface-variant">
            {subtitle}
          </p>
        )}
      </div>
      <LocalizedClientLink
        href={viewAllHref}
        className="flex shrink-0 items-center gap-2 text-sm font-label-bold uppercase tracking-wider text-primary hover:underline"
      >
        View all <ArrowRight className="h-4 w-4" />
      </LocalizedClientLink>
    </div>
  )
}

export default SectionHeader
