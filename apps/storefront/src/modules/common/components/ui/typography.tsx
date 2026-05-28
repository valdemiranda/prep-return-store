import clsx from "clsx"
import { forwardRef, HTMLAttributes } from "react"

type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  as?: "p" | "span" | "div"
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, as: Component = "p", children, ...props }, ref) => (
    <Component ref={ref} className={clsx("text-base", className)} {...props}>
      {children}
    </Component>
  )
)
Text.displayName = "Text"

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: "h1" | "h2" | "h3"
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level: Component = "h2", children, ...props }, ref) => (
    <Component
      ref={ref}
      className={clsx(
        "font-headline font-bold text-on-surface tracking-tight",
        Component === "h1" && "text-display-lg md:text-5xl",
        Component === "h2" && "text-headline-lg md:text-3xl",
        Component === "h3" && "text-headline-md md:text-xl",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
)
Heading.displayName = "Heading"
