import clsx from "clsx"
import { forwardRef, HTMLAttributes } from "react"

type ContainerProps = HTMLAttributes<HTMLDivElement>

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "bg-white border border-outline-variant rounded-[2px] p-4 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Container.displayName = "Container"
