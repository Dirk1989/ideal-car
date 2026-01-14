// page.tsx
import HeroSection from '@/components/home/HeroSection'
import FeaturedCars from '@/components/home/FeaturedCars'
import BlogSection from '@/components/home/BlogSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import CtaSection from '@/components/home/CtaSection'

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