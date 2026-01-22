import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'vehicles.json')
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Image compression settings - optimized for web
const IMAGE_QUALITY = 75 // WebP quality (75-80 is good balance for WebP)
const MAX_WIDTH = 1600 // Reduced from 1920
const MAX_HEIGHT = 900  // Reduced from 1080
const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB max per image

function generateSeoFilename(title: string, make: string, model: string, year: number, idx: number): string {
  // Create SEO-friendly filename from vehicle details
  const parts: string[] = []
  
  if (year) parts.push(year.toString())
  if (make) parts.push(make.toLowerCase().replace(/\s+/g, '-'))
  if (model) parts.push(model.toLowerCase().replace(/\s+/g, '-'))
  
  const baseName = parts.length > 0 ? parts.join('-') : 'vehicle'
  return `${baseName}-${idx}.webp`
}

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]')
}

async function compressImage(buffer: Buffer, filename: string): Promise<string> {
  try {
    const outputPath = path.join(UPLOAD_DIR, filename)
    
    // Convert to WebP with compression
    await sharp(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .rotate() // Auto-rotate based on EXIF
      .webp({ 
        quality: IMAGE_QUALITY,
        alphaQuality: IMAGE_QUALITY,
        lossless: false,
        nearLossless: false,
        smartSubsample: true
      })
      .toFile(outputPath)
    
    const stats = fs.statSync(outputPath)
    console.log(`Image converted to WebP: ${filename} - ${(stats.size / 1024 / 1024).toFixed(2)}MB`)
    
    // Warn if still too large
    if (stats.size > MAX_FILE_SIZE) {
      console.warn(`Warning: ${filename} is ${(stats.size / 1024 / 1024).toFixed(2)}MB (max: 3MB)`)
    }
    
    return `/uploads/${filename}`
  } catch (error) {
    console.error('Image compression error:', error)
    // Fallback: save as WebP with lower quality if compression fails
    try {
      const outputPath = path.join(UPLOAD_DIR, filename)
      await sharp(buffer)
        .webp({ quality: 60 })
        .toFile(outputPath)
      return `/uploads/${filename}`
    } catch {
      // Last resort: save original
      const outputPath = path.join(UPLOAD_DIR, filename)
      fs.writeFileSync(outputPath, buffer)
      return `/uploads/${filename}`
    }
  }
}

export async function GET() {
  ensureStorage()
  const raw = fs.readFileSync(DATA_FILE, 'utf8')
  try {
    let data = JSON.parse(raw)
    // Migrate old vehicles: if images array is missing, use image field
    data = data.map((v: any) => ({
      ...v,
      images: v.images && v.images.length > 0 ? v.images : (v.image ? [v.image] : [])
    }))
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  ensureStorage()
  
  try {
    let body: any
    const contentType = req.headers.get('content-type') || ''
    
    // Handle both FormData (multipart) and JSON
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      body = {
        title: formData.get('title'),
        price: formData.get('price'),
        year: formData.get('year'),
        mileage: formData.get('mileage'),
        fuelType: formData.get('fuelType'),
        transmission: formData.get('transmission'),
        color: formData.get('color'),
        make: formData.get('make'),
        model: formData.get('model'),
        bodyType: formData.get('bodyType'),
        location: formData.get('location'),
        features: JSON.parse(formData.get('features') as string || '[]'),
        description: formData.get('description'),
        isFeatured: formData.get('isFeatured') === 'true',
        dealerId: formData.get('dealerId'),
        images: formData.getAll('images') as File[],
      }
    } else {
      body = await req.json()
    }

    const id = Date.now()
    let imagePath = body.image || ''
    const images: string[] = []
    
    // Generate SEO-friendly base filename
    const seoBase = generateSeoFilename(body.title, body.make, body.model, body.year, 0)
    const seoBaseName = seoBase.replace('-0.webp', '')

    // Handle multipart/form-data files
    if (body.images && Array.isArray(body.images) && body.images.length > 0) {
      const files = body.images.slice(0, 10) // limit to 10
      
      for (let idx = 0; idx < files.length; idx++) {
        const file = files[idx]
        // Check if it has the properties of a file-like object (stream, arrayBuffer, etc)
        if (file && (typeof file.arrayBuffer === 'function' || file.stream)) {
          try {
            const buffer = await file.arrayBuffer()
            const filename = `${seoBaseName}-${idx}.webp`
            const savedPath = await compressImage(Buffer.from(buffer), filename)
            images.push(savedPath)
          } catch (err) {
            console.error(`Failed to process file ${idx}:`, err)
          }
        }
      }
      imagePath = images[0] || ''
    }
    // Handle base64 images from JSON (legacy)
    else if (Array.isArray(body.imagesBase64) && body.imagesBase64.length > 0) {
      const items = body.imagesBase64.slice(0, 10) // limit to 10
      
      for (let idx = 0; idx < items.length; idx++) {
        const imgBase64 = items[idx]
        const matches = imgBase64.match(/^data:(.+);base64,(.+)$/)
        let b64 = imgBase64
        
        if (matches) {
          b64 = matches[2]
        }
        
        const buffer = Buffer.from(b64, 'base64')
        const filename = `${seoBaseName}-${idx}.webp`
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
      const filename = `${seoBaseName}.webp`
      imagePath = await compressImage(buffer, filename)
      images.push(imagePath)
    }

    const features = body.features ? (Array.isArray(body.features) ? body.features : []) : []
    
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
      make: body.make || '',
      model: body.model || '',
      bodyType: body.bodyType || '',
      features,
      location: body.location || '',
      isFeatured: Boolean(body.isFeatured),
      status: 'active',
      views: 0,
      dealerId: body.dealerId ? Number(body.dealerId) : null,
      createdAt: new Date().toISOString(),
    }

    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const arr = JSON.parse(raw || '[]')
    arr.unshift(vehicle)
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2))

    // Auto-save make and model to carMakes.json
    if (body.make || body.model) {
      try {
        const carMakesFile = path.join(process.cwd(), 'data', 'carMakes.json')
        const carMakesRaw = fs.readFileSync(carMakesFile, 'utf8')
        let carMakesData = JSON.parse(carMakesRaw || '{"makes": []}')
        
        if (!carMakesData.makes) carMakesData.makes = []
        
        // Find or create make
        let makeEntry = carMakesData.makes.find((m: any) => m.name.toLowerCase() === (body.make || '').toLowerCase())
        
        if (!makeEntry && body.make) {
          makeEntry = {
            id: body.make.toLowerCase().replace(/\s+/g, '-'),
            name: body.make,
            models: body.model ? [body.model] : []
          }
          carMakesData.makes.push(makeEntry)
        } else if (makeEntry && body.model && !makeEntry.models.includes(body.model)) {
          makeEntry.models.push(body.model)
        }
        
        // Sort
        carMakesData.makes.sort((a: any, b: any) => a.name.localeCompare(b.name))
        carMakesData.makes.forEach((m: any) => { m.models.sort() })
        
        fs.writeFileSync(carMakesFile, JSON.stringify(carMakesData, null, 2))
      } catch (makeErr) {
        console.error('Error auto-saving make/model:', makeErr)
      }
    }

    return NextResponse.json(vehicle, { status: 201 })
  } catch (err) {
    console.error('POST /api/vehicles error:', err)
    const errorMessage = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
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
    
    // Generate SEO-friendly base filename for updates
    const seoBase = generateSeoFilename(body.title || existing.title, body.make || existing.make, body.model || existing.model, body.year || existing.year, 0)
    const seoBaseName = seoBase.replace('-0.webp', '')

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
        const filename = `${seoBaseName}-${idx}.webp`
        
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
      make: body.make !== undefined ? body.make : existing.make,
      model: body.model !== undefined ? body.model : existing.model,
      bodyType: body.bodyType !== undefined ? body.bodyType : existing.bodyType,
      features: body.features !== undefined ? (Array.isArray(body.features) ? body.features : []) : existing.features,
      location: body.location !== undefined ? body.location : existing.location,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
      dealerId: body.dealerId !== undefined ? body.dealerId : existing.dealerId,
      image: imagePath,
      images,
    }

    arr[idx] = updated
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2))
    
    // Auto-save make and model to carMakes.json
    if (body.make || body.model) {
      try {
        const carMakesFile = path.join(process.cwd(), 'data', 'carMakes.json')
        const carMakesRaw = fs.readFileSync(carMakesFile, 'utf8')
        let carMakesData = JSON.parse(carMakesRaw || '{"makes": []}')
        
        if (!carMakesData.makes) carMakesData.makes = []
        
        // Find or create make
        let makeEntry = carMakesData.makes.find((m: any) => m.name.toLowerCase() === (body.make || '').toLowerCase())
        
        if (!makeEntry && body.make) {
          makeEntry = {
            id: body.make.toLowerCase().replace(/\s+/g, '-'),
            name: body.make,
            models: body.model ? [body.model] : []
          }
          carMakesData.makes.push(makeEntry)
        } else if (makeEntry && body.model && !makeEntry.models.includes(body.model)) {
          makeEntry.models.push(body.model)
        }
        
        // Sort
        carMakesData.makes.sort((a: any, b: any) => a.name.localeCompare(b.name))
        carMakesData.makes.forEach((m: any) => { m.models.sort() })
        
        fs.writeFileSync(carMakesFile, JSON.stringify(carMakesData, null, 2))
      } catch (makeErr) {
        console.error('Error auto-saving make/model:', makeErr)
      }
    }
    
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
