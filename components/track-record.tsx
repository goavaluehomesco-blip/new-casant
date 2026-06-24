"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { CompanyInfo } from "@/lib/data/types"

interface TrackRecordProps {
  companyInfo?: CompanyInfo | null
}

export function TrackRecord({ companyInfo }: TrackRecordProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const yearsInBusiness = new Date().getFullYear() - 1998
  const description =
    companyInfo?.about_short ||
    "Casant Events has been illuminating celebrations since 1998. With over two decades of experience, we offer tailored lighting, sound, and production services to make your event unforgettable. From weddings to corporate events, trust us to enhance your occasions with our skilled team. Contact us today!"

  const stats = [
    { value: `${companyInfo?.clients_count || 1000}+`, label: "Clients" },
    { value: `${companyInfo?.projects_count || 1000}+`, label: "Projects" },
    { value: `${companyInfo?.hotels_count || 100}+`, label: "Hotels" },
  ]

  const collageImages: string[] = Array.isArray(companyInfo?.track_record_images) && companyInfo.track_record_images.length > 0
    ? companyInfo.track_record_images
    : []

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <div
            className={`relative transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="grid grid-cols-4 gap-1 absolute inset-0">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="relative overflow-hidden bg-slate-100">
                    {collageImages[i] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={collageImages[i]}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200" />
                    )}
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-[180px] md:text-[220px] font-bold text-white drop-shadow-2xl"
                  style={{
                    textShadow: "4px 4px 0 #3b82f6, -2px -2px 0 #3b82f6",
                    WebkitTextStroke: "2px #3b82f6",
                  }}
                >
                  {yearsInBusiness}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <span className="text-primary font-medium tracking-wide text-sm uppercase">Our Track Record</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-2 leading-tight">
              Creating best Event
              <br />
              experiences since
            </h2>
            <span className="text-4xl md:text-5xl font-bold text-primary">{yearsInBusiness} years</span>

            <p className="text-muted-foreground leading-relaxed mt-6 mb-8 max-w-lg">{description}</p>

            <div className="flex gap-12 mb-8">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-primary font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            <Link href="/about">
              <Button className="rounded-full px-8 bg-primary hover:bg-primary/90">Learn More</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
