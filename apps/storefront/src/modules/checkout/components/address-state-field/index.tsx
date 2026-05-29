import Input from "@modules/common/components/input"
import type { ChangeEventHandler } from "react"
import StateSelect, { isUsStateCode } from "../state-select"

type AddressStateFieldProps = {
  name: string
  value: string
  countryCode: string
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>
  "data-testid"?: string
}

const AddressStateField = ({
  name,
  value,
  countryCode,
  onChange,
  "data-testid": testId,
}: AddressStateFieldProps) => {
  const isUnitedStates = countryCode.toLowerCase() === "us"

  if (isUnitedStates) {
    const normalizedValue = value.toUpperCase()

    return (
      <StateSelect
        name={name}
        autoComplete="address-level1"
        value={isUsStateCode(normalizedValue) ? normalizedValue : ""}
        onChange={onChange}
        required
        data-testid={testId?.replace("-input", "-select")}
      />
    )
  }

  return (
    <Input
      label="State / Province"
      name={name}
      autoComplete="address-level1"
      value={value}
      onChange={onChange}
      data-testid={testId}
    />
  )
}

export default AddressStateField
