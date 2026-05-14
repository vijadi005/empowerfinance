import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  purpose?: string;
  message?: string;
};

const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'CONTACT_TO'];

function missingEnvVars() {
  return requiredEnvVars.filter((key) => !process.env[key]);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clean(value?: string) {
  return value?.trim() ?? '';
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
  const missing = missingEnvVars();

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Email is not configured. Missing: ${missing.join(', ')}` },
      { status: 500 },
    );
  }

  const payload = (await request.json()) as ContactPayload;
  const name = clean(payload.name);
  const email = clean(payload.email);
  const phone = clean(payload.phone);
  const purpose = clean(payload.purpose);
  const message = clean(payload.message);
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    purpose: escapeHtml(purpose),
    message: escapeHtml(message),
  };

  if (!name || !email || !phone || !purpose || !message) {
    return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const port = Number(process.env.SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_TO,
    replyTo: email,
    subject: `New EmpowerFin enquiry from ${name}`,
    text: [
      'New enquiry from empowerfin.vercel.app',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Finance need: ${purpose}`,
      '',
      'Message:',
      message,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; color: #17201f; line-height: 1.55;">
        <h2 style="margin: 0 0 16px;">New EmpowerFin enquiry</h2>
        <p><strong>Name:</strong> ${safe.name}</p>
        <p><strong>Email:</strong> ${safe.email}</p>
        <p><strong>Phone:</strong> ${safe.phone}</p>
        <p><strong>Finance need:</strong> ${safe.purpose}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${safe.message}</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
