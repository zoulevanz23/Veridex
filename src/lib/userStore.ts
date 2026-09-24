export interface UserHistoryItem {
  id: string
  query: string
  verdict: string
  timestamp: string
}

export interface StoredUser {
  id: string
  name: string
  email: string
  passwordHash?: string
  provider: 'email' | 'google'
  avatar?: string
  createdAt: string
  usageCount: number
  history: UserHistoryItem[]
}

const USERS_DB_KEY = 'veridex_users_db_v1'

// Simple hash helper to emulate credential hashing
function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return 'vx_hash_' + Math.abs(hash).toString(36) + '_' + btoa(password.slice(0, 4))
}

// Initial seed users
const INITIAL_USERS: StoredUser[] = [
  {
    id: 'usr_demo_1',
    name: 'Demo Investigator',
    email: 'demo@veridex.ai',
    passwordHash: hashPassword('Veridex2026!'),
    provider: 'email',
    createdAt: new Date().toISOString(),
    usageCount: 14,
    history: [
      {
        id: 'h_1',
        query: 'https://paypa1-verify-account.xyz/login',
        verdict: 'SCAM',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
  },
  {
    id: 'usr_google_1',
    name: 'Alex Rivers',
    email: 'alex.rivers@gmail.com',
    provider: 'google',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
    usageCount: 8,
    history: [],
  },
]

export function getUsersDB(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY)
    if (!raw) {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(INITIAL_USERS))
      return INITIAL_USERS
    }
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to parse users database', e)
    return INITIAL_USERS
  }
}

export function saveUsersDB(users: StoredUser[]): void {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users))
  } catch (e) {
    console.error('Failed to save users database', e)
  }
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const users = getUsersDB()
  const cleanEmail = email.trim().toLowerCase()
  return users.find((u) => u.email.toLowerCase() === cleanEmail)
}

export function updateUserPassword(email: string, newPassword: string): void {
  const users = getUsersDB()
  const cleanEmail = email.trim().toLowerCase()
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail)
  if (!user) {
    throw new Error('No user found with this email address.')
  }
  user.passwordHash = hashPassword(newPassword)
  saveUsersDB(users)
}

export function registerEmailUser(params: { name: string; email: string; password?: string }): StoredUser {
  const users = getUsersDB()
  const cleanEmail = params.email.trim().toLowerCase()

  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail)
  if (existing) {
    throw new Error('An account with this email already exists. Please sign in instead.')
  }

  const newUser: StoredUser = {
    id: 'usr_' + Math.random().toString(36).substring(2, 10),
    name: params.name.trim(),
    email: cleanEmail,
    passwordHash: params.password ? hashPassword(params.password) : undefined,
    provider: 'email',
    createdAt: new Date().toISOString(),
    usageCount: 0,
    history: [],
  }

  users.push(newUser)
  saveUsersDB(users)
  return newUser
}

export function authenticateEmailUser(email: string, password?: string): StoredUser {
  const cleanEmail = email.trim().toLowerCase()
  const user = findUserByEmail(cleanEmail)

  if (!user) {
    throw new Error('No account found with this email address. Please register.')
  }

  if (user.provider === 'google' && !user.passwordHash) {
    throw new Error('This email is registered via Google Sign-In. Please click "Sign in with Google".')
  }

  if (password && user.passwordHash) {
    const hash = hashPassword(password)
    if (user.passwordHash !== hash) {
      throw new Error('Incorrect password. Please try again or click "Forgot password?".')
    }
  }

  return user
}

export function authenticateOrRegisterGoogleUser(profile: {
  name: string
  email: string
  avatar?: string
}): StoredUser {
  const users = getUsersDB()
  const cleanEmail = profile.email.trim().toLowerCase()

  let user = users.find((u) => u.email.toLowerCase() === cleanEmail)

  if (user) {
    // Update avatar or name if updated
    user.name = profile.name || user.name
    user.avatar = profile.avatar || user.avatar
    saveUsersDB(users)
    return user
  }

  // Create new Google user record
  const newUser: StoredUser = {
    id: 'usr_g_' + Math.random().toString(36).substring(2, 10),
    name: profile.name,
    email: cleanEmail,
    provider: 'google',
    avatar: profile.avatar || 'https://lh3.googleusercontent.com/a/default-user',
    createdAt: new Date().toISOString(),
    usageCount: 0,
    history: [],
  }

  users.push(newUser)
  saveUsersDB(users)
  return newUser
}

export function recordUserCheck(userId: string, query: string, verdict: string): StoredUser | null {
  const users = getUsersDB()
  const index = users.findIndex((u) => u.id === userId)
  if (index === -1) return null

  const user = users[index]
  user.usageCount = (user.usageCount || 0) + 1
  if (!user.history) user.history = []
  
  user.history.unshift({
    id: 'h_' + Math.random().toString(36).substring(2, 8),
    query,
    verdict,
    timestamp: new Date().toISOString(),
  })

  saveUsersDB(users)
  return user
}

export function getUserUsage(userId: string): { usageCount: number; history: UserHistoryItem[] } {
  const user = getUsersDB().find((u) => u.id === userId)
  return {
    usageCount: user?.usageCount || 0,
    history: user?.history || [],
  }
}
