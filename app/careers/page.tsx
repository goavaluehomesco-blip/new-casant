import { NavigationWrapper } from "@/components/navigation-wrapper"
import { Footer } from "@/components/footer"
import { getActiveJobPostings, getHrInfo, getCompanyInfo } from "@/lib/data/queries"
import { MapPin, Clock, Briefcase, Mail, Phone } from "lucide-react"

export const metadata = {
  title: "Careers | Casant Events",
  description: "Join the Casant Events team. Explore open positions and be part of creating extraordinary events.",
}

export default async function CareersPage() {
  const [jobs, hrInfo, companyInfo, navigation] = await Promise.all([
    getActiveJobPostings(),
    getHrInfo(),
    getCompanyInfo(),
    NavigationWrapper({ variant: "light" }),
  ])

  const heading = hrInfo?.heading || "Join Our Team"
  const subheading = hrInfo?.subheading || "Be part of something extraordinary"
  const description = hrInfo?.description || "We are always looking for passionate, talented individuals to join the Casant Events family."

  return (
    <div className="min-h-screen bg-background">
      {navigation}

      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-foreground">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">We're Hiring</p>
          <h1 className="text-5xl md:text-6xl font-bold text-background mb-6 text-balance">{heading}</h1>
          <p className="text-lg text-background/70 leading-relaxed">{subheading}</p>
        </div>
      </section>

      {/* About section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">Why Casant Events</p>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Build a Career in Live Events
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
            </div>

            {/* HR Contact Card */}
            <div className="bg-background rounded-2xl border border-border p-8 shadow-lg">
              {hrInfo?.hr_image_url && (
                <img src={hrInfo.hr_image_url} alt={hrInfo.hr_name || "HR"} className="w-16 h-16 rounded-full object-cover mb-4" />
              )}
              <h3 className="font-bold text-foreground text-lg mb-1">{hrInfo?.hr_name || "HR Department"}</h3>
              <p className="text-muted-foreground text-sm mb-5">{companyInfo?.name || "Casant Events"}</p>
              <div className="space-y-3">
                {hrInfo?.hr_email && (
                  <a href={`mailto:${hrInfo.hr_email}`} className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
                    <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </span>
                    {hrInfo.hr_email}
                  </a>
                )}
                {hrInfo?.hr_phone && (
                  <a href={`tel:${hrInfo.hr_phone}`} className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
                    <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-primary" />
                    </span>
                    {hrInfo.hr_phone}
                  </a>
                )}
                {!hrInfo?.hr_email && !hrInfo?.hr_phone && (
                  <p className="text-muted-foreground text-sm">Contact us to inquire about open positions.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">Open Positions</p>
            <h2 className="text-4xl font-bold text-foreground">Current Openings</h2>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-20 bg-secondary/30 rounded-2xl">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Open Positions</h3>
              <p className="text-muted-foreground">There are no openings at the moment. Check back soon or reach out to HR directly.</p>
            </div>
          ) : (
            <div className="grid gap-5">
              {jobs.map((job) => {
                const requirements = job.requirements
                  ? job.requirements.split("\n").filter(Boolean)
                  : []

                return (
                  <details
                    key={job.id}
                    className="group bg-background border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <summary className="flex items-center gap-4 p-6 cursor-pointer list-none">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-lg">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 mt-1.5 text-sm text-muted-foreground">
                          {job.department && <span>{job.department}</span>}
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />{job.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />{job.job_type}
                          </span>
                        </div>
                      </div>
                      <div className="text-muted-foreground group-open:rotate-180 transition-transform duration-200 flex-shrink-0">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </summary>

                    <div className="px-6 pb-6 border-t border-border pt-5">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">About the Role</h4>
                          <p className="text-muted-foreground leading-relaxed text-sm">{job.description}</p>
                        </div>
                        {requirements.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Requirements</h4>
                            <ul className="space-y-2">
                              {requirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      {hrInfo?.hr_email && (
                        <div className="mt-6 pt-5 border-t border-border">
                          <a
                            href={`mailto:${hrInfo.hr_email}?subject=Application: ${job.title}`}
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                          >
                            <Mail className="w-4 h-4" />
                            Apply for this role
                          </a>
                        </div>
                      )}
                    </div>
                  </details>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
