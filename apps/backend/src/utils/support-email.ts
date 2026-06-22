import sgMail from "@sendgrid/mail"

type SupportEmailInput = {
  name: string
  email: string
  subject: string
  message: string
}

const SUPPORT_EMAIL = "support@1stop-liquidation.com"

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export async function sendSupportEmail({
  name,
  email,
  subject,
  message,
}: SupportEmailInput) {
  const apiKey = process.env.SENDGRID_API_KEY
  const from = process.env.SENDGRID_FROM

  if (!apiKey || !from) {
    throw new Error("SendGrid is not configured.")
  }

  sgMail.setApiKey(apiKey)

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />")

  await sgMail.send({
    to: SUPPORT_EMAIL,
    from,
    replyTo: {
      email,
      name,
    },
    subject: `Support request: ${subject}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      "",
      message,
    ].join("\n"),
    html: `
      <h1>New support request</h1>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Subject:</strong> ${safeSubject}</p>
      <hr />
      <p>${safeMessage}</p>
    `,
  })
}

