import clsx from "clsx"
import { forwardRef, InputHTMLAttributes } from "react"
import { Label } from "./input"

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => (
    <div className="flex items-center gap-2">
      <input
        ref={ref}
        type="checkbox"
        id={id}
        className={clsx(
          "h-4 w-4 rounded-sm border-outline-variant text-primary focus:ring-primary",
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
Checkbox.displayName = "Checkbox"
