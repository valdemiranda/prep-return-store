import clsx from "clsx"
import { ClipboardList, Loader2, Package, CheckCircle2 } from "lucide-react"
import { InternalOrderStatus } from "@lib/data/order-tracking"

const STEPS = [
  { key: "Placed", label: "Placed", icon: ClipboardList },
  { key: "Processing", label: "Processing", icon: Loader2 },
  { key: "Shipped", label: "Shipped", icon: Package },
  { key: "Delivered", label: "Delivered", icon: CheckCircle2 },
]

export default function StatusSteps({
  status,
}: {
  status: InternalOrderStatus
}) {
  const activeIndex = STEPS.findIndex(
    (step) => step.key.toLowerCase() === status.toLowerCase(),
  )

  return (
    <div className="w-full bg-white border border-outline-variant p-6 rounded-sm shadow-sm">
      <h3 className="text-sm font-bold uppercase text-on-surface mb-6 tracking-wider">
        Order Status: <span className="text-primary">{status}</span>
      </h3>

      {/* Responsive timeline */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-start w-full gap-6 md:gap-2">
        {/* Connector Line (Desktop only) */}
        <div className="absolute top-[16px] left-0 right-0 h-1 bg-surface-container hidden md:block z-0" />
        <div
          className="absolute top-[16px] left-0 h-1 bg-primary hidden md:block z-0 transition-all duration-500"
          style={{
            width: `${(Math.max(0, activeIndex) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= activeIndex
          const isActive = idx === activeIndex
          const Icon = step.icon

          return (
            <div
              key={step.key}
              className="flex md:flex-col items-center gap-4 md:gap-2 z-10 w-full md:w-auto relative"
            >
              {/* Connector line for mobile */}
              {idx < STEPS.length - 1 && (
                <div
                  className={clsx(
                    "absolute left-[18px] top-9 bottom-[-24px] w-1 md:hidden z-0",
                    isCompleted ? "bg-primary" : "bg-surface-container",
                  )}
                />
              )}

              {/* Icon Circle */}
              <div
                className={clsx(
                  "w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300",
                  isCompleted
                    ? "bg-primary border-primary text-white"
                    : "bg-surface-container border-outline-variant text-on-surface-variant/50",
                  isActive && "ring-4 ring-primary/20 scale-110",
                )}
              >
                <Icon
                  className={clsx("w-5 h-5", isActive && "animate-pulse")}
                />
              </div>

              {/* Step Label */}
              <div className="flex flex-col md:items-center">
                <span
                  className={clsx(
                    "text-xs font-bold uppercase tracking-wider",
                    isCompleted
                      ? "text-on-surface"
                      : "text-on-surface-variant/60",
                  )}
                >
                  {step.label}
                </span>
                {isActive && (
                  <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-[2px] mt-0.5 uppercase tracking-wide md:text-center block max-w-max">
                    Current
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
