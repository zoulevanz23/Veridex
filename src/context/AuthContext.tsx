import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
  type StoredUser,
  authenticateEmailUser,
  registerEmailUser,
  authenticateOrRegisterGoogleUser,
  recordUserCheck,
  getUserUsage,
} from '../lib/userStore'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  provider?: 'email' | 'google'
  usageCount?: number
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  credits: number
  hasUnlimitedCredits: boolean
  usageCount: number
  consumeCredit: (query?: string, verdict?: string) => { success: boolean; remaining: number }
  login: (email: string, password?: string, rememberMe?: boolean) => Promise<User>
  googleLogin: (profile: { name: string; email: string; avatar?: string; googleId?: string }) => Promise<User>
  register: (data: { name: string; email: string; password?: string }, rememberMe?: boolean) => Promise<User>
  logout: () => void
  resetPassword: (email: string) => Promise<boolean>
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
}

const GUEST_CREDITS_KEY = 'veridex_guest_credits_v1'
const TOKEN_KEY = 'veridex-auth-token'
const USER_KEY = 'veridex-user'
const DEFAULT_CREDITS = 10

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState<number>(DEFAULT_CREDITS)
  const [usageCount, setUsageCount] = useState<number>(0)
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false)

  // Initialize Auth and Credits from storage
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
    if (savedUser) {
      try {
        const parsed: User = JSON.parse(savedUser)
        setUser(parsed)
        const stats = getUserUsage(parsed.id)
        setUsageCount(stats.usageCount)
      } catch (e) {
        console.error('Failed to parse user session', e)
      }
    }

    // Guest credits
    const savedCredits = localStorage.getItem(GUEST_CREDITS_KEY)
    if (savedCredits !== null) {
      const parsed = parseInt(savedCredits, 10)
      if (!isNaN(parsed)) setCredits(parsed)
    } else {
      localStorage.setItem(GUEST_CREDITS_KEY, String(DEFAULT_CREDITS))
    }
  }, [])

  const isLoggedIn = !!user
  const hasUnlimitedCredits = isLoggedIn

  const setCurrentUserSession = (u: StoredUser, rememberMe: boolean = true) => {
    const activeUser: User = {
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      provider: u.provider,
      usageCount: u.usageCount,
    }

    setUser(activeUser)
    setUsageCount(u.usageCount || 0)

    const token = 'token_' + Math.random().toString(36).substring(2)
    const storage = rememberMe ? localStorage : sessionStorage

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)

    storage.setItem(TOKEN_KEY, token)
    storage.setItem(USER_KEY, JSON.stringify(activeUser))
    setShowAuthModal(false)
  }

  const consumeCredit = (query?: string, verdict?: string): { success: boolean; remaining: number } => {
    if (user) {
      // Record check under user's account
      const updated = recordUserCheck(user.id, query || 'Manual Analysis', verdict || 'SAFE')
      if (updated) {
        setUsageCount(updated.usageCount)
      } else {
        setUsageCount((prev) => prev + 1)
      }
      return { success: true, remaining: Infinity }
    }

    if (credits <= 0) {
      setShowAuthModal(true)
      toast.error('You have used all 10 free credits. Please create an account for unlimited checks.')
      return { success: false, remaining: 0 }
    }

    const next = credits - 1
    setCredits(next)
    localStorage.setItem(GUEST_CREDITS_KEY, String(next))

    if (next === 0) {
      toast('You used your last free credit. Sign up for unlimited checks.')
    } else if (next <= 3) {
      toast(`${next} guest credit${next === 1 ? '' : 's'} remaining`)
    }

    return { success: true, remaining: next }
  }

  const login = async (email: string, password?: string, rememberMe: boolean = true): Promise<User> => {
    // Authenticate against stored user DB
    const storedUser = authenticateEmailUser(email, password)
    setCurrentUserSession(storedUser, rememberMe)
    toast.success(`Welcome back, ${storedUser.name}! Unlimited checks active.`)
    return {
      id: storedUser.id,
      name: storedUser.name,
      email: storedUser.email,
      provider: storedUser.provider,
      avatar: storedUser.avatar,
      usageCount: storedUser.usageCount,
    }
  }

  const googleLogin = async (
    profile: { name: string; email: string; avatar?: string; googleId?: string }
  ): Promise<User> => {
    const storedUser = authenticateOrRegisterGoogleUser(profile)
    setCurrentUserSession(storedUser, true)
    toast.success(`Google Sign-In successful! Welcome, ${storedUser.name}.`)
    return {
      id: storedUser.id,
      name: storedUser.name,
      email: storedUser.email,
      provider: storedUser.provider,
      avatar: storedUser.avatar,
      usageCount: storedUser.usageCount,
    }
  }

  const register = async (
    data: { name: string; email: string; password?: string },
    rememberMe: boolean = true
  ): Promise<User> => {
    const newUser = registerEmailUser(data)
    setCurrentUserSession(newUser, rememberMe)
    toast.success(`Account created! Welcome to Veridex, ${newUser.name}.`)
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      provider: newUser.provider,
      avatar: newUser.avatar,
      usageCount: newUser.usageCount,
    }
  }

  const logout = () => {
    setUser(null)
    setUsageCount(0)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
    toast('Signed out. Switched to guest mode.')
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 600))
    toast.success(`Password reset email sent to ${email}`)
    return true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        credits,
        hasUnlimitedCredits,
        usageCount,
        consumeCredit,
        login,
        googleLogin,
        register,
        logout,
        resetPassword,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
