import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SectionHeader = ({
  title,
  subtitle,
  viewAllHref,
  action,
}: {
  title: string
  subtitle?: string
  viewAllHref?: string
  action?: ReactNode
}) => {
  return (
    <div className="mb-8 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-headline text-2xl font-extrabold uppercase tracking-tight text-on-surface">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-on-surface-variant mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {action ? (
        action
      ) : (
        viewAllHref && (
          <LocalizedClientLink
            href={viewAllHref}
            className="flex shrink-0 items-center gap-2 text-sm font-label-bold uppercase tracking-wider text-primary hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </LocalizedClientLink>
        )
      )}
    </div>
  )
}

export default SectionHeader
