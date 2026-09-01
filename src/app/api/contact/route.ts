import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { profile } from "@/data/portfolio";

// Required env var (set in .env.local for dev, and in your host's
// environment variable dashboard for production):
//   GMAIL_APP_PASSWORD — a 16-character App Password for profile.email's Gmail account
//                        (Google Account → Security → 2-Step Verification → App passwords)
//
// The sending address itself is profile.email — it's already public
// everywhere on the site (Contact section, footer, mailto links), so there's
// no need to duplicate it as a "secret" env var. Netlify (and similar hosts)
// scan deploy env vars against build output and fail the build if a var's
// value shows up anywhere — which it always would here, since the address
// is meant to be public.

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are all required." }, { status: 400 });
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "One of the fields is too long." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const user = profile.email;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!pass) {
    console.error("Contact form: GMAIL_APP_PASSWORD is not configured.");
    return NextResponse.json(
      { error: "The contact form isn't configured yet. Please email directly instead." },
      { status: 500 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${user}>`,
      to: profile.email,
      replyTo: `"${name}" <${email}>`,
      subject: `Portfolio inquiry from ${name}`,
      text: `${message}\n\n— ${name} (${email})`,
      html: `
        <div style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #222;">
          <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
          <p style="color: #666; font-size: 13px;">
            From <strong>${escapeHtml(name)}</strong> — ${escapeHtml(email)}<br/>
            Sent from the portfolio contact form
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form: failed to send email.", err);
    return NextResponse.json(
      { error: "Couldn't send your message right now. Please try again in a moment." },
      { status: 502 }
    );
  }
}
