// api/send-feedback.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

type FeedbackPayload = { name: string; email: string; message: string };

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Valida y parsea body sin usar `any`
function parseBody(input: unknown): FeedbackPayload | null {
  let data: unknown = input;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch { return null; }
  }
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const { name, email, message } = obj;
    if (typeof name === "string" && typeof email === "string" && typeof message === "string") {
      return { name, email, message };
    }
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const payload = parseBody(req.body);
  if (!payload) return res.status(400).json({ error: "Missing fields" });

  const { name, email, message } = payload;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.FEEDBACK_TO_EMAIL;
  const from = process.env.FEEDBACK_FROM_EMAIL || "EngliBot <onboarding@resend.dev>";

  if (!apiKey) return res.status(500).json({ error: "RESEND_API_KEY not set" });
  if (!to)     return res.status(500).json({ error: "FEEDBACK_TO_EMAIL not set" });

  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from,
      to: [to],           // array para evitar warnings de tipos
      replyTo: [email],
      subject: `Nuevo testimonio - ${name}`,
      html: `
        <h2>Nuevo testimonio de EngliBot A2</h2>
        <p><strong>Nombre:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${esc(message).replace(/\n/g, "<br/>")}</p>
      `,
    });
    return res.status(200).json({ ok: true, result });
  } catch (err) {
    // `err` es `unknown`; hacemos narrowing seguro
    const msg = err instanceof Error ? err.message : String(err);
    console.error("RESEND_ERROR", err);
    return res.status(500).json({ error: msg });
  }
}
