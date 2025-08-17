// api/send-feedback.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, email, message } = (req.body ?? {}) as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "RESEND_API_KEY not set" });
    }

    const to = process.env.FEEDBACK_TO_EMAIL;
    if (!to) {
      return res.status(500).json({ error: "FEEDBACK_TO_EMAIL not set" });
    }

    const from = process.env.FEEDBACK_FROM_EMAIL || "EngliBot <onboarding@resend.dev>";
    const resend = new Resend(apiKey);
await resend.emails.send({
  from,
  to,
  replyTo: email, // ← cambia esto
  subject: `Nuevo testimonio - ${name}`,
  html: `
    <h2>Nuevo testimonio de EngliBot A2</h2>
    <p><strong>Nombre:</strong> ${esc(name)}</p>
    <p><strong>Email:</strong> ${esc(email)}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${esc(message).replace(/\n/g, "<br/>")}</p>
  `,
});

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
