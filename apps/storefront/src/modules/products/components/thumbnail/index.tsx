import { Container, clx } from "@modules/common/components/ui"
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url?: string }[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
  isContain?: boolean
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
  isContain,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden transition-shadow ease-in-out duration-150",
        isContain
          ? "!border-none !shadow-none !bg-transparent !p-0 h-full w-full"
          : "p-4 bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover",
        className,
        {
          "aspect-[11/14]": isFeatured && !isContain,
          "aspect-[9/16]": !isFeatured && size !== "square" && !isContain,
          "aspect-[1/1]": size === "square" || isContain,
          "w-[180px]": size === "small" && !isContain,
          "w-[290px]": size === "medium" && !isContain,
          "w-[440px]": size === "large" && !isContain,
          "w-full": size === "full" || isContain,
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} isContain={isContain} />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
  isContain,
}: Pick<ThumbnailProps, "size" | "isContain"> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt="Thumbnail"
      className={clx(
        "absolute inset-0 object-center",
        isContain ? "object-contain p-3" : "object-cover"
      )}
      draggable={false}
      quality={50}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
