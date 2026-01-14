// __tests__/api/leads.test.ts
import { describe, it, expect } from '@jest/globals'

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000'

describe('Leads API', () => {
  let createdLeadId: number

  it('should fetch all leads', async () => {
    const res = await fetch(`${BASE_URL}/api/leads`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it('should create a new lead', async () => {
    const payload = {
      name: 'Test Customer',
      phone: '0712345678',
      email: 'test@customer.com',
      carMake: 'Toyota',
      carModel: 'Corolla',
      carYear: '2020',
      carMileage: '50000',
      carLocation: 'Johannesburg',
      preferredContact: 'phone',
      additionalInfo: 'Looking to sell quickly',
      urgency: 'within_week'
    }

    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.name).toBe('Test Customer')
    expect(data.carMake).toBe('Toyota')
    expect(data.carModel).toBe('Corolla')
    expect(data.id).toBeDefined()
    expect(data.createdAt).toBeDefined()
    
    createdLeadId = data.id
  })

  it('should delete a lead', async () => {
    if (!createdLeadId) {
      throw new Error('No lead to delete')
    }

    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: createdLeadId })
    })

    expect(res.status).toBe(200)
    
    // Verify it's deleted
    const allLeads = await fetch(`${BASE_URL}/api/leads`)
    const data = await allLeads.json()
    const found = data.find((l: any) => l.id === createdLeadId)
    expect(found).toBeUndefined()
  })

  it('should handle missing required fields gracefully', async () => {
    const payload = {
      name: 'Incomplete Lead'
      // missing other required fields
    }

    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    // Should still create lead with empty fields
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.name).toBe('Incomplete Lead')
    
    // Cleanup
    await fetch(`${BASE_URL}/api/leads`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: data.id })
    })
  })
})
