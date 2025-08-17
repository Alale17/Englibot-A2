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

  // Asegura body parseado (por si llega string)
  let body = req.body ?? {};
  if (typeof body === "string") {
    try { body = JSON.parse(body || "{}"); } catch { body = {}; }
  }

  const { name, email, message } = (body ?? {}) as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.FEEDBACK_TO_EMAIL; // <- tu correo en env
    const from =
      process.env.FEEDBACK_FROM_EMAIL || "EngliBot <onboarding@resend.dev>";

    if (!apiKey) return res.status(500).json({ error: "RESEND_API_KEY not set" });
    if (!to) return res.status(500).json({ error: "FEEDBACK_TO_EMAIL not set" });

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from,
      to: [to as string],         // arrays evitan problemas de tipos
      replyTo: [email as string],
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
    console.error("RESEND_ERROR", err);
    const isPreview = process.env.VERCEL_ENV !== "production";
    if (isPreview) {
      return res.status(500).json({ error: err?.message || String(err), details: err });
    }
    return res.status(500).json({ error: "Failed to send email" });
  }
}
