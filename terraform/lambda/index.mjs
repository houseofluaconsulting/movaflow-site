import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const ses = new SESv2Client({});

const FROM_EMAIL = process.env.FROM_EMAIL;
const TO_EMAIL = process.env.TO_EMAIL;

const ALLOWED_ORIGINS = (() => {
  try {
    const parsed = JSON.parse(process.env.ALLOWED_ORIGINS || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
})();

const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_SUBJECT = 300;
const MAX_MESSAGE = 5000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const corsHeadersFor = (origin) => {
  // Access-Control-Allow-Origin must be a single value, so echo the request
  // origin only if it's in the allow list.
  const allowOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0] || "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    Vary: "Origin",
  };
};

const respond = (statusCode, body, origin) => ({
  statusCode,
  headers: { "Content-Type": "application/json", ...corsHeadersFor(origin) },
  body: JSON.stringify(body),
});

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const handler = async (event) => {
  const method = event?.requestContext?.http?.method || event?.httpMethod;
  const origin = event?.headers?.origin || event?.headers?.Origin;

  if (method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeadersFor(origin), body: "" };
  }

  if (method !== "POST") {
    return respond(405, { error: "Method not allowed" }, origin);
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return respond(400, { error: "Invalid JSON" }, origin);
  }

  // Honeypot — silently succeed so bots don't learn anything.
  if (payload.company) {
    return respond(200, { ok: true }, origin);
  }

  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const subject = String(payload.subject || "").trim();
  const message = String(payload.message || "").trim();

  if (!name || name.length > MAX_NAME) {
    return respond(400, { error: "Invalid name" }, origin);
  }
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    return respond(400, { error: "Invalid email" }, origin);
  }
  if (!subject || subject.length > MAX_SUBJECT) {
    return respond(400, { error: "Invalid subject" }, origin);
  }
  if (!message || message.length > MAX_MESSAGE) {
    return respond(400, { error: "Invalid message" }, origin);
  }

  const textBody =
    `New inquiry from the Mova Flow contact form\n\n` +
    `Name:    ${name}\n` +
    `Email:   ${email}\n` +
    `Subject: ${subject}\n\n` +
    `Message:\n${message}\n`;

  const htmlBody =
    `<h2>New inquiry from the Mova Flow contact form</h2>` +
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` +
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
    `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` +
    `<p><strong>Message:</strong></p>` +
    `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;

  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: FROM_EMAIL,
        Destination: { ToAddresses: [TO_EMAIL] },
        ReplyToAddresses: [email],
        Content: {
          Simple: {
            Subject: { Data: `[Mova Flow] ${subject}`, Charset: "UTF-8" },
            Body: {
              Text: { Data: textBody, Charset: "UTF-8" },
              Html: { Data: htmlBody, Charset: "UTF-8" },
            },
          },
        },
      })
    );
  } catch (err) {
    console.error("SES send failed", err);
    return respond(502, { error: "Failed to send message" }, origin);
  }

  return respond(200, { ok: true }, origin);
};
