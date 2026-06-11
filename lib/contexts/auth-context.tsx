"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
}

interface StoredUser extends User {
  password: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => { ok: boolean; error?: string }
  register: (username: string, email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
  updateUser: (patch: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USERS_KEY = "plush_users"
const SESSION_KEY = "plush_session"

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const sessionId = localStorage.getItem(SESSION_KEY)
      if (sessionId) {
        const found = readUsers().find((u) => u.id === sessionId)
        if (found) {
          const { password: _pw, ...safe } = found
          setUser(safe)
        }
      }
    } catch {
      // ignore
    }
    setIsLoading(false)
  }, [])

  const register = (username: string, email: string, password: string) => {
    const users = readUsers()
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: "该邮箱已被注册" }
    }
    const newUser: StoredUser = {
      id: `u_${Date.now()}`,
      username,
      email,
      password,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    writeUsers(users)
    localStorage.setItem(SESSION_KEY, newUser.id)
    const { password: _pw, ...safe } = newUser
    setUser(safe)
    return { ok: true }
  }

  const login = (email: string, password: string) => {
    const users = readUsers()
    const found = users.find((u) => u.email === email)
    if (!found) return { ok: false, error: "账号不存在，请先注册" }
    if (found.password !== password) return { ok: false, error: "密码错误" }
    localStorage.setItem(SESSION_KEY, found.id)
    const { password: _pw, ...safe } = found
    setUser(safe)
    return { ok: true }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const updateUser = (patch: Partial<User>) => {
    if (!user) return
    const users = readUsers()
    const idx = users.findIndex((u) => u.id === user.id)
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...patch }
      writeUsers(users)
    }
    setUser({ ...user, ...patch })
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
