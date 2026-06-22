// Runs once when the server boots — validates that critical environment
// variables are present so misconfiguration fails loudly instead of at
// the first request (or silently in production).
export async function register() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_PASSWORD',
    'ADMIN_JWT_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `\n[X-BOSS] ⚠️  Missing required environment variables:\n  - ${missing.join('\n  - ')}\n` +
        `Set these in .env.local (local) or your Vercel project settings (production).\n`,
    );
  }

  // Optional but recommended — warn if notifications won't work
  const optional = ['CALLMEBOT_PHONE', 'CALLMEBOT_APIKEY', 'NEXT_PUBLIC_BASE_URL'];
  const missingOptional = optional.filter((key) => !process.env[key]);
  if (missingOptional.length > 0) {
    console.warn(`[X-BOSS] Note: optional vars not set (${missingOptional.join(', ')}). Some features may be limited.`);
  }
}
