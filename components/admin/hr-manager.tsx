"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Briefcase, MapPin, Clock, ToggleLeft, ToggleRight } from "lucide-react"
import type { JobPosting, HrInfo } from "@/lib/data/types"

interface HrManagerProps {
  jobPostings: JobPosting[]
  hrInfo: HrInfo | null
}

export default function HrManager({ jobPostings: initialJobs, hrInfo: initialHr }: HrManagerProps) {
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs)
  const [hr, setHr] = useState<HrInfo | null>(initialHr)
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null)
  const [saving, setSaving] = useState(false)
  const [savingHr, setSavingHr] = useState(false)
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
    const payload = {
      title: jobForm.title,
      department: jobForm.department || null,
      location: jobForm.location || null,
      job_type: jobForm.job_type,
      description: jobForm.description,
      requirements: jobForm.requirements || null,
    }
    if (editingJob) {
      const { data } = await supabase.from("job_postings").update(payload).eq("id", editingJob.id).select().single()
      if (data) setJobs(jobs.map(j => j.id === editingJob.id ? data : j))
    } else {
      const { data } = await supabase.from("job_postings").insert({ ...payload, is_active: true, display_order: jobs.length }).select().single()
      if (data) setJobs([...jobs, data])
    }
    setSaving(false)
    setIsJobDialogOpen(false)
  }

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Delete this job posting?")) return
    await supabase.from("job_postings").delete().eq("id", id)
    setJobs(jobs.filter(j => j.id !== id))
  }

  const toggleJobActive = async (job: JobPosting) => {
    const { data } = await supabase.from("job_postings").update({ is_active: !job.is_active }).eq("id", job.id).select().single()
    if (data) setJobs(jobs.map(j => j.id === job.id ? data : j))
  }

  const handleSaveHr = async () => {
    setSavingHr(true)
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
      const { data } = await supabase.from("hr_info").update(payload).eq("id", hr.id).select().single()
      if (data) setHr(data)
    } else {
      const { data } = await supabase.from("hr_info").insert(payload).select().single()
      if (data) setHr(data)
    }
    setSavingHr(false)
  }

  return (
    <div className="p-8 space-y-10">
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
        <Button className="mt-4" onClick={handleSaveHr} disabled={savingHr}>{savingHr ? "Saving..." : "Save Settings"}</Button>
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
