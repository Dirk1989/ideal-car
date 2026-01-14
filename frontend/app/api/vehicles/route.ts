import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'vehicles.json')
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Image compression settings
const IMAGE_QUALITY = 80 // JPEG quality (1-100)
const MAX_WIDTH = 1920
const MAX_HEIGHT = 1080

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]')
}

async function compressImage(buffer: Buffer, filename: string): Promise<string> {
  try {
    const outputPath = path.join(UPLOAD_DIR, filename)
    
    await sharp(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: IMAGE_QUALITY, mozjpeg: true })
      .toFile(outputPath)
    
    return `/uploads/${filename}`
  } catch (error) {
    console.error('Image compression error:', error)
    // Fallback: save original if compression fails
    const outputPath = path.join(UPLOAD_DIR, filename)
    fs.writeFileSync(outputPath, buffer)
    return `/uploads/${filename}`
  }
}

export async function GET() {
  ensureStorage()
  const raw = fs.readFileSync(DATA_FILE, 'utf8')
  try {
    const data = JSON.parse(raw)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  ensureStorage()
  const body = await req.json()

  const id = Date.now()
  let imagePath = body.image || ''
  const images: string[] = []

  // support multiple images sent as base64 strings in body.imagesBase64 (array)
  if (Array.isArray(body.imagesBase64) && body.imagesBase64.length > 0) {
    const items = body.imagesBase64.slice(0, 10) // limit to 10
    
    // Process images with compression
    for (let idx = 0; idx < items.length; idx++) {
      const imgBase64 = items[idx]
      const matches = imgBase64.match(/^data:(.+);base64,(.+)$/)
      let b64 = imgBase64
      
      if (matches) {
        b64 = matches[2]
      }
      
      const buffer = Buffer.from(b64, 'base64')
      const filename = `${id}-${idx}.jpg` // Always save as JPEG for consistency
      
      // Compress and save image
      const savedPath = await compressImage(buffer, filename)
      images.push(savedPath)
    }
    
    imagePath = images[0] || ''
  } else if (body.imageBase64) {
    const matches = body.imageBase64.match(/^data:(.+);base64,(.+)$/)
    let b64 = body.imageBase64
    
    if (matches) {
      b64 = matches[2]
    }
    
    const buffer = Buffer.from(b64, 'base64')
    const filename = `${id}.jpg`
    
    // Compress and save image
    imagePath = await compressImage(buffer, filename)
    images.push(imagePath)
  }

  const vehicle = {
    id,
    title: body.title || 'Untitled',
    price: Number(body.price) || 0,
    image: imagePath,
    images,
    year: Number(body.year) || 0,
    mileage: Number(body.mileage) || 0,
    fuelType: body.fuelType || '',
    transmission: body.transmission || '',
    color: body.color || '',
    features: Array.isArray(body.features) ? body.features : [],
    location: body.location || '',
    isFeatured: Boolean(body.isFeatured),
    status: 'active',
    views: 0,
    dealerId: body.dealerId || null,
    createdAt: new Date().toISOString(),
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf8')
  const arr = JSON.parse(raw || '[]')
  arr.unshift(vehicle)
  fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2))

  return NextResponse.json(vehicle, { status: 201 })
}

export async function PUT(req: Request) {
  ensureStorage()
  try {
    const body = await req.json()
    const id = Number(body.id)
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const arr = JSON.parse(raw || '[]')
    const idx = arr.findIndex((v: any) => Number(v.id) === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const existing = arr[idx]
    let imagePath = existing.image
    let images: string[] = existing.images || []

    // Handle new images if provided with compression
    if (Array.isArray(body.imagesBase64) && body.imagesBase64.length > 0) {
      const items = body.imagesBase64.slice(0, 10)
      images = []
      
      for (let idx = 0; idx < items.length; idx++) {
        const imgBase64 = items[idx]
        const matches = imgBase64.match(/^data:(.+);base64,(.+)$/)
        let b64 = imgBase64
        
        if (matches) {
          b64 = matches[2]
        }
        
        const buffer = Buffer.from(b64, 'base64')
        const filename = `${id}-${Date.now()}-${idx}.jpg`
        
        // Compress and save image
        const savedPath = await compressImage(buffer, filename)
        images.push(savedPath)
      }
      
      imagePath = images[0] || ''
    }

    // Update vehicle
    const updated = {
      ...existing,
      title: body.title !== undefined ? body.title : existing.title,
      price: body.price !== undefined ? Number(body.price) : existing.price,
      year: body.year !== undefined ? Number(body.year) : existing.year,
      mileage: body.mileage !== undefined ? Number(body.mileage) : existing.mileage,
      fuelType: body.fuelType !== undefined ? body.fuelType : existing.fuelType,
      transmission: body.transmission !== undefined ? body.transmission : existing.transmission,
      color: body.color !== undefined ? body.color : existing.color,
      features: body.features !== undefined ? (Array.isArray(body.features) ? body.features : []) : existing.features,
      location: body.location !== undefined ? body.location : existing.location,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
      dealerId: body.dealerId !== undefined ? body.dealerId : existing.dealerId,
      image: imagePath,
      images,
    }

    arr[idx] = updated
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2))
    return NextResponse.json(updated, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  ensureStorage()
  try {
    const body = await req.json()
    const id = Number(body.id)
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const arr = JSON.parse(raw || '[]')
    const idx = arr.findIndex((v: any) => Number(v.id) === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const [removed] = arr.splice(idx, 1)
    // remove uploaded files referenced in removed.images
    if (Array.isArray(removed.images)) {
      removed.images.forEach((p: string) => {
        try {
          const filename = path.basename(p)
          const fp = path.join(UPLOAD_DIR, filename)
          if (fs.existsSync(fp)) fs.unlinkSync(fp)
        } catch (e) {
          console.error('Failed to remove file', p, e)
        }
      })
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2))
    return NextResponse.json({ id }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
