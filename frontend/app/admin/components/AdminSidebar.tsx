"use client"

import { 
  BarChart3, Car, Users, FileText, Settings, LogOut, Search, X
} from 'lucide-react'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

export default function AdminSidebar({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  onLogout,
}: AdminSidebarProps) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'cars', label: 'Car Listings', icon: <Car className="h-5 w-5" /> },
    { id: 'dealers', label: 'Dealers', icon: <Users className="h-5 w-5" /> },
    { id: 'blogs', label: 'Blog Posts', icon: <FileText className="h-5 w-5" /> },
    { id: 'leads', label: 'Sale Leads', icon: <Users className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ]

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-40 md:relative md:translate-x-0 md:top-auto md:h-auto pt-16 md:pt-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <nav className="p-4 h-[calc(100vh-theme(spacing.16))] md:h-[calc(100vh-73px)] flex flex-col overflow-y-auto">
          {/* Search */}
          <div className="mb-6 md:mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Navigation items */}
          <div className="space-y-1 flex-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm md:text-base">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm md:text-base"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  )
}
