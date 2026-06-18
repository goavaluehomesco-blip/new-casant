"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  Users,
  MessageSquare,
  Settings,
  Menu,
  X,
  Home,
  Building2,
  Heart,
  ChevronLeft,
  Quote,
  Instagram,
  Briefcase,
  Layers,
  Images,
  DatabaseZap,
  ExternalLink,
} from "lucide-react"

interface AdminSidebarProps {
  user: {
    email: string
    full_name: string | null
  }
  unreadCount?: number
}

const navSections = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    ],
  },
  {
    label: "Content",
    items: [
      { icon: Home, label: "Hero Section", href: "/admin/hero" },
      { icon: Layers, label: "Services", href: "/admin/services" },
      { icon: Heart, label: "Weddings", href: "/admin/weddings" },
      { icon: Building2, label: "Corporate Events", href: "/admin/corporate" },
      { icon: Images, label: "Gallery", href: "/admin/gallery" },
      { icon: Quote, label: "Testimonials", href: "/admin/testimonials" },
      { icon: Instagram, label: "Instagram", href: "/admin/instagram" },
    ],
  },
  {
    label: "Operations",
    items: [
      { icon: Package, label: "Inventory", href: "/admin/inventory" },
      { icon: Users, label: "Team", href: "/admin/team" },
      { icon: Briefcase, label: "Careers / HR", href: "/admin/hr" },
      { icon: MessageSquare, label: "Messages", href: "/admin/contacts", badge: true },
    ],
  },
  {
    label: "System",
    items: [
      { icon: DatabaseZap, label: "Database", href: "/admin/database" },
      { icon: Settings, label: "Settings", href: "/admin/settings" },
    ],
  },
]

export default function AdminSidebar({ user, unreadCount = 0 }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs tracking-tight">CE</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">Casant</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-white/40 hover:text-white/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-none">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/45">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-all ${
                      active
                        ? "bg-white/[0.08] text-white"
                        : "text-white/50 hover:text-white/90 hover:bg-white/[0.04]"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-blue-400" : "text-white/40 group-hover:text-white/70"}`} />
                    <span className="flex-1 font-medium">{item.label}</span>
                    {item.badge && unreadCount > 0 && (
                      <span className="ml-auto min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 px-3 pb-4 pt-2 border-t border-white/[0.06] space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Website</span>
        </Link>
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-white/60 truncate">{user.full_name || user.email}</p>
          <p className="text-[11px] text-white/50 truncate">{user.email}</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-40 p-1.5 rounded-md bg-zinc-900 border border-white/10 text-white/60 hover:text-white transition-colors"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-56 bg-[#0a0a0a] border-r border-white/[0.06] transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
