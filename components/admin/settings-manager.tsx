"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { revalidateCompanyInfo } from "@/lib/actions/revalidate"
import { Save, Building, Users, Share2, ImageIcon, Plus, Trash2, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import ImageUpload from "@/components/admin/image-upload"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CompanyInfo {
  id: string
  name: string
  tagline: string | null
  about_short: string | null
  about_full: string | null
  years_experience: number
  clients_count: number
  projects_count: number
  hotels_count: number
  email: string | null
  phone: string | null
  address: string | null
  logo_url: string | null
  divider_image_url: string | null
  track_record_images: string[] | null
  social_facebook: string | null
  social_instagram: string | null
  social_linkedin: string | null
  social_youtube: string | null
  inventory_hero_image_url: string | null
  maintenance_mode: boolean | null
}

interface SettingsManagerProps {
  companyInfo: CompanyInfo | null
}

export default function SettingsManager({ companyInfo }: SettingsManagerProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: companyInfo?.name || "Casant Events",
    tagline: companyInfo?.tagline || "",
    about_short: companyInfo?.about_short || "",
    about_full: companyInfo?.about_full || "",
    years_experience: companyInfo?.years_experience || 25,
    clients_count: companyInfo?.clients_count || 1000,
    projects_count: companyInfo?.projects_count || 1000,
    hotels_count: companyInfo?.hotels_count || 100,
    email: companyInfo?.email || "",
    phone: companyInfo?.phone || "",
    address: companyInfo?.address || "",
    logo_url: companyInfo?.logo_url || "",
    divider_image_url: companyInfo?.divider_image_url || "",
    track_record_images: Array.isArray(companyInfo?.track_record_images) ? companyInfo.track_record_images : [],
    social_facebook: companyInfo?.social_facebook || "",
    social_instagram: companyInfo?.social_instagram || "",
    social_linkedin: companyInfo?.social_linkedin || "",
    social_youtube: companyInfo?.social_youtube || "",
    inventory_hero_image_url: companyInfo?.inventory_hero_image_url || "",
    maintenance_mode: companyInfo?.maintenance_mode ?? false,
  })

  // Sync formData when companyInfo changes (after save and refresh)
  useEffect(() => {
    if (companyInfo) {
      setFormData({
        name: companyInfo.name || "Casant Events",
        tagline: companyInfo.tagline || "",
        about_short: companyInfo.about_short || "",
        about_full: companyInfo.about_full || "",
        years_experience: companyInfo.years_experience || 25,
        clients_count: companyInfo.clients_count || 1000,
        projects_count: companyInfo.projects_count || 1000,
        hotels_count: companyInfo.hotels_count || 100,
        email: companyInfo.email || "",
        phone: companyInfo.phone || "",
        address: companyInfo.address || "",
        logo_url: companyInfo.logo_url || "",
        divider_image_url: companyInfo.divider_image_url || "",
        track_record_images: Array.isArray(companyInfo.track_record_images) ? companyInfo.track_record_images : [],
        social_facebook: companyInfo.social_facebook || "",
        social_instagram: companyInfo.social_instagram || "",
        social_linkedin: companyInfo.social_linkedin || "",
        social_youtube: companyInfo.social_youtube || "",
        inventory_hero_image_url: companyInfo.inventory_hero_image_url || "",
        maintenance_mode: companyInfo.maintenance_mode ?? false,
      })
    }
  }, [companyInfo?.id])

  const handleSubmit = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setSaved(false)
    setError(null)

    try {
      const payload = {
        name: formData.name,
        tagline: formData.tagline,
        about_short: formData.about_short,
        about_full: formData.about_full,
        years_experience: formData.years_experience,
        clients_count: formData.clients_count,
        projects_count: formData.projects_count,
        hotels_count: formData.hotels_count,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        logo_url: formData.logo_url,
        social_facebook: formData.social_facebook,
        social_instagram: formData.social_instagram,
        social_linkedin: formData.social_linkedin,
        social_youtube: formData.social_youtube,
        divider_image_url: formData.divider_image_url,
        track_record_images: formData.track_record_images,
        inventory_hero_image_url: formData.inventory_hero_image_url,
        maintenance_mode: formData.maintenance_mode,
      }

      if (companyInfo?.id) {
        const { error } = await supabase.from("company_info").update(payload).eq("id", companyInfo.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("company_info").insert(payload)
        if (error) throw error
      }

      setError(null)
      setSaved(true)
      await revalidateCompanyInfo()
      router.refresh()
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      const msg = err instanceof Error
        ? err.message
        : (err as { message?: string })?.message || "Failed to save settings"
      setError(msg)
      setSaved(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Company Settings</h1>
          <p className="text-white/50">Manage your company information and branding</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="site" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Site
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Basic company details shown across the website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="Creating Unforgettable Moments"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about_short">Short Description</Label>
                  <Textarea
                    id="about_short"
                    value={formData.about_short}
                    onChange={(e) => setFormData({ ...formData, about_short: e.target.value })}
                    placeholder="A brief description for homepage..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about_full">Full About Text</Label>
                  <Textarea
                    id="about_full"
                    value={formData.about_full}
                    onChange={(e) => setFormData({ ...formData, about_full: e.target.value })}
                    placeholder="Detailed company description for About page..."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <ImageUpload
                    value={formData.logo_url}
                    onChange={(url) => setFormData({ ...formData, logo_url: url })}
                    folder="branding"
                    aspectRatio="auto"
                    label="Company Logo"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How customers can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="info@casantevents.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full address..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Company Statistics</CardTitle>
              <CardDescription>Numbers displayed on the homepage track record section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="years_experience">Years Experience</Label>
                  <Input
                    id="years_experience"
                    type="number"
                    value={formData.years_experience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        years_experience: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clients_count">Clients Count</Label>
                  <Input
                    id="clients_count"
                    type="number"
                    value={formData.clients_count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clients_count: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projects_count">Projects Count</Label>
                  <Input
                    id="projects_count"
                    type="number"
                    value={formData.projects_count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projects_count: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotels_count">Hotels Count</Label>
                  <Input
                    id="hotels_count"
                    type="number"
                    value={formData.hotels_count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hotels_count: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Page Hero Image</CardTitle>
                <CardDescription>Background image displayed on the Equipment/Inventory page hero banner</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.inventory_hero_image_url}
                  onChange={(url) => setFormData({ ...formData, inventory_hero_image_url: url })}
                  folder="pages"
                  label="Inventory Hero Image"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diagonal Divider Image</CardTitle>
                <CardDescription>Decorative strip image shown between sections on the homepage</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.divider_image_url}
                  onChange={(url) => setFormData({ ...formData, divider_image_url: url })}
                  folder="branding"
                  label="Divider Image"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Track Record Collage (up to 16 photos)</CardTitle>
                <CardDescription>Grid of photos shown behind the years counter in the track record section</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {(Array.isArray(formData.track_record_images) ? formData.track_record_images : []).map((image, idx) => (
                    <div key={idx} className="relative group">
                      <div className="relative h-20 rounded overflow-hidden bg-[#0a0a0a]">
                        <img
                          src={image}
                          alt={`Collage ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.track_record_images.filter((_, itemIdx) => itemIdx !== idx)
                            setFormData({ ...formData, track_record_images: updated })
                          }}
                          className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* Empty slots up to 16 */}
                  {[...Array(Math.max(0, 16 - (Array.isArray(formData.track_record_images) ? formData.track_record_images.length : 0)))].map((_, i) => (
                    <div key={`empty-${i}`} className="h-20 rounded border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center text-white/25 text-xs">
                      {(Array.isArray(formData.track_record_images) ? formData.track_record_images.length : 0) + i + 1}
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <p className="text-sm text-white/50 mb-2">Add photo ({formData.track_record_images.length}/16)</p>
                  {formData.track_record_images.length < 16 && (
                    <ImageUpload
                      value=""
                      onChange={(url) => {
                        if (url && formData.track_record_images.length < 16) {
                          setFormData({
                            ...formData,
                            track_record_images: [...formData.track_record_images, url],
                          })
                        }
                      }}
                      folder="track-record"
                      aspectRatio="square"
                      label="Add Collage Photo"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="social_facebook">Facebook</Label>
                  <Input
                    id="social_facebook"
                    value={formData.social_facebook}
                    onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_instagram">Instagram</Label>
                  <Input
                    id="social_instagram"
                    value={formData.social_instagram}
                    onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_linkedin">LinkedIn</Label>
                  <Input
                    id="social_linkedin"
                    value={formData.social_linkedin}
                    onChange={(e) => setFormData({ ...formData, social_linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_youtube">YouTube</Label>
                  <Input
                    id="social_youtube"
                    value={formData.social_youtube}
                    onChange={(e) => setFormData({ ...formData, social_youtube: e.target.value })}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle>Site Visibility</CardTitle>
              <CardDescription>Control whether the public website is accessible to visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 p-4 rounded-lg border border-amber-200 bg-amber-50">
                <Checkbox
                  id="maintenance_mode"
                  checked={formData.maintenance_mode}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, maintenance_mode: checked === true })
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label htmlFor="maintenance_mode" className="text-base font-semibold cursor-pointer">
                    Enable Maintenance Mode
                  </Label>
                  <p className="text-sm text-white/50 mt-1">
                    When enabled, all public pages will show a &quot;Website Under Maintenance&quot; page.
                    The admin panel remains fully accessible.
                  </p>
                  {formData.maintenance_mode && (
                    <p className="text-sm font-medium text-amber-700 mt-2">
                      Maintenance mode is currently ON — the public website is hidden.
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-white/40 mt-3">
                Remember to click &quot;Save Changes&quot; at the top to apply.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
