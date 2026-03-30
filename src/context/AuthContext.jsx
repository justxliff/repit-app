import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PROVIDER_MOCK_USERS = {
  Google: {
    name: 'Google User',
    profilePicture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
    provider: 'Google',
  },
  Apple: {
    name: 'Apple User',
    profilePicture: null,
    provider: 'Apple',
  },
  Facebook: {
    name: 'Facebook User',
    profilePicture: 'https://graph.facebook.com/me/picture?type=normal',
    provider: 'Facebook',
  },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  function registerWithEmail(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required.')
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new Error('Please enter a valid email address.')
    }
    setUser({
      name: email.split('@')[0],
      email,
      profilePicture: null,
      provider: 'Email',
    })
  }

  async function registerWithProvider(provider) {
    await new Promise(resolve => setTimeout(resolve, 1200))
    const mockUser = PROVIDER_MOCK_USERS[provider]
    if (!mockUser) throw new Error(`Unknown provider: ${provider}`)
    setUser({ ...mockUser, email: null })
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, registerWithEmail, registerWithProvider, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
