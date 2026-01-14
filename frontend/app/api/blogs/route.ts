import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'blogs.json')
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Image compression settings
const IMAGE_QUALITY = 80
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
      .jpeg({ quality: IMAGE_QUALITY, mozjpeg: true })
      .toFile(filePath)
    
    return `/uploads/${filename}`
  } catch (error) {
    console.error('Image compression failed:', error)
    // Fallback: save original
    const filePath = path.join(UPLOAD_DIR, filename)
    fs.writeFileSync(filePath, buffer)
    return `/uploads/${filename}`
  }
}

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]')
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

  let imagePath = ''
  if (body.imageBase64) {
    const matches = body.imageBase64.match(/^data:(.+);base64,(.+)$/)
    let b64 = body.imageBase64
    
    if (matches) {
      b64 = matches[2]
    }
    
    const buffer = Buffer.from(b64, 'base64')
    const filename = `${id}.jpg`
    
    // Compress and save image
    imagePath = await compressImage(buffer, filename)
  }

  const post = {
    id,
    title: body.title || 'Untitled',
    excerpt: body.excerpt || '',
    content: body.content || '',
    image: imagePath,
    category: body.category || 'General',
    date: body.date || new Date().toISOString(),
    readTime: body.readTime || '3 min read',
    author: body.author || 'Admin',
    status: body.status === 'draft' ? 'draft' : 'published',
    views: Number(body.views) || 0,
    createdAt: new Date().toISOString(),
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf8')
  const arr = JSON.parse(raw || '[]')
  arr.unshift(post)
  fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2))

  return NextResponse.json(post, { status: 201 })
}

export async function DELETE(req: Request) {
  ensureStorage()
  try {
    const body = await req.json()
    const id = Number(body.id)
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const arr = JSON.parse(raw || '[]')
    const idx = arr.findIndex((b: any) => Number(b.id) === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const [removed] = arr.splice(idx, 1)
    if (removed && removed.image) {
      try {
        const filename = path.basename(removed.image)
        const fp = path.join(UPLOAD_DIR, filename)
        if (fs.existsSync(fp)) fs.unlinkSync(fp)
      } catch (e) {
        console.error('Failed to remove blog image', e)
      }
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2))
    return NextResponse.json({ id }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

