import { NextResponse } from 'next/server'

async function sendEmail(enquiry: any) {
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
    .vehicle-box { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #2563eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">🚗 Vehicle Enquiry</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Customer interested in vehicle</p>
    </div>
    <div class="content">
      <div class="vehicle-box">
        <h3 style="margin-top: 0; color: #2563eb;">Vehicle of Interest</h3>
        <div style="font-size: 18px; font-weight: bold; color: #1f2937;">${enquiry.vehicleTitle}</div>
        <div style="color: #6b7280; margin-top: 5px;">Price: ${enquiry.vehiclePrice}</div>
      </div>
      
      <h3 style="color: #1f2937;">Customer Details</h3>
      <div class="detail-row">
        <div class="label">Name</div>
        <div class="value">${enquiry.name} ${enquiry.surname}</div>
      </div>
      <div class="detail-row">
        <div class="label">Contact Number</div>
        <div class="value">${enquiry.phone}</div>
      </div>
      <div class="detail-row">
        <div class="label">Email Address</div>
        <div class="value">${enquiry.email}</div>
      </div>
      ${enquiry.message ? `
      <div class="detail-row">
        <div class="label">Message</div>
        <div class="value">${enquiry.message}</div>
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
      subject: `🚗 Vehicle Enquiry: ${enquiry.vehicleTitle}`,
      html: htmlEmail,
    })
    console.log('Vehicle enquiry email sent', info.messageId)
  } catch (err) {
    console.error('Failed to send vehicle enquiry email', err)
    throw err
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const enquiry = {
      name: body.name || '',
      surname: body.surname || '',
      phone: body.phone || '',
      email: body.email || '',
      message: body.message || '',
      vehicleTitle: body.vehicleTitle || '',
      vehiclePrice: body.vehiclePrice || '',
      vehicleId: body.vehicleId || '',
    }

    await sendEmail(enquiry)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to send enquiry' }, { status: 500 })
  }
}
