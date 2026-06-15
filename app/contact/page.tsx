import { NavigationWrapper } from "@/components/navigation-wrapper"
import { Footer } from "@/components/footer"
import { Contact } from "@/components/contact"
import { getCompanyInfo } from "@/lib/data/queries"

export const metadata = {
  title: "Contact Us - Casant Events",
  description: "Get in touch with Casant Events for your next event",
}

export default async function ContactPage() {
  const [companyInfo, navigation] = await Promise.all([
    getCompanyInfo(),
    NavigationWrapper({ variant: "dark" }),
  ])

  return (
    <main className="min-h-screen">
      {navigation}
      <div className="pt-32 pb-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-primary font-medium tracking-wide text-sm uppercase">Get In Touch</span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">Contact Us</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ready to create an unforgettable event? We'd love to hear from you. Reach out today and let's start
              planning.
            </p>
          </div>
        </div>
      </div>
      <Contact companyInfo={companyInfo} />
      <Footer />
    </main>
  )
}
