// __tests__/api/dealers.test.ts
import { describe, it, expect } from '@jest/globals'

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000'

describe('Dealers API', () => {
  let createdDealerId: number

  it('should fetch all dealers', async () => {
    const res = await fetch(`${BASE_URL}/api/dealers`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it('should create a new dealer', async () => {
    const payload = {
      name: 'Premium Motors',
      owner: 'Jane Smith',
      phone: '0712345678',
      email: 'jane@premium.com',
      address: '456 Main Road, Sandton',
      notes: 'Specializes in luxury vehicles'
    }

    const res = await fetch(`${BASE_URL}/api/dealers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.name).toBe('Premium Motors')
    expect(data.owner).toBe('Jane Smith')
    expect(data.email).toBe('jane@premium.com')
    expect(data.id).toBeDefined()
    expect(data.createdAt).toBeDefined()
    
    createdDealerId = data.id
  })

  it('should delete a dealer', async () => {
    if (!createdDealerId) {
      throw new Error('No dealer to delete')
    }

    const res = await fetch(`${BASE_URL}/api/dealers`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: createdDealerId })
    })

    expect(res.status).toBe(200)
    
    // Verify it's deleted
    const allDealers = await fetch(`${BASE_URL}/api/dealers`)
    const data = await allDealers.json()
    const found = data.find((d: any) => d.id === createdDealerId)
    expect(found).toBeUndefined()
  })

  it('should return 404 for non-existent dealer delete', async () => {
    const res = await fetch(`${BASE_URL}/api/dealers`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 999999999 })
    })

    expect(res.status).toBe(404)
  })
})
