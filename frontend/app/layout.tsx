// app/layout.tsx - UPDATE METADATA ONLY
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import Analytics from '@/components/Analytics'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://idealcar.co.za'),
  title: {
    default: 'IdealCar | Cars for sale in South Africa',
    template: '%s | IdealCar'
  },
  description: 'Browse the best selection of new and used cars for sale in South Africa. Find reliable cars on IdealCar.',
  keywords: 'cars Gauteng, used cars Johannesburg, car listings South Africa, second hand cars, vehicle marketplace, car ads, cars Pretoria, buy car online, sell car gauteng, car inspection services',
  authors: [{ name: 'IdealCar' }],
  creator: 'IdealCar',
  publisher: 'IdealCar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'IdealCar | Cars for sale in South Africa',
    description: 'Browse the best selection of new and used cars for sale in South Africa. Find reliable cars on IdealCar.',
    url: 'https://idealcar.co.za',
    siteName: 'IdealCar',
    locale: 'en_ZA',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'IdealCar Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'IdealCar | Cars for sale in South Africa',
    description: 'Browse the best selection of new and used cars for sale in South Africa. Find reliable cars on IdealCar.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IdealCar',
    description: 'Premier car marketplace and vehicle inspection services in Gauteng, South Africa',
    url: 'https://idealcar.co.za',
    logo: 'https://idealcar.co.za/logo.png',
    sameAs: [
      'https://www.facebook.com/idealcar',
      'https://twitter.com/idealcar',
      'https://www.instagram.com/idealcar',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+27-11-234-5678',
      contactType: 'Customer Service',
      areaServed: 'ZA',
      availableLanguage: ['English'],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Johannesburg',
      addressRegion: 'Gauteng',
      addressCountry: 'ZA',
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: -26.2041,
        longitude: 28.0473,
      },
      geoRadius: '50000',
    },
  }

  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 overflow-x-hidden w-full max-w-full`}>
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
          <Header />
          <main className="flex-grow w-full max-w-full">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </body>
    </html>
  )
}