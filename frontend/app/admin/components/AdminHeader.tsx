"use client"

import { Bell, Menu, LogOut } from 'lucide-react'
import { useState } from 'react'

interface AdminHeaderProps {
  onMenuClick?: () => void
  onLogout?: () => void
  siteName?: string
}

export default function AdminHeader({ onMenuClick, onLogout, siteName }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Menu button + branding */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold whitespace-nowrap truncate">
                <span className="text-gray-900">Ideal</span>
                <span className="text-blue-600">Car</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Dashboard</p>
            </div>
          </div>

          {/* Right: Notifications + Profile */}
          <div className="flex items-center gap-3 md:gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-3 md:pl-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-blue-600 text-sm">A</span>
              </div>
              <div className="hidden md:block">
                <p className="font-medium text-sm">Admin</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
