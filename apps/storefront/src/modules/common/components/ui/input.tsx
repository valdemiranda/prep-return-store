import clsx from "clsx"
import {
  forwardRef,
  InputHTMLAttributes,
  LabelHTMLAttributes,
} from "react"

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={clsx("text-sm font-medium", className)}
      {...props}
    >
      {children}
    </label>
  )
)
Label.displayName = "Label"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <Label className="text-body-sm font-bold">{label}</Label>}
      <input
        ref={ref}
        className={clsx(
          "flex h-10 w-full rounded-sm border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        {...props}
      />
    </div>
  )
)
Input.displayName = "Input"
