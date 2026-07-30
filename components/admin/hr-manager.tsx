"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Briefcase, MapPin, Clock, ToggleLeft, ToggleRight, AlertCircle } from "lucide-react"
import type { JobPosting, HrInfo, CompanyInfo } from "@/lib/data/types"
import ImageUpload from "@/components/admin/image-upload"
import { revalidateCompanyInfo } from "@/lib/actions/revalidate"
import { useRouter } from "next/navigation"

interface HrManagerProps {
  jobPostings: JobPosting[]
  hrInfo: HrInfo | null
  companyInfo: CompanyInfo | null
}

export default function HrManager({ jobPostings: initialJobs, hrInfo: initialHr, companyInfo }: HrManagerProps) {
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs)
  const [hr, setHr] = useState<HrInfo | null>(initialHr)
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null)
  const [saving, setSaving] = useState(false)
  const [savingHr, setSavingHr] = useState(false)
  const [savingHero, setSavingHero] = useState(false)
  const [heroSaved, setHeroSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hrSaved, setHrSaved] = useState(false)
  const [careersHeroImage, setCareersHeroImage] = useState(companyInfo?.careers_hero_image_url || "")
  const router = useRouter()
  const [jobForm, setJobForm] = useState({ title: "", department: "", location: "", job_type: "Full-time", description: "", requirements: "" })
  const [hrForm, setHrForm] = useState({
    heading: hr?.heading || "Join Our Team",
    subheading: hr?.subheading || "",
    description: hr?.description || "",
    hr_name: hr?.hr_name || "",
    hr_email: hr?.hr_email || "",
    hr_phone: hr?.hr_phone || "",
    hr_image_url: hr?.hr_image_url || "",
  })
  const supabase = createClient()

  const openNewJob = () => {
    setEditingJob(null)
    setJobForm({ title: "", department: "", location: "", job_type: "Full-time", description: "", requirements: "" })
    setIsJobDialogOpen(true)
  }

  const openEditJob = (job: JobPosting) => {
    setEditingJob(job)
    setJobForm({
      title: job.title,
      department: job.department || "",
      location: job.location || "",
      job_type: job.job_type,
      description: job.description,
      requirements: job.requirements || "",
    })
    setIsJobDialogOpen(true)
  }

  const handleSaveJob = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        title: jobForm.title,
        department: jobForm.department || null,
        location: jobForm.location || null,
        job_type: jobForm.job_type,
        description: jobForm.description,
        requirements: jobForm.requirements || null,
      }
      if (editingJob) {
        const { data, error: err } = await supabase.from("job_postings").update(payload).eq("id", editingJob.id).select().single()
        if (err) throw err
        if (data) setJobs(jobs.map(j => j.id === editingJob.id ? data : j))
      } else {
        const { data, error: err } = await supabase.from("job_postings").insert({ ...payload, is_active: true, display_order: jobs.length }).select().single()
        if (err) throw err
        if (data) setJobs([...jobs, data])
      }
      setIsJobDialogOpen(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save job posting"
      setError(msg)
      console.error("[v0] Job save error:", msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Delete this job posting?")) return
    setError(null)
    try {
      const { error: err } = await supabase.from("job_postings").delete().eq("id", id)
      if (err) throw err
      setJobs(jobs.filter(j => j.id !== id))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete job posting"
      setError(msg)
      console.error("[v0] Delete error:", msg)
    }
  }

  const toggleJobActive = async (job: JobPosting) => {
    const { data } = await supabase.from("job_postings").update({ is_active: !job.is_active }).eq("id", job.id).select().single()
    if (data) setJobs(jobs.map(j => j.id === job.id ? data : j))
  }

  const handleSaveHeroImage = async () => {
    if (!companyInfo?.id) return
    setSavingHero(true)
    const { error } = await supabase
      .from("company_info")
      .update({ careers_hero_image_url: careersHeroImage || null })
      .eq("id", companyInfo.id)
    if (!error) {
      await revalidateCompanyInfo()
      router.refresh()
      setHeroSaved(true)
      setTimeout(() => setHeroSaved(false), 3000)
    }
    setSavingHero(false)
  }

  const handleSaveHr = async () => {
    setSavingHr(true)
    setError(null)
    try {
      const payload = {
        heading: hrForm.heading,
        subheading: hrForm.subheading || null,
        description: hrForm.description || null,
        hr_name: hrForm.hr_name || null,
        hr_email: hrForm.hr_email || null,
        hr_phone: hrForm.hr_phone || null,
        hr_image_url: hrForm.hr_image_url || null,
      }
      if (hr) {
        const { data, error: err } = await supabase.from("hr_info").update(payload).eq("id", hr.id).select().single()
        if (err) throw err
        if (data) setHr(data)
      } else {
        const { data, error: err } = await supabase.from("hr_info").insert(payload).select().single()
        if (err) throw err
        if (data) setHr(data)
      }
      setHrSaved(true)
      setTimeout(() => setHrSaved(false), 3000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save HR settings"
      setError(msg)
      console.error("[v0] HR save error:", msg)
    } finally {
      setSavingHr(false)
    }
  }

  return (
    <div className="p-8 space-y-10">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-400">{error}</div>
        </div>
      )}
      {/* Careers Hero Background Image */}
      <div className="bg-[#161616] border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-1">Hero Background Image</h2>
        <p className="text-white/40 text-sm mb-5">Full-width photo shown behind the "Join Our Team" heading on the Careers page</p>
        <ImageUpload
          value={careersHeroImage}
          onChange={setCareersHeroImage}
          folder="careers"
          aspectRatio="video"
          label="Careers hero background"
        />
        <div className="flex items-center gap-3 mt-4">
          <Button onClick={handleSaveHeroImage} disabled={savingHero}>
            {savingHero ? "Saving..." : "Save Hero Image"}
          </Button>
          {heroSaved && <span className="text-green-400 text-sm">Saved!</span>}
        </div>
      </div>

      {/* HR Info Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-white mb-5">Careers Page Settings</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Page Heading</Label>
            <Input value={hrForm.heading} onChange={e => setHrForm({ ...hrForm, heading: e.target.value })} placeholder="Join Our Team" />
          </div>
          <div className="grid gap-2">
            <Label>Subheading</Label>
            <Input value={hrForm.subheading} onChange={e => setHrForm({ ...hrForm, subheading: e.target.value })} placeholder="Be part of something extraordinary" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea value={hrForm.description} onChange={e => setHrForm({ ...hrForm, description: e.target.value })} rows={3} />
          </div>
          <div className="grid gap-2">
            <Label>HR Contact Name</Label>
            <Input value={hrForm.hr_name} onChange={e => setHrForm({ ...hrForm, hr_name: e.target.value })} placeholder="HR Department" />
          </div>
          <div className="grid gap-2">
            <Label>HR Email</Label>
            <Input value={hrForm.hr_email} onChange={e => setHrForm({ ...hrForm, hr_email: e.target.value })} placeholder="hr@casantevents.com" />
          </div>
          <div className="grid gap-2">
            <Label>HR Phone</Label>
            <Input value={hrForm.hr_phone} onChange={e => setHrForm({ ...hrForm, hr_phone: e.target.value })} placeholder="+91 98765 43210" />
          </div>
          <div className="grid gap-2">
            <Label>HR Photo URL</Label>
            <Input value={hrForm.hr_image_url} onChange={e => setHrForm({ ...hrForm, hr_image_url: e.target.value })} placeholder="https://..." />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <Button onClick={handleSaveHr} disabled={savingHr}>{savingHr ? "Saving..." : "Save Settings"}</Button>
          {hrSaved && <span className="text-green-400 text-sm">Saved!</span>}
        </div>
      </div>

      {/* Job Postings */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Job Postings</h2>
            <p className="text-white/50 text-sm mt-0.5">Manage open positions shown on the Careers page</p>
          </div>
          <Button onClick={openNewJob} className="gap-2"><Plus className="w-4 h-4" />Add Job</Button>
        </div>

        <div className="grid gap-4">
          {jobs.length === 0 && (
            <div className="text-center py-12 text-white/40 bg-white rounded-xl border border-slate-200">No job postings yet.</div>
          )}
          {jobs.map(job => (
            <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4 items-start">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{job.title}</span>
                  {job.department && <span className="text-xs bg-slate-100 text-white/60 px-2 py-0.5 rounded-full">{job.department}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${job.is_active ? "bg-green-50 text-green-700" : "bg-slate-100 text-white/50"}`}>{job.is_active ? "Active" : "Hidden"}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-white/40">
                  {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.job_type}</span>
                </div>
                <p className="text-white/50 text-sm mt-2 line-clamp-2">{job.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleJobActive(job)} className="text-white/40 hover:text-primary transition-colors">
                  {job.is_active ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <Button size="sm" variant="ghost" onClick={() => openEditJob(job)}><Pencil className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => handleDeleteJob(job.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJob ? "Edit Job Posting" : "Add Job Posting"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 pt-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Job Title *</Label>
                <Input value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} placeholder="Lighting Technician" />
              </div>
              <div className="grid gap-2">
                <Label>Department</Label>
                <Input value={jobForm.department} onChange={e => setJobForm({ ...jobForm, department: e.target.value })} placeholder="Production" />
              </div>
              <div className="grid gap-2">
                <Label>Location</Label>
                <Input value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} placeholder="Goa / Mumbai" />
              </div>
              <div className="grid gap-2">
                <Label>Job Type</Label>
                <Input value={jobForm.job_type} onChange={e => setJobForm({ ...jobForm, job_type: e.target.value })} placeholder="Full-time" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description *</Label>
              <Textarea value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} rows={4} placeholder="Role overview..." />
            </div>
            <div className="grid gap-2">
              <Label>Requirements</Label>
              <Textarea value={jobForm.requirements} onChange={e => setJobForm({ ...jobForm, requirements: e.target.value })} rows={4} placeholder="One requirement per line..." />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsJobDialogOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSaveJob} disabled={saving || !jobForm.title || !jobForm.description}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
