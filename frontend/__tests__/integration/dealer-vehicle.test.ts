// __tests__/integration/dealer-vehicle.test.ts
import { describe, it, expect } from '@jest/globals'

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000'

describe('Dealer-Vehicle Integration', () => {
  it('should properly associate vehicles with dealers and filter correctly', async () => {
    // Create a dealer
    const dealerPayload = {
      name: 'Integration Test Dealer',
      owner: 'Test Owner',
      phone: '0712345678',
      email: 'integration@test.com',
      address: '123 Test St',
      notes: 'Test notes'
    }

    const dealerRes = await fetch(`${BASE_URL}/api/dealers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dealerPayload)
    })

    expect(dealerRes.status).toBe(201)
    const dealer = await dealerRes.json()
    expect(dealer.id).toBeDefined()

    // Create multiple vehicles for this dealer
    const vehicle1Payload = {
      title: 'Dealer Vehicle 1',
      price: 50000,
      year: 2023,
      mileage: 10000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      location: 'Johannesburg',
      features: ['GPS'],
      isFeatured: false,
      dealerId: dealer.id
    }

    const vehicle2Payload = {
      title: 'Dealer Vehicle 2',
      price: 75000,
      year: 2024,
      mileage: 5000,
      fuelType: 'Diesel',
      transmission: 'Manual',
      location: 'Pretoria',
      features: ['Sunroof'],
      isFeatured: true,
      dealerId: dealer.id
    }

    const v1Res = await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle1Payload)
    })

    const v2Res = await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle2Payload)
    })

    expect(v1Res.status).toBe(201)
    expect(v2Res.status).toBe(201)

    const vehicle1 = await v1Res.json()
    const vehicle2 = await v2Res.json()

    expect(vehicle1.dealerId).toBe(dealer.id)
    expect(vehicle2.dealerId).toBe(dealer.id)

    // Fetch all vehicles and verify filtering by dealer
    const allVehiclesRes = await fetch(`${BASE_URL}/api/vehicles`)
    const allVehicles = await allVehiclesRes.json()
    
    const dealerVehicles = allVehicles.filter((v: any) => v.dealerId === dealer.id)
    expect(dealerVehicles.length).toBeGreaterThanOrEqual(2)

    // Verify dealer's vehicles
    const foundV1 = dealerVehicles.find((v: any) => v.id === vehicle1.id)
    const foundV2 = dealerVehicles.find((v: any) => v.id === vehicle2.id)
    
    expect(foundV1).toBeDefined()
    expect(foundV2).toBeDefined()
    expect(foundV1.title).toBe('Dealer Vehicle 1')
    expect(foundV2.title).toBe('Dealer Vehicle 2')

    // Cleanup
    await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: vehicle1.id })
    })

    await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: vehicle2.id })
    })

    await fetch(`${BASE_URL}/api/dealers`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: dealer.id })
    })
  })

  it('should allow updating vehicle dealer association', async () => {
    // Create two dealers
    const dealer1Res = await fetch(`${BASE_URL}/api/dealers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dealer One',
        owner: 'Owner 1',
        phone: '0711111111',
        email: 'd1@test.com',
        address: '',
        notes: ''
      })
    })

    const dealer2Res = await fetch(`${BASE_URL}/api/dealers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dealer Two',
        owner: 'Owner 2',
        phone: '0722222222',
        email: 'd2@test.com',
        address: '',
        notes: ''
      })
    })

    const dealer1 = await dealer1Res.json()
    const dealer2 = await dealer2Res.json()

    // Create vehicle with dealer1
    const vehicleRes = await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Transfer Vehicle',
        price: 100000,
        year: 2023,
        mileage: 20000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        location: 'Sandton',
        features: [],
        isFeatured: false,
        dealerId: dealer1.id
      })
    })

    const vehicle = await vehicleRes.json()
    expect(vehicle.dealerId).toBe(dealer1.id)

    // Update vehicle to dealer2
    const updateRes = await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: vehicle.id,
        dealerId: dealer2.id
      })
    })

    expect(updateRes.status).toBe(200)
    const updatedVehicle = await updateRes.json()
    expect(updatedVehicle.dealerId).toBe(dealer2.id)

    // Cleanup
    await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: vehicle.id })
    })

    await fetch(`${BASE_URL}/api/dealers`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: dealer1.id })
    })

    await fetch(`${BASE_URL}/api/dealers`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: dealer2.id })
    })
  })

  it('should allow vehicles without dealer association', async () => {
    const vehiclePayload = {
      title: 'Independent Vehicle',
      price: 60000,
      year: 2022,
      mileage: 30000,
      fuelType: 'Diesel',
      transmission: 'Manual',
      location: 'Cape Town',
      features: ['Radio'],
      isFeatured: false,
      dealerId: null
    }

    const res = await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehiclePayload)
    })

    expect(res.status).toBe(201)
    const vehicle = await res.json()
    expect(vehicle.dealerId).toBe(null)

    // Cleanup
    await fetch(`${BASE_URL}/api/vehicles`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: vehicle.id })
    })
  })
})
