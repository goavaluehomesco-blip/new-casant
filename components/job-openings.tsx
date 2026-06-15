import Link from "next/link"
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react"
import type { JobPosting } from "@/lib/data/types"

interface JobOpeningsProps {
  jobs: JobPosting[]
}

export function JobOpenings({ jobs }: JobOpeningsProps) {
  if (!jobs || jobs.length === 0) return null

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-14">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">Join Our Team</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Current Openings</h2>
          <p className="text-muted-foreground mt-4 text-lg">Be part of creating unforgettable events.</p>
        </div>

        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-background border border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-lg">{job.title}</h3>
                <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                  {job.department && <span>{job.department}</span>}
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                  )}
                  {job.job_type && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {job.job_type}
                    </span>
                  )}
                </div>
              </div>
              <Link
                href="/careers"
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity flex-shrink-0"
              >
                View Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            View All Openings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
