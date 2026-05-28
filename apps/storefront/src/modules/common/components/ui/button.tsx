import clsx from "clsx"
import { ButtonHTMLAttributes, forwardRef } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "transparent"
  size?: "small" | "medium" | "large"
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "medium",
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={clsx(
        "inline-flex gap-2 items-center justify-center font-bold uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-primary text-white hover:bg-primary-container rounded-sm hover:scale-[1.02] active:scale-[0.98]",
        variant === "secondary" &&
          "bg-secondary text-white hover:bg-opacity-90 rounded-sm active:scale-95",
        variant === "transparent" &&
          "bg-transparent text-on-surface hover:bg-surface-container rounded-sm",
        size === "small" && "h-8 px-3 text-xs",
        size === "medium" && "h-10 px-6 text-sm",
        size === "large" && "h-12 px-8 text-base",
        className
      )}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  )
)
Button.displayName = "Button"

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center rounded-sm p-2 hover:bg-surface-container transition-colors focus-visible:outline-none focus-visible:ring-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)
IconButton.displayName = "IconButton"
