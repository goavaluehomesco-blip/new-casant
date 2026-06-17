"use client"

import Image from "next/image"

interface DiagonalDividerProps {
  imageUrl?: string | null
}

const DEFAULT_DIVIDER = "/images/divider.png"

export function DiagonalDivider({ imageUrl }: DiagonalDividerProps) {
  const src = imageUrl || DEFAULT_DIVIDER

  return (
    <div className="w-full overflow-hidden relative" style={{ aspectRatio: "16/3" }}>
      <Image
        src={src}
        alt=""
        fill
        className="object-none"
        sizes="100vw"
        priority={false}
        style={{ fontSize: "10px" }}
      />
    </div>
  )
}
