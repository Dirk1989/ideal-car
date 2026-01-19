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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  ensureStorage()
  try {
    const body = await req.json()
    const id = Number(params.id)
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const arr = JSON.parse(raw || '[]')
    const idx = arr.findIndex((b: any) => Number(b.id) === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const existing = arr[idx]
    let imagePath = existing.image

    // Handle new image upload
    if (body.imageBase64) {
      const matches = body.imageBase64.match(/^data:(.+);base64,(.+)$/)
      let b64 = body.imageBase64
      
      if (matches) {
        b64 = matches[2]
      }
      
      const buffer = Buffer.from(b64, 'base64')
      const filename = `${id}.jpg`
      
      // Remove old image if it exists
      if (existing.image) {
        try {
          const oldFilename = path.basename(existing.image)
          const oldPath = path.join(UPLOAD_DIR, oldFilename)
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
        } catch (e) {
          console.error('Failed to remove old blog image', e)
        }
      }
      
      // Compress and save new image
      imagePath = await compressImage(buffer, filename)
    }

    const updated = {
      ...existing,
      title: body.title || existing.title,
      excerpt: body.excerpt || existing.excerpt,
      content: body.content || existing.content,
      image: imagePath,
      category: body.category || existing.category,
      readTime: body.readTime || existing.readTime,
      author: body.author || existing.author,
      status: body.status === 'draft' ? 'draft' : 'published',
      updatedAt: new Date().toISOString(),
    }

    arr[idx] = updated
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2))

    return NextResponse.json(updated, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
