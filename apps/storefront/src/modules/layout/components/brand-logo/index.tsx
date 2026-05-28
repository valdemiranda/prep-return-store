import Image from "next/image"

interface BrandLogoProps {
  className?: string
}

export default function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="One Stop Liquidation"
      width={92}
      height={62}
      priority
      className={`h-10 w-auto md:h-12 self-start select-none ${className}`}
    />
  )
}
