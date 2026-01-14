import { NextResponse } from 'next/server'

async function sendEmail(contact: any) {
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
    .message-box { background: white; padding: 20px; border-radius: 8px; border: 2px solid #e5e7eb; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">✉️ Contact Form Submission</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">New message from website</p>
    </div>
    <div class="content">
      <div class="detail-row">
        <div class="label">Name</div>
        <div class="value">${contact.name}</div>
      </div>
      <div class="detail-row">
        <div class="label">Email</div>
        <div class="value">${contact.email}</div>
      </div>
      ${contact.phone ? `
      <div class="detail-row">
        <div class="label">Phone</div>
        <div class="value">${contact.phone}</div>
      </div>` : ''}
      <div class="detail-row">
        <div class="label">Subject</div>
        <div class="value">${contact.subject}</div>
      </div>
      <div class="detail-row">
        <div class="label">Message</div>
        <div class="message-box">${contact.message.replace(/\n/g, '<br>')}</div>
      </div>
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
      subject: `✉️ Contact: ${contact.subject}`,
      html: htmlEmail,
    })
    console.log('Contact email sent', info.messageId)
  } catch (err) {
    console.error('Failed to send contact email', err)
    throw err
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const contact = {
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      subject: body.subject || '',
      message: body.message || '',
    }

    await sendEmail(contact)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
