import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Cars for Sale | IdealCar Vehicles',
  description: 'Browse thousands of cars for sale in South Africa. Search by make, model, price, and location. Find your perfect car on IdealCar.',
  keywords: 'cars for sale, car listings, buy car, vehicles, johannesburg, gauteng, pretoria',
  alternates: {
    canonical: 'https://idealcar.co.za/vehicles',
  },
  openGraph: {
    title: 'Browse Cars for Sale - IdealCar',
    description: 'Browse thousands of cars for sale in South Africa. Find your perfect car on IdealCar.',
    type: 'website',
    url: 'https://idealcar.co.za/vehicles',
  },
}

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
