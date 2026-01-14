import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'leads.json')

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]')
}

async function trySendEmail(lead: any) {
  try {
    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 587)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const to = process.env.NOTIFY_EMAIL || 'your-email@idealcar.co.za'

    if (!host || !user || !pass) {
      console.log('SMTP not configured, skipping email send')
      return
    }

    // Lazy require nodemailer so app still runs without it installed
    let nodemailer: any
    try {
      const req: any = eval('require')
      nodemailer = req('nodemailer')
    } catch (e) {
      console.log('nodemailer not available, skipping email send')
      return
    }
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    const htmlEmail = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .detail-row { margin: 15px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #2563eb; }
    .label { font-weight: bold; color: #2563eb; margin-bottom: 5px; }
    .value { color: #1f2937; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">🚗 Car for Sale</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">New vehicle listing submission</p>
    </div>
    <div class="content">
      <div class="detail-row">
        <div class="label">Contact Name</div>
        <div class="value">${lead.name || 'Not provided'}</div>
      </div>
      <div class="detail-row">
        <div class="label">Phone Number</div>
        <div class="value">${lead.phone || 'Not provided'}</div>
      </div>
      <div class="detail-row">
        <div class="label">Email Address</div>
        <div class="value">${lead.email || 'Not provided'}</div>
      </div>
      <div class="detail-row">
        <div class="label">Vehicle Details</div>
        <div class="value">${lead.carYear || ''} ${lead.carMake || ''} ${lead.carModel || ''}</div>
      </div>
      <div class="detail-row">
        <div class="label">Mileage</div>
        <div class="value">${lead.carMileage || 'Not provided'} km</div>
      </div>
      <div class="detail-row">
        <div class="label">Location</div>
        <div class="value">${lead.carLocation || 'Not provided'}</div>
      </div>
      <div class="detail-row">
        <div class="label">Preferred Contact Method</div>
        <div class="value">${lead.preferredContact || 'Not specified'}</div>
      </div>
      ${lead.additionalInfo ? `
      <div class="detail-row">
        <div class="label">Additional Information</div>
        <div class="value">${lead.additionalInfo}</div>
      </div>` : ''}
      ${lead.urgency ? `
      <div class="detail-row">
        <div class="label">Urgency</div>
        <div class="value">${lead.urgency}</div>
      </div>` : ''}
      <div class="detail-row">
        <div class="label">Received</div>
        <div class="value">${new Date(lead.createdAt).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</div>
      </div>
    </div>
  </div>
</body>
</html>`

    const info = await transporter.sendMail({
      from: user,
      to,
      subject: `🚗 Car for Sale: ${lead.carYear || ''} ${lead.carMake || ''} ${lead.carModel || ''}`,
      html: htmlEmail,
    })
    console.log('Lead email sent', info.messageId)
  } catch (err) {
    console.error('Failed to send lead email', err)
  }
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

  const lead = {
    id,
    name: body.name || '',
    phone: body.phone || '',
    email: body.email || '',
    carMake: body.carMake || '',
    carModel: body.carModel || '',
    carYear: body.carYear || '',
    carMileage: body.carMileage || '',
    carLocation: body.carLocation || '',
    preferredContact: body.preferredContact || '',
    additionalInfo: body.additionalInfo || '',
    urgency: body.urgency || '',
    createdAt: new Date().toISOString(),
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf8')
  const arr = JSON.parse(raw || '[]')
  arr.unshift(lead)
  fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2))

  // try sending email async
  trySendEmail(lead)

  return NextResponse.json(lead, { status: 201 })
}

export async function DELETE(req: Request) {
  ensureStorage()
  try {
    const body = await req.json()
    const id = Number(body.id)
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const arr = JSON.parse(raw || '[]')
    const idx = arr.findIndex((l: any) => Number(l.id) === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    arr.splice(idx, 1)
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2))
    return NextResponse.json({ id }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

