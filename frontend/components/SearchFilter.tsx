// components/SearchFilter.tsx - compact search + dropdown filters
'use client'

import { Search, Filter, Calendar, Fuel } from 'lucide-react'
import React, { useState } from 'react'

type Filters = {
  search?: string
  brand?: string
  priceMin?: number
  priceMax?: number
  yearFrom?: number | null
  yearTo?: number | null
  transmission?: 'Any' | 'Manual' | 'Automatic'
  fuels?: string[]
}

interface Props {
  onFilter?: (f: Filters) => void
}

const SearchFilter: React.FC<Props> = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [brand, setBrand] = useState('')
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(500000)
  const [yearFrom, setYearFrom] = useState<number | ''>('')
  const [yearTo, setYearTo] = useState<number | ''>('')
  const [transmission, setTransmission] = useState<'Any'|'Manual'|'Automatic'>('Any')
  const [fuels, setFuels] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)
  const fuelOptions = ['Petrol', 'Diesel', 'Electric', 'Hybrid']

  const formatPrice = (p: number) => {
    return `R${p.toLocaleString()}`
  }

  const toggleFuel = (f: string) => {
    setFuels(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  const apply = () => {
    const filters: Filters = {
      search: searchTerm || undefined,
      brand: brand || undefined,
      priceMin: priceMin || undefined,
      priceMax: priceMax || undefined,
      yearFrom: yearFrom === '' ? null : Number(yearFrom),
      yearTo: yearTo === '' ? null : Number(yearTo),
      transmission,
      fuels: fuels.length ? fuels : undefined,
    }
    onFilter?.(filters)
    setOpen(false)
  }

  const clear = () => {
    setSearchTerm('')
    setBrand('')
    setPriceMin(0)
    setPriceMax(500000)
    setYearFrom('')
    setYearTo('')
    setTransmission('Any')
    setFuels([])
    onFilter?.({})
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search make, model, features or location"
            className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none"
            onKeyDown={(e) => { if (e.key === 'Enter') apply() }}
          />
        </div>

        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md"
          aria-expanded={open}
        >
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-700">Filters</span>
        </button>

        <button onClick={apply} className="ml-2 btn-primary px-5 py-2 rounded-full">
          Search
        </button>
      </div>

      {open && (
        <div className="mt-3 bg-white border border-gray-100 rounded-xl shadow-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Brand (type)</label>
              <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Toyota" className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Transmission</label>
              <div className="mt-2 flex gap-2">
                {(['Any','Manual','Automatic'] as const).map(t => (
                  <button key={t} onClick={() => setTransmission(t)} className={`px-3 py-2 rounded-lg border ${transmission===t? 'bg-blue-600 text-white border-transparent' : 'bg-white'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Price Min</label>
              <input type="range" min={0} max={2000000} step={10000} value={priceMin} onChange={(e) => setPriceMin(Number(e.target.value))} className="mt-4 w-full" />
              <div className="text-sm text-gray-600 mt-2">{formatPrice(priceMin)}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Price Max</label>
              <input type="range" min={0} max={2000000} step={10000} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="mt-4 w-full" />
              <div className="text-sm text-gray-600 mt-2">{formatPrice(priceMax)}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Year From</label>
              <select value={yearFrom as any} onChange={(e) => setYearFrom(e.target.value ? Number(e.target.value) : '')} className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                <option value="">Any</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Year To</label>
              <select value={yearTo as any} onChange={(e) => setYearTo(e.target.value ? Number(e.target.value) : '')} className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                <option value="">Any</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Fuel Types</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {fuelOptions.map(f => (
                  <button key={f} onClick={() => toggleFuel(f)} className={`px-3 py-2 rounded-lg border ${fuels.includes(f) ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button onClick={clear} className="px-4 py-2 rounded-lg border border-gray-200 bg-white">Clear</button>
            <button onClick={apply} className="px-4 py-2 rounded-lg btn-primary">Apply</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchFilter