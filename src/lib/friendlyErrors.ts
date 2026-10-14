// Converts raw errors (network failures, backend messages, aborts) into
// short, user-centric messages. Never leaks servers, ports, endpoints,
// HTTP codes, or stack traces to the UI.

const TECHNICAL_PATTERN =
  /server|backend|\bapi\b|fetch|network|http\s?\d{3}|status\s?\d{3}|\bjson\b|port\s?\d+|npm run|service worker|endpoint|localhost|request failed|abort|timeout|http\b/i;

const GENERIC_TECHNICAL_LEAD =
  /^(failed to|could not|couldn't|cannot|error:|analysis request failed)/i;

export function toUserMessage(err: unknown, fallback: string): string {
  const raw =
    typeof err === 'string'
      ? err
      : err instanceof Error
        ? err.message
        : (err as { message?: unknown })?.message != null
          ? String((err as { message?: unknown }).message)
          : '';
  const msg = (raw || '').trim();
  if (!msg) return fallback;
  if (TECHNICAL_PATTERN.test(msg)) return fallback;
  if (GENERIC_TECHNICAL_LEAD.test(msg)) return fallback;
  return msg;
}

export const FRIENDLY_ERRORS = {
  analysis: 'We couldn’t complete this check. Please check your connection and try again.',
  image:
    'We couldn’t scan this image right now. Please try again in a moment — or describe it in words and check the text instead.',
  signin: 'We couldn’t sign you in. Please check your details and try again.',
  register: 'We couldn’t create your account. Please try again in a moment.',
  google: 'Google sign-in didn’t work. Please try again.',
  resetSend: 'We couldn’t send the reset email. Please check the address and try again.',
  resetNotFound: 'We couldn’t find an account with that email. Please check it and try again.',
} as const;
