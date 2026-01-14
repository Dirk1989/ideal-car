"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SiteBrand() {
  const [site, setSite] = useState<{ siteName: string; tagline?: string } | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/site')
        if (res.ok) {
          const data = await res.json()
          if (mounted) setSite(data)
        }
      } catch (e) {
        // ignore
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <Link href="/" className="flex items-center group">
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight">
          <span className="text-gray-900">Ideal</span>
          <span className="text-blue-600">Car</span>
        </span>
        <span className="text-xs text-gray-500 -mt-1">{site?.tagline || 'Car Marketplace'}</span>
      </div>
    </Link>
  )
}
