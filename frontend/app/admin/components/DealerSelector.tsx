"use client"

import { useState, useRef, useEffect } from 'react'

interface Dealer {
  id: number
  name: string
  owner: string
  phone: string
  email: string
  address: string
}

interface DealerSelectorProps {
  dealers: Dealer[]
  selectedDealer: number | null
  dealerSearchTerm: string
  onDealerSearchChange: (term: string) => void
  onSelectDealer: (dealerId: number) => void
  onClear: () => void
}

export default function DealerSelector({
  dealers,
  selectedDealer,
  dealerSearchTerm,
  onDealerSearchChange,
  onSelectDealer,
  onClear,
}: DealerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredDealers = dealers.filter(
    (d) =>
      d.name.toLowerCase().includes(dealerSearchTerm.toLowerCase()) ||
      d.owner.toLowerCase().includes(dealerSearchTerm.toLowerCase())
  )

  const handleSelectDealer = (dealerId: number, name: string) => {
    onSelectDealer(dealerId)
    onDealerSearchChange(name)
    setIsOpen(false)
  }

  return (
    <div className="md:col-span-2 border-b pb-4 mb-4" ref={containerRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Select Dealer (Optional)
      </label>

      <div className="relative">
        <input
          type="text"
          placeholder="Search or click to see dealers..."
          value={dealerSearchTerm}
          onChange={(e) => {
            onDealerSearchChange(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full border p-2 md:p-3 rounded text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Dropdown - show list when focused, with or without search */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-b max-h-48 overflow-y-auto z-50 shadow-lg">
            {dealerSearchTerm === '' && dealers.length > 0 && !selectedDealer ? (
              // Show all dealers when no search term
              dealers.map((dealer) => (
                <button
                  key={dealer.id}
                  type="button"
                  onClick={() => handleSelectDealer(dealer.id, dealer.name)}
                  className="w-full text-left px-3 md:px-4 py-2 md:py-3 hover:bg-blue-50 border-b last:border-0 transition-colors"
                >
                  <div className="font-semibold text-gray-900 text-sm md:text-base">
                    {dealer.name}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {dealer.owner} • {dealer.phone}
                  </div>
                </button>
              ))
            ) : dealerSearchTerm && filteredDealers.length > 0 ? (
              // Show filtered dealers when search term exists
              filteredDealers.map((dealer) => (
                <button
                  key={dealer.id}
                  type="button"
                  onClick={() => handleSelectDealer(dealer.id, dealer.name)}
                  className="w-full text-left px-3 md:px-4 py-2 md:py-3 hover:bg-blue-50 border-b last:border-0 transition-colors"
                >
                  <div className="font-semibold text-gray-900 text-sm md:text-base">
                    {dealer.name}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {dealer.owner} • {dealer.phone}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 md:px-4 py-2 md:py-3 text-gray-500 text-sm">
                No dealers found
              </div>
            )}
          </div>
        )}
      </div>

      {selectedDealer && (
        <div className="mt-3 flex items-center gap-2 bg-green-50 p-3 rounded">
          <span className="text-sm text-green-600 font-semibold flex-1 truncate">
            ✓ {dealers.find((d) => d.id === selectedDealer)?.name}
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-red-600 hover:underline font-medium"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
}
