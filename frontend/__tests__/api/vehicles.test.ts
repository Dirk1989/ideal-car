// __tests__/api/vehicles.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000'

describe('Vehicles API', () => {
  let createdVehicleId: number

  it('should fetch all vehicles', async () => {
    const res = await fetch(`${BASE_URL}/api/vehicles`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it('should create a new vehicle', async () => {
    const payload = {
      title: 'Test Vehicle',
      price: 50000,
      year: 2023,
      mileage: 10000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      color: 'Blue',
      location: 'Johannesburg',
      features: ['Sunroof', 'Leather Seats'],
      isFeatured: false,
      dealerId: null
    }

    const res = await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.title).toBe('Test Vehicle')
    expect(data.price).toBe(50000)
    expect(data.color).toBe('Blue')
    expect(data.dealerId).toBe(null)
    expect(data.id).toBeDefined()
    
    createdVehicleId = data.id
  })

  it('should create a vehicle with dealer association', async () => {
    // First create a dealer
    const dealerRes = await fetch(`${BASE_URL}/api/dealers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Dealer',
        owner: 'John Doe',
        phone: '0712345678',
        email: 'test@dealer.com',
        address: '123 Test St',
        notes: 'Test dealer'
      })
    })
    
    const dealer = await dealerRes.json()
    
    const payload = {
      title: 'Dealer Test Vehicle',
      price: 75000,
      year: 2024,
      mileage: 5000,
      fuelType: 'Diesel',
      transmission: 'Manual',
      color: 'Red',
      location: 'Pretoria',
      features: ['GPS', 'Bluetooth'],
      isFeatured: true,
      dealerId: dealer.id
    }

    const res = await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.title).toBe('Dealer Test Vehicle')
    expect(data.dealerId).toBe(dealer.id)
    
    // Cleanup
    await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: data.id })
    })
    
    await fetch(`${BASE_URL}/api/dealers`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: dealer.id })
    })
  })

  it('should update a vehicle', async () => {
    if (!createdVehicleId) {
      throw new Error('No vehicle to update')
    }

    const payload = {
      id: createdVehicleId,
      title: 'Updated Test Vehicle',
      price: 55000,
      year: 2023,
      mileage: 15000,
      color: 'Green'
    }

    const res = await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.title).toBe('Updated Test Vehicle')
    expect(data.price).toBe(55000)
    expect(data.mileage).toBe(15000)
    expect(data.color).toBe('Green')
  })

  it('should delete a vehicle', async () => {
    if (!createdVehicleId) {
      throw new Error('No vehicle to delete')
    }

    const res = await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: createdVehicleId })
    })

    expect(res.status).toBe(200)
    
    // Verify it's deleted
    const allVehicles = await fetch(`${BASE_URL}/api/vehicles`)
    const data = await allVehicles.json()
    const found = data.find((v: any) => v.id === createdVehicleId)
    expect(found).toBeUndefined()
  })

  it('should return 404 for non-existent vehicle update', async () => {
    const payload = {
      id: 999999999,
      title: 'Non-existent Vehicle'
    }

    const res = await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    expect(res.status).toBe(404)
  })

  it('should return 404 for non-existent vehicle delete', async () => {
    const res = await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 999999999 })
    })

    expect(res.status).toBe(404)
  })
})
