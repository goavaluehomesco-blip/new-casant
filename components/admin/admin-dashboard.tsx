"use client"

import {
  ImageIcon,
  Package,
  Users,
  MessageSquare,
  Settings,
  Home,
  Lightbulb,
  Building2,
  Heart,
  ChevronRight,
  Mail,
  Layers,
  Quote,
  Instagram,
  Briefcase,
  Images,
} from "lucide-react"
import Link from "next/link"

interface AdminDashboardProps {
  user: {
    id: string
    email: string
    full_name: string | null
    role: string
  }
  stats: {
    unreadContacts: number
    totalProjects: number
    totalInventory: number
  }
  recentContacts: Array<{
    id: string
    name: string
    email: string
    event_type: string | null
    created_at: string
    is_read: boolean
  }>
}

const contentLinks = [
  { icon: Home, label: "Hero Section", href: "/admin/hero", desc: "Slides & CTAs" },
  { icon: Layers, label: "Services", href: "/admin/services", desc: "Service cards" },
  { icon: Heart, label: "Weddings", href: "/admin/weddings", desc: "Portfolio gallery" },
  { icon: Building2, label: "Corporate", href: "/admin/corporate", desc: "Portfolio gallery" },
  { icon: Images, label: "Gallery", href: "/admin/gallery", desc: "All media" },
  { icon: Quote, label: "Testimonials", href: "/admin/testimonials", desc: "Client reviews" },
  { icon: Instagram, label: "Instagram", href: "/admin/instagram", desc: "Feed posts" },
  { icon: Package, label: "Inventory", href: "/admin/inventory", desc: "Equipment" },
  { icon: Users, label: "Team", href: "/admin/team", desc: "Members" },
  { icon: Briefcase, label: "Careers / HR", href: "/admin/hr", desc: "Job postings" },
  { icon: Settings, label: "Settings", href: "/admin/settings", desc: "Company info" },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function AdminDashboard({ user, stats, recentContacts }: AdminDashboardProps) {
  const firstName = user.full_name?.split(" ")[0] || "Admin"

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Top header */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 border-b border-white/[0.06] bg-[#0f0f0f]/80 backdrop-blur-md">
        <div>
          <h1 className="text-sm font-semibold text-white/90">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          {stats.unreadContacts > 0 && (
            <Link href="/admin/contacts">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors">
                <Mail className="w-3 h-3" />
                {stats.unreadContacts} new
              </div>
            </Link>
          )}
          <Link
            href="/"
            target="_blank"
            className="px-2.5 py-1 rounded-md border border-white/10 text-white/50 text-xs font-medium hover:text-white/80 hover:border-white/20 transition-colors"
          >
            View site
          </Link>
        </div>
      </header>

      <main className="px-6 py-8 max-w-6xl mx-auto">
        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white/90">Good to see you, {firstName}</h2>
          <p className="text-sm text-white/40 mt-0.5">Here&apos;s what&apos;s happening with Casant Events.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Link href="/admin/contacts">
            <div className="group p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all">
              <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2">Unread Messages</p>
              <p className="text-3xl font-semibold text-white tabular-nums">{stats.unreadContacts}</p>
              <p className="text-xs text-white/30 mt-1">Contact submissions</p>
            </div>
          </Link>
          <Link href="/admin/gallery">
            <div className="group p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all">
              <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2">Gallery Projects</p>
              <p className="text-3xl font-semibold text-white tabular-nums">{stats.totalProjects}</p>
              <p className="text-xs text-white/30 mt-1">Weddings &amp; Corporate</p>
            </div>
          </Link>
          <Link href="/admin/inventory">
            <div className="group p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all">
              <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2">Inventory Items</p>
              <p className="text-3xl font-semibold text-white tabular-nums">{stats.totalInventory}</p>
              <p className="text-xs text-white/30 mt-1">Equipment &amp; Production</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content sections — takes 2 cols */}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Content Sections</p>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden divide-y divide-white/[0.04]">
              {contentLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-md bg-white/[0.05] flex items-center justify-center shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{item.label}</p>
                    <p className="text-xs text-white/30">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent messages — 1 col */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">Recent Messages</p>
              <Link href="/admin/contacts" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                View all
              </Link>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden divide-y divide-white/[0.04]">
              {recentContacts.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Mail className="w-6 h-6 text-white/20 mx-auto mb-2" />
                  <p className="text-sm text-white/30">No messages yet</p>
                </div>
              ) : (
                recentContacts.map((contact) => (
                  <Link
                    key={contact.id}
                    href="/admin/contacts"
                    className="flex flex-col gap-0.5 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-medium truncate ${contact.is_read ? "text-white/60" : "text-white/90"}`}>
                        {contact.name}
                      </span>
                      {!contact.is_read && (
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400" />
                      )}
                    </div>
                    <p className="text-xs text-white/30 truncate">{contact.email}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      {contact.event_type && (
                        <span className="text-[10px] text-white/30 bg-white/[0.06] px-1.5 py-0.5 rounded">
                          {contact.event_type}
                        </span>
                      )}
                      <span className="text-[10px] text-white/25 ml-auto">{timeAgo(contact.created_at)}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
