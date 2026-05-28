import { ChangeEvent, useRef, useState } from "react"
import { Button, Input, Label, toast } from "@medusajs/ui"
import { ArrowUpTray, Image } from "@medusajs/icons"

import { uploadImage } from "../lib/sdk"

type ImageUrlFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  previewAlt?: string
}

export function ImageUrlField({
  id,
  label,
  value,
  onChange,
  previewAlt = "Image preview",
}: ImageUrlFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setIsUploading(true)
    try {
      onChange(await uploadImage(file))
      toast.success("Image uploaded")
    } catch {
      toast.error("Image upload failed")
    } finally {
      setIsUploading(false)
      event.target.value = ""
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold">
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          id={id}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="secondary"
          isLoading={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <ArrowUpTray className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex min-h-[92px] items-center justify-center overflow-hidden rounded border border-ui-border-base bg-ui-bg-subtle">
        {value ? (
          <img
            src={value}
            alt={previewAlt}
            className="h-full max-h-[140px] w-full object-cover"
          />
        ) : (
          <Image className="h-6 w-6 text-ui-fg-muted" />
        )}
      </div>
    </div>
  )
}
