export interface PasswordStrength {
  score: number // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong'
  color: string
  hasMinLength: boolean
  hasUpper: boolean
  hasLower: boolean
  hasNumber: boolean
  hasSpecial: boolean
  isValid: boolean
}

export function validatePassword(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  const passedCriteria = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length

  let score = 0
  let label: PasswordStrength['label'] = 'Weak'
  let color = 'var(--scam, #dc2626)'

  if (passedCriteria <= 2) {
    score = 1
    label = 'Weak'
    color = 'var(--scam, #dc2626)'
  } else if (passedCriteria === 3) {
    score = 2
    label = 'Fair'
    color = 'var(--suspicious, #d97706)'
  } else if (passedCriteria === 4) {
    score = 3
    label = 'Good'
    color = '#2563eb'
  } else if (passedCriteria === 5) {
    score = 4
    label = 'Strong'
    color = 'var(--safe, #16a34a)'
  }

  const isValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial

  return {
    score,
    label,
    color,
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    isValid
  }
}
