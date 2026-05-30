"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Share2 } from "lucide-react"

type ProductShareProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductShare({ product }: ProductShareProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const title = product.title || "Product"

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch (err) {
        // Handle abort gracefully (user cancelled the share sheet)
        console.debug("Share API aborted or failed:", err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Clipboard write failed:", err)
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-sm border border-outline-variant bg-transparent text-xs font-bold uppercase tracking-wider text-on-surface hover:bg-surface-container active:scale-95 transition-all duration-200"
      aria-label="Share product"
    >
      <Share2 className="w-3.5 h-3.5 text-on-surface-variant" />
      <span>{copied ? "Link copied!" : "Share"}</span>
    </button>
  )
}
