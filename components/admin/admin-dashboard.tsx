"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  ImageIcon,
  Package,
  Users,
  MessageSquare,
  Settings,
  Menu,
  Home,
  Lightbulb,
  Building2,
  Heart,
  ChevronRight,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"

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

export default function AdminDashboard({ user, stats, recentContacts }: AdminDashboardProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {stats.unreadContacts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {stats.unreadContacts}
                </span>
              )}
            </Button>
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm">
                View Website
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Unread Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.unreadContacts}</div>
              <p className="text-xs opacity-75 mt-1">New contact submissions</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Gallery Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs opacity-75 mt-1">Weddings & Corporate</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalInventory}</div>
              <p className="text-xs opacity-75 mt-1">Lights, Sound & Production</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/admin/weddings/new"
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-600" />
                  </div>
                  <span className="font-medium">Add Wedding Project</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </Link>
              <Link
                href="/admin/corporate/new"
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium">Add Corporate Event</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </Link>
              <Link
                href="/admin/inventory/new"
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="font-medium">Add Inventory Item</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </Link>
            </CardContent>
          </Card>

          {/* Recent contacts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Messages</CardTitle>
              <Link href="/admin/contacts">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentContacts.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No contact submissions yet</p>
              ) : (
                <div className="space-y-3">
                  {recentContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-3 rounded-lg ${
                        contact.is_read ? "bg-slate-50" : "bg-blue-50 border border-blue-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{contact.name}</span>
                        {!contact.is_read && <Badge className="bg-blue-500 text-white text-[10px]">New</Badge>}
                      </div>
                      <p className="text-xs text-slate-500">{contact.email}</p>
                      {contact.event_type && (
                        <span className="inline-block mt-1 text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                          {contact.event_type}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Content management sections */}
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Content Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Home, label: "Hero Section", href: "/admin/hero", bg: "#dbeafe", color: "#2563eb" },
            { icon: Heart, label: "Weddings Gallery", href: "/admin/weddings", bg: "#fce7f3", color: "#db2777" },
            { icon: Building2, label: "Corporate Gallery", href: "/admin/corporate", bg: "#e0e7ff", color: "#4f46e5" },
            { icon: Package, label: "Inventory", href: "/admin/inventory", bg: "#fef3c7", color: "#d97706" },
            { icon: Users, label: "Team Members", href: "/admin/team", bg: "#dcfce7", color: "#16a34a" },
            { icon: Settings, label: "Company Info", href: "/admin/settings", bg: "#f1f5f9", color: "#475569" },
            { icon: ImageIcon, label: "Media Library", href: "/admin/media", bg: "#f3e8ff", color: "#9333ea" },
            { icon: MessageSquare, label: "Messages", href: "/admin/contacts", bg: "#fee2e2", color: "#dc2626" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: item.bg }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500">Manage content</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
