"use client"

import { useEffect, useState, useRef, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react"
import { submitContactForm } from "@/lib/data/actions"
import type { CompanyInfo } from "@/lib/data/types"

interface ContactProps {
  companyInfo?: CompanyInfo | null
}

export function Contact({ companyInfo }: ContactProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const sectionRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

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

  const email = companyInfo?.email || "info@casantevents.com"
  const phone = companyInfo?.phone || "+91 98765 43210"
  const address = companyInfo?.address || "123 Event Plaza, Andheri West\nMumbai, Maharashtra 400053"

  const WHATSAPP_NUMBER = "919823291463"

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const eventType = formData.get("eventType") as string
    const message = formData.get("message") as string

    startTransition(async () => {
      const result = await submitContactForm(formData)
      if (result.success) {
        setIsSubmitted(true)
        formRef.current?.reset()
        setTimeout(() => setIsSubmitted(false), 5000)

        // Open WhatsApp with pre-filled message
        const text = [
          `Hi Casant Events! I'd like to get in touch.`,
          ``,
          `Name: ${name}`,
          `Email: ${email}`,
          phone ? `Phone: ${phone}` : null,
          eventType ? `Event Type: ${eventType}` : null,
          message ? `Message: ${message}` : null,
        ]
          .filter(Boolean)
          .join("\n")

        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
        window.open(waUrl, "_blank", "noopener,noreferrer")
      } else {
        setError(result.error || "An error occurred")
      }
    })
  }

  return (
    <section ref={sectionRef} id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-primary font-medium tracking-wide text-sm uppercase">Get In Touch</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">Let's Create Something Amazing</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Ready to bring your vision to life? Get in touch with our team to start planning your unforgettable event.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Card
            className={`p-8 border-0 shadow-xl transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h3>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h4 className="text-xl font-bold text-foreground mb-2">Message Sent!</h4>
                <p className="text-muted-foreground">We'll get back to you soon.</p>
              </div>
            ) : (
              <form ref={formRef} action={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Your Name *</label>
                  <Input name="name" placeholder="John Doe" className="bg-secondary/50 border-0" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="bg-secondary/50 border-0"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
                  <Input name="phone" type="tel" placeholder="+91 98765 43210" className="bg-secondary/50 border-0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Event Type</label>
                  <Input name="eventType" placeholder="Wedding, Corporate, etc." className="bg-secondary/50 border-0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                  <Textarea
                    name="message"
                    placeholder="Tell us about your event..."
                    rows={4}
                    className="bg-secondary/50 border-0"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button className="w-full rounded-full" size="lg" disabled={isPending}>
                  {isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </Card>

          <div
            className={`space-y-6 transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <Card className="p-8 border-0 shadow-xl">
              <h3 className="text-2xl font-bold text-foreground mb-6">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Email</div>
                    <a href={`mailto:${email}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Phone</div>
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Address</div>
                    <div className="text-muted-foreground whitespace-pre-line">{address}</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-primary text-primary-foreground border-0">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6" />
                <h4 className="text-xl font-bold">Office Hours</h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-foreground/80">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-foreground/80">Saturday</span>
                  <span className="font-medium">10:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-foreground/80">Sunday</span>
                  <span className="font-medium">By Appointment</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
