import clsx from "clsx"
import { forwardRef, HTMLAttributes, InputHTMLAttributes } from "react"
import { Label } from "./input"

const RadioGroupRoot = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx("flex flex-col gap-2", className)} {...props}>
      {children}
    </div>
  )
)
RadioGroupRoot.displayName = "RadioGroup"

type RadioGroupItemProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, label, id, ...props }, ref) => (
    <div className="flex items-center gap-2">
      <input
        ref={ref}
        type="radio"
        id={id}
        className={clsx(
          "h-4 w-4 border-outline-variant text-primary focus:ring-primary",
          className
        )}
        {...props}
      />
      {label && (
        <Label htmlFor={id} className="text-body-sm cursor-pointer">
          {label}
        </Label>
      )}
    </div>
  )
)
RadioGroupItem.displayName = "RadioGroupItem"

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
})
