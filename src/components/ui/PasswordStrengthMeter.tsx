import { validatePassword } from '../../lib/password'

interface Props {
  password: string
}

export default function PasswordStrengthMeter({ password }: Props) {
  if (!password) return null

  const strength = validatePassword(password)

  return (
    <div className="mt-2 text-xs font-sans space-y-1.5">
      {/* Progress Bar */}
      <div className="flex gap-1 h-1.5 w-full bg-[var(--line)] rounded-full overflow-hidden">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className="flex-1 transition-all duration-300"
            style={{
              background: step <= strength.score ? strength.color : 'transparent',
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono">
        <span style={{ color: 'var(--ink-soft)' }}>Strength:</span>
        <span className="font-semibold" style={{ color: strength.color }}>
          {strength.label}
        </span>
      </div>

      {/* Rules Checkboxes */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] pt-1" style={{ color: 'var(--ink-soft)' }}>
        <div className="flex items-center gap-1">
          <span style={{ color: strength.hasMinLength ? 'var(--safe)' : 'var(--ink-soft)' }}>
            {strength.hasMinLength ? '✓' : '○'}
          </span>
          Min 8 chars
        </div>
        <div className="flex items-center gap-1">
          <span style={{ color: strength.hasUpper ? 'var(--safe)' : 'var(--ink-soft)' }}>
            {strength.hasUpper ? '✓' : '○'}
          </span>
          Uppercase (A-Z)
        </div>
        <div className="flex items-center gap-1">
          <span style={{ color: strength.hasLower ? 'var(--safe)' : 'var(--ink-soft)' }}>
            {strength.hasLower ? '✓' : '○'}
          </span>
          Lowercase (a-z)
        </div>
        <div className="flex items-center gap-1">
          <span style={{ color: strength.hasNumber ? 'var(--safe)' : 'var(--ink-soft)' }}>
            {strength.hasNumber ? '✓' : '○'}
          </span>
          Number (0-9)
        </div>
        <div className="col-span-2 flex items-center gap-1">
          <span style={{ color: strength.hasSpecial ? 'var(--safe)' : 'var(--ink-soft)' }}>
            {strength.hasSpecial ? '✓' : '○'}
          </span>
          Special symbol (!@#$%^&*)
        </div>
      </div>
    </div>
  )
}
