// components/Analytics.tsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { pageview } from '@/lib/analytics'

export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      pageview(pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''))
    }
  }, [pathname, searchParams])

  return null
}
