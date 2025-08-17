// api/debug-env.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    vercelEnv: process.env.VERCEL_ENV,
    has_RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
    has_FEEDBACK_TO_EMAIL: Boolean(process.env.FEEDBACK_TO_EMAIL),
    from: process.env.FEEDBACK_FROM_EMAIL || "onboarding@resend.dev",
  });
}