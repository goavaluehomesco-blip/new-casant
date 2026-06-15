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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AdminSidebarProps {
  user: {
    email: string
    full_name: string | null
  }
  unreadCount?: number
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Home, label: "Hero Section", href: "/admin/hero" },
  { icon: Layers, label: "Services", href: "/admin/services" },
  { icon: Heart, label: "Weddings", href: "/admin/weddings" },
  { icon: Building2, label: "Corporate Events", href: "/admin/corporate" },
  { icon: Images, label: "Gallery / Portfolio", href: "/admin/gallery" },
  { icon: Package, label: "Inventory", href: "/admin/inventory" },
  { icon: Users, label: "Team", href: "/admin/team" },
  { icon: Quote, label: "Testimonials", href: "/admin/testimonials" },
  { icon: Instagram, label: "Instagram", href: "/admin/instagram" },
  { icon: Briefcase, label: "Careers / HR", href: "/admin/hr" },
  { icon: MessageSquare, label: "Contact Submissions", href: "/admin/contacts", badge: true },
  { icon: DatabaseZap, label: "Database Monitor", href: "/admin/database" },
  { icon: Settings, label: "Company Settings", href: "/admin/settings" },
]

export default function AdminSidebar({ unreadCount = 0 }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CE</span>
            </div>
            <span className="text-white font-semibold">Casant Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Website</span>
          </Link>

          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.href) ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge && unreadCount > 0 && <Badge className="ml-auto bg-red-500 text-white">{unreadCount}</Badge>}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
