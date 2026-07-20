import { HttpTypes } from "@medusajs/types"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import React from "react"
import AddressStateField from "../address-state-field"
import CountrySelect from "../country-select"

/** Campos do formulário de endereço de entrega (grid + contato). */
const ShippingAddressFields = ({
  formData,
  onChange,
  cart,
  checked,
  onToggleSameAsBilling,
}: {
  formData: Record<string, string>
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void
  cart: HttpTypes.StoreCart | null
  checked: boolean
  onToggleSameAsBilling: () => void
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData["shipping_address.first_name"]}
          onChange={onChange}
          required
          data-testid="shipping-first-name-input"
        />
        <Input
          label="Last name"
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData["shipping_address.last_name"]}
          onChange={onChange}
          required
          data-testid="shipping-last-name-input"
        />
        <Input
          label="Address"
          name="shipping_address.address_1"
          autoComplete="address-line1"
          value={formData["shipping_address.address_1"]}
          onChange={onChange}
          required
          data-testid="shipping-address-input"
        />
        <Input
          label="Apartment, suite, etc."
          name="shipping_address.address_2"
          autoComplete="address-line2"
          value={formData["shipping_address.address_2"]}
          onChange={onChange}
          data-testid="shipping-address-2-input"
        />
        <Input
          label="Company"
          name="shipping_address.company"
          value={formData["shipping_address.company"]}
          onChange={onChange}
          autoComplete="organization"
          data-testid="shipping-company-input"
        />
        <Input
          label="Postal code"
          name="shipping_address.postal_code"
          autoComplete="postal-code"
          value={formData["shipping_address.postal_code"]}
          onChange={onChange}
          required
          data-testid="shipping-postal-code-input"
        />
        <Input
          label="City"
          name="shipping_address.city"
          autoComplete="address-level2"
          value={formData["shipping_address.city"]}
          onChange={onChange}
          required
          data-testid="shipping-city-input"
        />
        <CountrySelect
          name="shipping_address.country_code"
          autoComplete="country"
          region={cart?.region}
          value={formData["shipping_address.country_code"]}
          onChange={onChange}
          required
          data-testid="shipping-country-select"
        />
        <AddressStateField
          name="shipping_address.province"
          countryCode={formData["shipping_address.country_code"]}
          value={formData["shipping_address.province"]}
          onChange={onChange}
          data-testid="shipping-province-input"
        />
      </div>
      <div className="my-8">
        <Checkbox
          label="Billing address same as shipping address"
          name="same_as_billing"
          checked={checked}
          onChange={onToggleSameAsBilling}
          data-testid="billing-address-checkbox"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input
          label="Email"
          name="email"
          type="email"
          title="Enter a valid email address."
          autoComplete="email"
          value={formData.email}
          onChange={onChange}
          required
          data-testid="shipping-email-input"
        />
        <Input
          label="Phone"
          name="shipping_address.phone"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={onChange}
          data-testid="shipping-phone-input"
        />
      </div>
    </>
  )
}

export default ShippingAddressFields
