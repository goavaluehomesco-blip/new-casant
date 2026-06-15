"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

interface NavigationProps {
  variant?: "light" | "dark"
  logoUrl?: string | null
}

export function Navigation({ variant = "light", logoUrl }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/inventory", label: "Inventory" },
    { href: "/weddings", label: "Weddings" },
    { href: "/corporate", label: "Corporate" },
    { href: "/about", label: "About Us" },
  ]

  const getTextColor = () => {
    if (isScrolled) return "text-foreground"
    return variant === "dark" ? "text-foreground" : "text-white"
  }

  const getMobileIconColor = () => {
    if (isScrolled) return "text-foreground"
    return variant === "dark" ? "text-foreground" : "text-white"
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-6">
        {/* Desktop: 3-column grid — left links | centered logo | right links */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Left: Inventory + Weddings — right-aligned toward logo */}
          <div className="flex items-center justify-end gap-6 pr-6">
            {[{ href: "/inventory", label: "Inventory" }, { href: "/weddings", label: "Weddings" }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-primary relative group ${getTextColor()}`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center px-6">
            <Link href="/" aria-label="Casant Events Home">
              {logoUrl ? (
                <Image src={logoUrl} alt="Casant Events" width={96} height={96} className="h-24 w-auto object-contain" priority />
              ) : (
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary font-bold text-primary-foreground text-base tracking-tight select-none">
                  CE
                </div>
              )}
            </Link>
          </div>

          {/* Right: Corporate + About Us — left-aligned toward logo */}
          <div className="flex items-center justify-start gap-6 pl-6">
            {[{ href: "/corporate", label: "Corporate" }, { href: "/about", label: "About Us" }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-primary relative group ${getTextColor()}`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile: logo left, hamburger right */}
        <div className="flex md:hidden items-center justify-between">
          <Link href="/" aria-label="Casant Events Home">
            {logoUrl ? (
              <Image src={logoUrl} alt="Casant Events" width={40} height={40} className="h-10 w-auto object-contain" priority />
            ) : (
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary font-bold text-primary-foreground text-sm tracking-tight">
                CE
              </div>
            )}
          </Link>
          <button
            className={`transition-colors ${getMobileIconColor()}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-6 pb-6 animate-fade-in">
            <div className="flex flex-col gap-4 bg-background/95 backdrop-blur-md rounded-xl p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
