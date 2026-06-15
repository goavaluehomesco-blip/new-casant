import Link from "next/link"
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react"
import type { CompanyInfo } from "@/lib/data/types"

interface FooterProps {
  companyInfo?: CompanyInfo | null
}

export function Footer({ companyInfo }: FooterProps) {

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="px-4 py-2 border-2 border-primary rounded-lg inline-block mb-6">
              <span className="text-lg font-bold tracking-wide text-primary">CASANT EVENTS</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              {companyInfo?.tagline || "Creating unforgettable event experiences for over 25 years. Your trusted partner for weddings, corporate events, and complete production services."}
            </p>
            <div className="flex gap-4">
              {companyInfo?.social_facebook && (
                <a href={companyInfo.social_facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-background/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {companyInfo?.social_instagram && (
                <a href={companyInfo.social_instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-background/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {companyInfo?.social_youtube && (
                <a href={companyInfo.social_youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-background/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {companyInfo?.social_linkedin && (
                <a href={companyInfo.social_linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-background/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/weddings" className="text-background/70 hover:text-primary transition-colors">Wedding Events</Link></li>
              <li><Link href="/corporate" className="text-background/70 hover:text-primary transition-colors">Corporate Events</Link></li>
              <li><Link href="/inventory" className="text-background/70 hover:text-primary transition-colors">Lighting Services</Link></li>
              <li><Link href="/inventory" className="text-background/70 hover:text-primary transition-colors">Sound Systems</Link></li>
              <li><Link href="/inventory" className="text-background/70 hover:text-primary transition-colors">Production &amp; Staging</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-background/70 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-background/70 hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/weddings" className="text-background/70 hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/inventory" className="text-background/70 hover:text-primary transition-colors">Inventory</Link></li>
              <li><Link href="/#contact" className="text-background/70 hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-3 text-sm text-background/70">
              {companyInfo?.address ? (
                <li className="whitespace-pre-line">{companyInfo.address}</li>
              ) : (
                <>
                  <li>123 Event Plaza, Andheri West</li>
                  <li>Mumbai, Maharashtra 400053</li>
                </>
              )}
              {companyInfo?.phone && (
                <li className="pt-2">
                  <a href={`tel:${companyInfo.phone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">
                    {companyInfo.phone}
                  </a>
                </li>
              )}
              {companyInfo?.email && (
                <li>
                  <a href={`mailto:${companyInfo.email}`} className="hover:text-primary transition-colors">
                    {companyInfo.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
            <p>&copy; {new Date().getFullYear()} {companyInfo?.name || "Casant Events"}. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
