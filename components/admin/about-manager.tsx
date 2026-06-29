"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, AlertCircle } from "lucide-react"
import type { CompanyInfo } from "@/lib/data/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { revalidateCompanyInfo } from "@/lib/actions/revalidate"
import ImageUpload from "@/components/admin/image-upload"

interface AboutManagerProps {
  companyInfo: CompanyInfo | null
}

export default function AboutManager({ companyInfo }: AboutManagerProps) {
  const supabase = createClient()
  const router = useRouter()

  const [formData, setFormData] = useState({
    tagline: companyInfo?.tagline || "",
    about_short: companyInfo?.about_short || "",
    about_full: companyInfo?.about_full || "",
    years_experience: companyInfo?.years_experience || 25,
    clients_count: companyInfo?.clients_count || 1000,
    projects_count: companyInfo?.projects_count || 1000,
    hotels_count: companyInfo?.hotels_count || 100,
    about_hero_image_url: companyInfo?.about_hero_image_url || "",
    about_story_image_url: companyInfo?.about_story_image_url || "",
  })

  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name.includes("count") || name === "years_experience" ? parseInt(value) || 0 : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        updated_at: new Date().toISOString(),
      }

      if (companyInfo?.id) {
        const { error: updateError } = await supabase
          .from("company_info")
          .update(payload)
          .eq("id", companyInfo.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from("company_info")
          .insert([{ ...payload, name: "Casant Events" }])

        if (insertError) throw insertError
      }

      setError(null)
      setSaved(true)
      await revalidateCompanyInfo()
      router.refresh()
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save"
      setError(message)
      console.error("Save error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">About Page</h1>
        <p className="text-white/60">Edit company information, statistics, and About page content</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Tagline & Short Bio */}
        <div className="bg-[#161616] border border-white/10 rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Company Tagline</label>
            <Input
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="e.g., For over 25 years, we've been transforming visions..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Short About (Hero Section)</label>
            <Textarea
              name="about_short"
              value={formData.about_short}
              onChange={handleChange}
              placeholder="Brief description shown on homepage..."
              rows={3}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Full About Text (About Page)</label>
            <Textarea
              name="about_full"
              value={formData.about_full}
              onChange={handleChange}
              placeholder="Detailed company story and background..."
              rows={6}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-[#161616] border border-white/10 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white mb-2">About Page Images</h2>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Hero Background Image
            </label>
            <p className="text-xs text-white/40 mb-3">
              Full-width banner shown at the top of the About page
            </p>
            <ImageUpload
              value={formData.about_hero_image_url}
              onChange={(url) => setFormData({ ...formData, about_hero_image_url: url })}
              folder="about"
              aspectRatio="video"
              label="Hero background photo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Our Story Section Image
            </label>
            <p className="text-xs text-white/40 mb-3">
              Photo shown beside the company story text
            </p>
            <ImageUpload
              value={formData.about_story_image_url}
              onChange={(url) => setFormData({ ...formData, about_story_image_url: url })}
              folder="about"
              aspectRatio="square"
              label="Story section photo"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-[#161616] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Company Statistics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 uppercase tracking-wide mb-2">
                Years Experience
              </label>
              <Input
                type="number"
                name="years_experience"
                value={formData.years_experience}
                onChange={handleChange}
                className="bg-white/5 border-white/10 text-white text-lg font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 uppercase tracking-wide mb-2">
                Clients
              </label>
              <Input
                type="number"
                name="clients_count"
                value={formData.clients_count}
                onChange={handleChange}
                className="bg-white/5 border-white/10 text-white text-lg font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 uppercase tracking-wide mb-2">
                Projects
              </label>
              <Input
                type="number"
                name="projects_count"
                value={formData.projects_count}
                onChange={handleChange}
                className="bg-white/5 border-white/10 text-white text-lg font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 uppercase tracking-wide mb-2">
                Hotels
              </label>
              <Input
                type="number"
                name="hotels_count"
                value={formData.hotels_count}
                onChange={handleChange}
                className="bg-white/5 border-white/10 text-white text-lg font-bold"
              />
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-red-400 text-sm">{error}</div>
          </div>
        )}

        {saved && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="text-green-400 text-sm">About page content saved successfully</div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
