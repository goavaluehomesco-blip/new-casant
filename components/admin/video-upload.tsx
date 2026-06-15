"use client"

import type React from "react"
import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Upload, X, Film, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VideoUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  className?: string
  label?: string
}

export default function VideoUpload({
  value,
  onChange,
  folder = "general",
  className,
  label = "Video",
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    const allowed = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"]
    if (!allowed.includes(file.type)) {
      setError("Please select a video file (MP4, MOV, WebM)")
      return
    }

    if (file.size > 200 * 1024 * 1024) {
      setError("File size must be less than 200 MB")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      const ext = file.name.split(".").pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("casant-media")
        .upload(fileName, file, {
          upsert: false,
          contentType: file.type || "video/mp4",
        })

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

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-colors overflow-hidden aspect-video",
          isDragging ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50",
          !value && "cursor-pointer hover:border-blue-300 hover:bg-blue-50/50",
        )}
        onClick={() => !value && !isUploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <>
            <video
              src={value}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
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
                <p className="text-sm text-slate-500">Uploading video...</p>
              </>
            ) : (
              <>
                <Film className="w-8 h-8 text-slate-300" />
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600">
                    Click or drag to upload {label}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    MP4, MOV, WebM up to 200 MB
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
        accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
