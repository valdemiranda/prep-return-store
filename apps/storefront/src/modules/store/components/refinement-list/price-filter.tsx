"use client"

import { useState, useEffect } from "react"

type PriceFilterProps = {
  minPrice: number
  maxPrice: number
  priceParam: string | null
  onChange: (priceRange: string) => void
}

export default function PriceFilter({
  minPrice,
  maxPrice,
  priceParam,
  onChange,
}: PriceFilterProps) {
  const [tempMin, setTempMin] = useState(minPrice)
  const [tempMax, setTempMax] = useState(maxPrice)

  useEffect(() => {
    const [pMin, pMax] = priceParam
      ? priceParam.split("-").map(Number)
      : [minPrice, maxPrice]
    
    setTempMin(isNaN(pMin) ? minPrice : Math.max(minPrice, Math.min(pMin, maxPrice)))
    setTempMax(isNaN(pMax) ? maxPrice : Math.min(maxPrice, Math.max(pMax, minPrice)))
  }, [priceParam, minPrice, maxPrice])

  const handleApply = () => {
    onChange(`${tempMin}-${tempMax}`)
  }

  const minPercent = ((tempMin - minPrice) / (maxPrice - minPrice || 1)) * 100
  const maxPercent = ((tempMax - minPrice) / (maxPrice - minPrice || 1)) * 100

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <span className="font-bold text-xs uppercase tracking-wider text-on-surface">Price Range</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-[10px] text-on-surface-variant uppercase font-bold block mb-1">Min</label>
          <input
            type="number"
            min={minPrice}
            max={maxPrice}
            value={tempMin}
            onChange={(e) => {
              const val = Math.max(minPrice, Math.min(maxPrice, Number(e.target.value)))
              setTempMin(val)
            }}
            className="w-full bg-surface-container border border-outline-variant text-xs px-2 py-2 rounded-[4px] text-on-surface focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>
        <div className="self-end pb-2 text-on-surface-variant font-bold">-</div>
        <div className="flex-1">
          <label className="text-[10px] text-on-surface-variant uppercase font-bold block mb-1">Max</label>
          <input
            type="number"
            min={minPrice}
            max={maxPrice}
            value={tempMax}
            onChange={(e) => {
              const val = Math.min(maxPrice, Math.max(minPrice, Number(e.target.value)))
              setTempMax(val)
            }}
            className="w-full bg-surface-container border border-outline-variant text-xs px-2 py-2 rounded-[4px] text-on-surface focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="relative pt-6 pb-2 px-1">
        <div className="relative h-1.5 w-full bg-surface-container-highest rounded-full">
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={tempMin}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), tempMax)
              setTempMin(val)
            }}
            className="absolute pointer-events-none appearance-none w-full h-1.5 bg-transparent accent-primary cursor-pointer left-0 top-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:appearance-none"
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={tempMax}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), tempMin)
              setTempMax(val)
            }}
            className="absolute pointer-events-none appearance-none w-full h-1.5 bg-transparent accent-primary cursor-pointer left-0 top-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:appearance-none"
          />
        </div>
      </div>

      <button
        onClick={handleApply}
        className="w-full py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-[4px] transition-all active:scale-[0.98] text-center text-xs uppercase tracking-wider"
      >
        Apply Price Filter
      </button>
    </div>
  )
}
