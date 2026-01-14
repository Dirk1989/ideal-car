import { NextResponse } from 'next/server'

async function sendEmail(inspection: any) {
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
      <h1 style="margin: 0; font-size: 24px;">🔍 Inspection Enquiry</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">New inspection booking request</p>
    </div>
    <div class="content">
      <div class="detail-row">
        <div class="label">Name</div>
        <div class="value">${inspection.name}</div>
      </div>
      <div class="detail-row">
        <div class="label">Phone</div>
        <div class="value">${inspection.phone}</div>
      </div>
      <div class="detail-row">
        <div class="label">Email</div>
        <div class="value">${inspection.email}</div>
      </div>
      <div class="detail-row">
        <div class="label">Vehicle Details</div>
        <div class="value">${inspection.vehicleDetails}</div>
      </div>
      <div class="detail-row">
        <div class="label">Vehicle Location</div>
        <div class="value">${inspection.location}</div>
      </div>
      <div class="detail-row">
        <div class="label">Preferred Contact Method</div>
        <div class="value">${inspection.preferredContact}</div>
      </div>
      ${inspection.notes ? `
      <div class="detail-row">
        <div class="label">Additional Notes</div>
        <div class="value">${inspection.notes}</div>
      </div>` : ''}
      <div class="detail-row">
        <div class="label">Received</div>
        <div class="value">${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</div>
      </div>
    </div>
  </div>
</body>
</html>`

    const info = await transporter.sendMail({
      from: user,
      to,
      subject: `🔍 Inspection Enquiry: ${inspection.vehicleDetails}`,
      html: htmlEmail,
    })
    console.log('Inspection email sent', info.messageId)
  } catch (err) {
    console.error('Failed to send inspection email', err)
    throw err
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const inspection = {
      name: body.name || '',
      phone: body.phone || '',
      email: body.email || '',
      vehicleDetails: body.vehicleDetails || '',
      location: body.location || '',
      preferredContact: body.preferredContact || '',
      notes: body.notes || '',
    }

    await sendEmail(inspection)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
