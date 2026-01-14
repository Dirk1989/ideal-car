// app/api/dealers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DEALERS_FILE = path.join(DATA_DIR, 'dealers.json')

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
  
  try {
    await fs.access(DEALERS_FILE)
  } catch {
    await fs.writeFile(DEALERS_FILE, '[]')
  }
}

export async function GET() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(DEALERS_FILE, 'utf-8')
    const dealers = JSON.parse(data)
    return NextResponse.json(dealers)
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDir()
    const body = await request.json()
    const { name, owner, phone, email, address, notes } = body

    const data = await fs.readFile(DEALERS_FILE, 'utf-8').catch(() => '[]')
    const dealers = JSON.parse(data)

    const newDealer = {
      id: Date.now(),
      name,
      owner,
      phone,
      email,
      address,
      notes,
      createdAt: new Date().toISOString(),
      vehicleCount: 0
    }

    dealers.push(newDealer)
    await fs.writeFile(DEALERS_FILE, JSON.stringify(dealers, null, 2))

    return NextResponse.json(newDealer, { status: 201 })
  } catch (error) {
    console.error('Error creating dealer:', error)
    return NextResponse.json({ error: 'Failed to create dealer' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, owner, phone, email, address, notes } = body

    const data = await fs.readFile(DEALERS_FILE, 'utf-8')
    const dealers = JSON.parse(data)

    const index = dealers.findIndex((d: any) => d.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 })
    }

    dealers[index] = {
      ...dealers[index],
      name,
      owner,
      phone,
      email,
      address,
      notes,
      updatedAt: new Date().toISOString()
    }

    await fs.writeFile(DEALERS_FILE, JSON.stringify(dealers, null, 2))
    return NextResponse.json(dealers[index])
  } catch (error) {
    console.error('Error updating dealer:', error)
    return NextResponse.json({ error: 'Failed to update dealer' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    const data = await fs.readFile(DEALERS_FILE, 'utf-8')
    const dealers = JSON.parse(data)

    const index = dealers.findIndex((d: any) => d.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 })
    }

    const filtered = dealers.filter((d: any) => d.id !== id)
    await fs.writeFile(DEALERS_FILE, JSON.stringify(filtered, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting dealer:', error)
    return NextResponse.json({ error: 'Failed to delete dealer' }, { status: 500 })
  }
}
