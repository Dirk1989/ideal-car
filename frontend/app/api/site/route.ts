import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'site.json')
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Image compression settings
const IMAGE_QUALITY = 75
const MAX_WIDTH = 1920
const MAX_HEIGHT = 1080

async function compressImage(buffer: Buffer, filename: string): Promise<string> {
  try {
    const filePath = path.join(UPLOAD_DIR, filename)
    await sharp(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: IMAGE_QUALITY, alphaQuality: IMAGE_QUALITY })
      .toFile(filePath)
    
    return `/uploads/${filename}`
  } catch (error) {
    console.error('Image compression failed:', error)
    // Fallback: save as WebP with lower quality
    try {
      const filePath = path.join(UPLOAD_DIR, filename)
      await sharp(buffer).webp({ quality: 60 }).toFile(filePath)
      return `/uploads/${filename}`
    } catch {
      const filePath = path.join(UPLOAD_DIR, filename)
      fs.writeFileSync(filePath, buffer)
      return `/uploads/${filename}`
    }
  }
}

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ siteName: 'IdealCar', tagline: 'Car Marketplace', logo: '', heroImages: [] }, null, 2))
}

export async function GET() {
  ensureStorage()
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const data = JSON.parse(raw)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ siteName: 'IdealCar', tagline: 'Car Marketplace', logo: '', heroImages: [] })
  }
}

export async function POST(req: Request) {
  // update site config: accepts JSON with optional siteName, tagline, logoBase64, heroImagesBase64
  ensureStorage()
  try {
    const body = await req.json()
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const cfg = JSON.parse(raw || '{}')

    if (body.siteName) cfg.siteName = String(body.siteName)
    if (body.tagline) cfg.tagline = String(body.tagline)

    // handle logo with compression
    if (body.logoBase64) {
      const id = Date.now()
      const matches = String(body.logoBase64).match(/^data:(.+);base64,(.+)$/)
      let b64 = body.logoBase64
      
      if (matches) {
        b64 = matches[2]
      }
      
      const buffer = Buffer.from(b64, 'base64')
      const filename = `site-logo-${id}.webp`
      
      // Compress and save image
      cfg.logo = await compressImage(buffer, filename)
    }

    // handle hero images array with compression
    if (Array.isArray(body.heroImagesBase64) && body.heroImagesBase64.length > 0) {
      const items = body.heroImagesBase64.slice(0, 10)
      const saved: string[] = []
      const id = Date.now()
      
      for (let idx = 0; idx < items.length; idx++) {
        const imgBase64 = items[idx]
        const matches = String(imgBase64).match(/^data:(.+);base64,(.+)$/)
        let b64 = imgBase64
        
        if (matches) {
          b64 = matches[2]
        }
        
        const buffer = Buffer.from(b64, 'base64')
        const filename = `hero-${id}-${idx}.webp`
        
        // Compress and save image
        const savedPath = await compressImage(buffer, filename)
        saved.push(savedPath)
      }
      
      cfg.heroImages = saved
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(cfg, null, 2))
    return NextResponse.json(cfg)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update site config' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  // update site config: accepts JSON with siteName, tagline and/or FormData with heroImages
  ensureStorage()
  try {
    const contentType = req.headers.get('content-type') || ''
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const cfg = JSON.parse(raw || '{}')

    if (contentType.includes('application/json')) {
      // JSON body
      const body = await req.json()
      
      if (body.siteName) cfg.siteName = String(body.siteName)
      if (body.tagline) cfg.tagline = String(body.tagline)
    } else if (contentType.includes('multipart/form-data')) {
      // FormData with files
      const formData = await req.formData()
      
      // Handle hero images
      const heroImages = formData.getAll('heroImages') as File[]
      if (heroImages && heroImages.length > 0) {
        const saved: string[] = []
        const id = Date.now()
        
        for (let idx = 0; idx < heroImages.length; idx++) {
          const file = heroImages[idx]
          const buffer = await file.arrayBuffer()
          const filename = `hero-${id}-${idx}.webp`
          
          const savedPath = await compressImage(Buffer.from(buffer), filename)
          saved.push(savedPath)
        }
        
        cfg.heroImages = saved
      }
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(cfg, null, 2))
    return NextResponse.json(cfg)
  } catch (error) {
    console.error('PUT /api/site error:', error)
    return NextResponse.json({ error: 'Failed to update site config' }, { status: 500 })
  }
}
