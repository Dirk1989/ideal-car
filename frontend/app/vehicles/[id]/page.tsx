import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import VehicleClient from './VehicleClient'
import { parseVehicleSlug, generateVehicleSlug } from '@/lib/slugify'

interface Vehicle {
  id: number
  title: string
  price: number
  year: number
  mileage: number
  image: string
  images?: string[]
  fuelType: string
  transmission: string
  color?: string
  location: string
  isFeatured: boolean
  features: string[]
  description?: string
  make?: string
  model?: string
  bodyType?: string
  engine?: string
  condition?: string
  owners?: number
  vin?: string
  sellerName?: string
  sellerPhone?: string
  sellerEmail?: string
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  let vehicle: Vehicle | null = null
  
  try {
    const dataFile = path.join(process.cwd(), 'data', 'vehicles.json')
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf8')
      const vehicles: Vehicle[] = JSON.parse(raw || '[]')
      
      // Parse slug to get vehicle ID
      const parsed = parseVehicleSlug(params.id)
      if (parsed) {
        vehicle = vehicles.find((v) => v.id === parsed.id) || null
      }
    }
  } catch (e) {
    console.error('Failed to read vehicle', e)
  }

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found',
    }
  }

  const vehicleImage = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : vehicle.image || '/placeholder.jpg'
  const fullImageUrl = vehicleImage.startsWith('http') ? vehicleImage : `https://idealcar.co.za${vehicleImage}`
  
  return {
    title: `${vehicle.title} - ${vehicle.year} | IdealCar`,
    description: `${vehicle.year} ${vehicle.title} for sale in ${vehicle.location}. ${vehicle.mileage.toLocaleString()} km, ${vehicle.fuelType}, ${vehicle.transmission}. Price: R${vehicle.price.toLocaleString()}`,
    keywords: `${vehicle.title}, ${vehicle.year}, ${vehicle.location}, used car, car for sale, South Africa`,
    openGraph: {
      title: `${vehicle.title} - ${vehicle.year}`,
      description: `R${vehicle.price.toLocaleString()} | ${vehicle.mileage.toLocaleString()} km | ${vehicle.fuelType} | ${vehicle.transmission} | ${vehicle.location}`,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: `${vehicle.year} ${vehicle.title}`,
        }
      ],
      type: 'website',
      siteName: 'IdealCar',
      locale: 'en_ZA',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${vehicle.title} - ${vehicle.year}`,
      description: `R${vehicle.price.toLocaleString()} | ${vehicle.location}`,
      images: [fullImageUrl],
    },
  }
}

export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  let vehicle: Vehicle | null = null
  
  try {
    const dataFile = path.join(process.cwd(), 'data', 'vehicles.json')
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf8')
      const vehicles: Vehicle[] = JSON.parse(raw || '[]')
      
      // Parse slug to get vehicle ID
      const parsed = parseVehicleSlug(params.id)
      if (parsed) {
        vehicle = vehicles.find((v) => v.id === parsed.id) || null
      }
    }
  } catch (e) {
    console.error('Failed to read vehicle', e)
  }

  if (!vehicle) {
    notFound()
  }

  return <VehicleClient vehicle={vehicle} />
}

export async function generateStaticParams() {
  try {
    const dataFile = path.join(process.cwd(), 'data', 'vehicles.json')
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf8')
      const vehicles = JSON.parse(raw || '[]')
      return vehicles.map((vehicle: any) => ({
        id: generateVehicleSlug(vehicle),
      }))
    }
  } catch (e) {
    console.error('Failed to generate vehicle params', e)
  }
  return []
}
