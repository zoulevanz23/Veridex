// Google OAuth configuration.
// When VITE_GOOGLE_CLIENT_ID is missing (e.g. not set on the hosting
// provider), Google sign-in is disabled and the email/password forms are
// used instead. This must be checked before calling useGoogleLogin —
// initializing Google's client with an empty ID throws at runtime and
// crashes the sign-in/register pages.
export const GOOGLE_CLIENT_ID =
  ((import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || '').trim()

export const isGoogleAuthConfigured = GOOGLE_CLIENT_ID.length > 0
