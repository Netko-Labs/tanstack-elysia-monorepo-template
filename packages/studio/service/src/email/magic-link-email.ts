/**
 * Table-safe HTML magic-link email. Kept as a plain string builder (no extra
 * backend deps); swap in @react-email if you prefer JSX templates.
 */
export function renderMagicLinkEmail(url: string): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#0b1120;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#111827;border:1px solid #1f2937;border-radius:12px;">
      <tr><td style="padding:32px;">
        <h1 style="margin:0 0 8px;color:#f9fafb;font-size:22px;">Sign in to Studio</h1>
        <p style="margin:0 0 24px;color:#9ca3af;font-size:14px;line-height:1.5;">
          Click the button below to sign in. This link expires in 10 minutes and can only be used once.
        </p>
        <a href="${url}" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:8px;">
          Sign in
        </a>
        <p style="margin:24px 0 0;color:#6b7280;font-size:12px;line-height:1.5;">
          If the button doesn't work, copy this link into your browser:<br />
          <span style="color:#818cf8;word-break:break-all;">${url}</span>
        </p>
      </td></tr>
    </table>
  </body>
</html>`
}
