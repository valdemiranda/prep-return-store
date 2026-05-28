type FilterOption = {
  label: string
  value: string
}

type FilterSectionProps = {
  maxHeight?: boolean
  multiple?: boolean
  onChange: (value: string, checked: boolean) => void
  options: FilterOption[]
  selected: string[]
  title: string
}

const FilterSection = ({
  maxHeight,
  multiple = true,
  onChange,
  options,
  selected,
  title,
}: FilterSectionProps) => {
  return (
    <section>
      <h3 className="mb-3 font-sans text-xs font-bold uppercase tracking-wider text-on-surface">
        {title}
      </h3>
      <div className={maxHeight ? "space-y-2 max-h-56 overflow-y-auto no-scrollbar" : "space-y-2"}>
        {options.map((option) => {
          const isChecked = selected.includes(option.value)

          return (
            <label
              className="group flex cursor-pointer items-center gap-2"
              key={option.value}
            >
              <input
                checked={isChecked}
                className="h-4 w-4 cursor-pointer rounded-[2px] border-outline text-primary focus:ring-primary"
                onChange={(event) => onChange(option.value, event.target.checked)}
                type={multiple ? "checkbox" : "radio"}
              />
              <span className="text-sm text-on-surface-variant transition-colors group-hover:text-primary">
                {option.label}
              </span>
            </label>
          )
        })}
      </div>
    </section>
  )
}

export default FilterSection
