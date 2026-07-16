const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function send(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;
  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") throw new Error("Transactional email is not configured");
    return false;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!response.ok) throw new Error(`Transactional email failed (${response.status})`);
  return true;
}

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${siteUrl()}/verify-email?token=${encodeURIComponent(token)}`;
  await send(email, "Verify your Arete account", `<p>Confirm your email to activate your Arete account.</p><p><a href="${link}">Verify email</a></p><p>This link expires in 24 hours.</p>`);
  return link;
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const link = `${siteUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  await send(email, "Reset your Arete password", `<p>A password reset was requested for your Arete account.</p><p><a href="${link}">Reset password</a></p><p>This link expires in 30 minutes. Ignore this email if you did not request it.</p>`);
  return link;
}
