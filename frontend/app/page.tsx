// page.tsx
import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import FeaturedCars from '@/components/home/FeaturedCars'
import BlogSection from '@/components/home/BlogSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import CtaSection from '@/components/home/CtaSection'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://idealcar.co.za',
  },
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedCars />
      <FeaturesSection />
      <BlogSection />
      <CtaSection />
    </>
  )
}