import clsx from "clsx"
import { forwardRef, HTMLAttributes } from "react"

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  color?: "green" | "red" | "blue" | "orange" | "grey" | "purple"
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, color = "grey", children, ...props }, ref) => (
    <span
      ref={ref}
      className={clsx(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-bold uppercase tracking-wider",
        color === "green" && "bg-green-100 text-green-700",
        color === "red" && "bg-red-100 text-red-700",
        color === "blue" && "bg-blue-100 text-blue-700",
        color === "orange" && "bg-orange-100 text-orange-700",
        color === "grey" && "bg-surface-container text-on-surface-variant",
        color === "purple" && "bg-purple-100 text-purple-700",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
)
Badge.displayName = "Badge"

type IconBadgeProps = HTMLAttributes<HTMLSpanElement>

export const IconBadge = forwardRef<HTMLSpanElement, IconBadgeProps>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center rounded-full bg-surface-container p-1",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
)
IconBadge.displayName = "IconBadge"
