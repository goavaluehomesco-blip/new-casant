"use client"

import type React from "react"
import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  className?: string
  aspectRatio?: "square" | "video" | "auto"
  label?: string
  /** Restrict accepted image MIME types, e.g. ["image/png"]. Defaults to all common image types. */
  acceptTypes?: string[]
}

const DEFAULT_ACCEPT_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

const MIME_LABELS: Record<string, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/gif": "GIF",
  "image/webp": "WebP",
}

export default function ImageUpload({
  value,
  onChange,
  folder = "general",
  className,
  aspectRatio = "video",
  label = "Image",
  acceptTypes = DEFAULT_ACCEPT_TYPES,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Compress image client-side before uploading to reduce Supabase storage egress.
  // Sources that can have transparency (PNG/WebP/GIF) are re-encoded as WebP to
  // preserve the alpha channel — encoding everything as JPEG would flatten
  // transparent pixels to black, which is why logos used to get a black background.
  const compressImage = (file: File): Promise<File> => {
    const canHaveAlpha = ["image/png", "image/webp", "image/gif"].includes(file.type)
    const outputType = canHaveAlpha ? "image/webp" : "image/jpeg"
    const outputExt = canHaveAlpha ? ".webp" : ".jpg"
    const quality = canHaveAlpha ? 0.9 : 0.82

    return new Promise((resolve) => {
      const img = new window.Image()
      const url = URL.createObjectURL(file)
      img.crossOrigin = "anonymous"
      img.onload = () => {
        URL.revokeObjectURL(url)
        const MAX = 1200 // max width/height in px
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX }
          else { width = Math.round((width * MAX) / height); height = MAX }
        }
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, outputExt), { type: outputType }))
          },
          outputType,
          quality,
        )
      }
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
      img.src = url
    })
  }

  const acceptedLabel = acceptTypes.map((t) => MIME_LABELS[t] || t).join(", ")

  const uploadFile = async (file: File) => {
    if (!acceptTypes.includes(file.type)) {
      setError(`Please select a ${acceptedLabel} file`)
      return
    }

    if (file.size > 500 * 1024) {
      setError("File size must be less than 500KB")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Compress before uploading — reduces storage use and future egress.
      // Transparent sources (PNG/WebP/GIF) stay as WebP to keep their alpha channel.
      const compressed = await compressImage(file)
      const ext = compressed.type === "image/webp" ? "webp" : compressed.type === "image/png" ? "png" : "jpg"

      const supabase = createClient()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("casant-media")
        .upload(fileName, compressed, { upsert: false, contentType: compressed.type })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("casant-media").getPublicUrl(fileName)
      onChange(data.publicUrl)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed"
      setError(msg)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    // reset so same file can be re-selected
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const handleRemove = () => {
    onChange("")
    setError(null)
  }

  const aspectClass =
    aspectRatio === "square" ? "aspect-square" : aspectRatio === "video" ? "aspect-video" : "min-h-[120px]"

  const bgClass = aspectRatio === "auto" 
    ? (isDragging ? "border-blue-400 bg-transparent" : "border-slate-200 bg-transparent")
    : (isDragging ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50")

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-colors overflow-hidden",
          aspectClass,
          bgClass,
          !value && "cursor-pointer hover:border-blue-300 hover:bg-blue-50/50",
        )}
        onClick={() => !value && !isUploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <>
            <img
              src={value}
              alt={label}
              className={cn("w-full h-full", aspectRatio === "auto" ? "object-contain" : "object-cover")}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={(e) => { e.stopPropagation(); handleRemove() }}
              >
                <X className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-sm text-slate-500">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-slate-300" />
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600">
                    Click or drag to upload
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {acceptedLabel} up to 500KB
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptTypes.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
