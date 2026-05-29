import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Button, Heading, Input, Label, Select, Switch, toast } from "@medusajs/ui"
import { CurrencyDollar } from "@medusajs/icons"
import { useFreeShipping, useUpdateFreeShipping } from "../../hooks/use-free-shipping"

const FreeShippingPage = () => {
  const { data, isLoading, isError } = useFreeShipping()
  const updateMutation = useUpdateFreeShipping()

  const [shipping_option_id, setShippingOptionId] = useState<string>("")
  const [threshold, setThreshold] = useState<string>("")
  const [enabled, setEnabled] = useState<boolean>(false)

  useEffect(() => {
    if (data) {
      if (data.config !== null) {
        setShippingOptionId(data.config.shipping_option_id)
        setThreshold(String(data.config.threshold))
        setEnabled(true)
      } else {
        setShippingOptionId(data.shipping_options?.[0]?.id || "")
        setThreshold("")
        setEnabled(false)
      }
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9e0000]"></div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 border border-red-200 rounded-[4px] m-6 font-sans">
        Failed to load free shipping settings. Please try again.
      </div>
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (enabled && (!shipping_option_id || Number(threshold) <= 0)) {
      toast.error("Select a shipping option and a threshold greater than 0")
      return
    }
    try {
      await updateMutation.mutateAsync({
        shipping_option_id,
        threshold: Number(threshold),
        enabled,
      })
      toast.success("Free shipping settings saved")
    } catch (err) {
      console.error(err)
      toast.error("Failed to save free shipping settings")
    }
  }

  return (
    <form onSubmit={handleSave} className="flex w-full max-w-6xl flex-col gap-6 mx-auto p-4 md:p-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e5e2e1] pb-4">
        <div>
          <Heading level="h1" className="text-2xl font-black text-[#1c1b1b] font-headline uppercase tracking-tight">
            Free Shipping
          </Heading>
          <p className="text-sm text-[#5e3f3a]">
            Enable free shipping above a configurable order value for a selectable shipping option.
          </p>
        </div>
        <Button
          type="submit"
          isLoading={updateMutation.isPending}
          className="bg-[#9e0000] text-white font-bold uppercase rounded-[4px] hover:bg-[#cc0000] hover:scale-[1.02] active:scale-[0.98] transition-all px-6 py-2.5 shadow-md text-sm"
        >
          Save Changes
        </Button>
      </div>

      <div className="flex flex-col gap-6 p-6 border border-[#e5e2e1] rounded-[4px] bg-[#fdfcfb]">
        {/* Switch block */}
        <div className="flex items-center justify-between border-b border-[#e5e2e1] pb-6">
          <div className="flex flex-col gap-1">
            <Label htmlFor="free-shipping-enabled" className="text-sm font-bold text-[#1c1b1b]">
              Enable Free Shipping
            </Label>
            <p className="text-xs text-[#5e3f3a]">
              Toggle to enable or disable the free shipping threshold for your store.
            </p>
          </div>
          <Switch
            id="free-shipping-enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        {/* Inputs section */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-200 ${!enabled ? "opacity-50" : ""}`}>
          {/* Shipping Option Select */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="shipping-option-select" className={`text-xs font-bold uppercase tracking-wider text-[#5e3f3a] ${!enabled ? "cursor-not-allowed text-[#8c7a76]" : ""}`}>
              Shipping Option
            </Label>
            <Select
              value={shipping_option_id}
              onValueChange={setShippingOptionId}
              disabled={!enabled}
            >
              <Select.Trigger id="shipping-option-select" className="bg-white border border-[#e5e2e1] rounded-[4px] text-sm h-10 w-full focus:border-[#9e0000] focus:ring-1 focus:ring-[#9e0000]">
                <Select.Value placeholder="Select shipping option..." />
              </Select.Trigger>
              <Select.Content className="bg-white border border-[#e5e2e1] rounded-[4px] z-50">
                {data.shipping_options?.map((opt) => (
                  <Select.Item key={opt.id} value={opt.id}>
                    {opt.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <p className="text-xs text-[#8c7a76]">
              Choose the shipping option that will become free.
            </p>
          </div>

          {/* Threshold input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="threshold-input" className={`text-xs font-bold uppercase tracking-wider text-[#5e3f3a] ${!enabled ? "cursor-not-allowed text-[#8c7a76]" : ""}`}>
              Threshold Amount
            </Label>
            <div className="relative flex items-center">
              <Input
                id="threshold-input"
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                disabled={!enabled}
                className="bg-white border border-[#e5e2e1] rounded-[4px] text-sm h-10 w-full pr-16 focus:border-[#9e0000] focus:ring-1 focus:ring-[#9e0000]"
              />
              <div className="absolute right-3 text-xs font-extrabold text-[#9e0000] bg-gray-50 px-2 py-1 rounded border border-[#e5e2e1] select-none pointer-events-none uppercase">
                {data.currency_code}
              </div>
            </div>
            <p className="text-xs text-[#8c7a76]">
              Orders with an item total at or above this value get free shipping ({data.currency_code?.toUpperCase()}).
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}

export const config = defineRouteConfig({
  label: "Free Shipping",
  icon: CurrencyDollar,
})

export default FreeShippingPage
