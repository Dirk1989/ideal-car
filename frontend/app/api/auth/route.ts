import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Simple password verification with timing attack protection
function verifyPassword(inputPassword: string, storedPassword: string): boolean {
  // Use constant-time comparison to prevent timing attacks
  const inputHash = crypto.createHash('sha256').update(inputPassword).digest('hex')
  const storedHash = crypto.createHash('sha256').update(storedPassword).digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(inputHash),
    Buffer.from(storedHash)
  )
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Get credentials from environment variables
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'IdealCar2026!@Secure#Admin'

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Verify credentials with timing attack protection
    const usernameMatch = username === ADMIN_USERNAME
    const passwordMatch = verifyPassword(password, ADMIN_PASSWORD)

    if (usernameMatch && passwordMatch) {
      // Generate session token
      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000) // 24 hours

      // In production, store this in Redis or database
      // For now, we'll send it to the client
      return NextResponse.json({
        success: true,
        token,
        expiresAt,
        user: {
          username: ADMIN_USERNAME,
          role: 'admin'
        }
      })
    }

    // Add delay to prevent brute force attacks
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
