import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const DATA_DIR = path.join(process.cwd(), 'data')
const CAR_MAKES_FILE = path.join(DATA_DIR, 'carMakes.json')

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(CAR_MAKES_FILE)) {
    fs.writeFileSync(CAR_MAKES_FILE, JSON.stringify({ makes: [] }, null, 2))
  }
}

export async function GET() {
  ensureStorage()
  try {
    const raw = fs.readFileSync(CAR_MAKES_FILE, 'utf8')
    const data = JSON.parse(raw)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ makes: [] })
  }
}

export async function POST(req: Request) {
  ensureStorage()
  try {
    const body = await req.json()
    const { make, model } = body

    if (!make) {
      return NextResponse.json({ error: 'Make is required' }, { status: 400 })
    }

    const raw = fs.readFileSync(CAR_MAKES_FILE, 'utf8')
    let data = JSON.parse(raw)

    if (!data.makes) {
      data.makes = []
    }

    // Find or create make entry
    let makeEntry = data.makes.find((m: any) => m.name.toLowerCase() === make.toLowerCase())

    if (!makeEntry) {
      // Create new make
      makeEntry = {
        id: make.toLowerCase().replace(/\s+/g, '-'),
        name: make,
        models: model ? [model] : []
      }
      data.makes.push(makeEntry)
    } else if (model && !makeEntry.models.includes(model)) {
      // Add model to existing make
      makeEntry.models.push(model)
    }

    // Sort makes by name
    data.makes.sort((a: any, b: any) => a.name.localeCompare(b.name))

    // Sort models within each make
    data.makes.forEach((m: any) => {
      m.models.sort()
    })

    fs.writeFileSync(CAR_MAKES_FILE, JSON.stringify(data, null, 2))

    return NextResponse.json({
      success: true,
      make: makeEntry,
      message: `${make}${model ? ` - ${model}` : ''} saved successfully`
    })
  } catch (error) {
    console.error('Error saving car make:', error)
    return NextResponse.json({ error: 'Failed to save car make' }, { status: 500 })
  }
}
