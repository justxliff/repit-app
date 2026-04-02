import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut,
  reload,
} from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext(null)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeUser(firebaseUser) {
  return {
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    email: firebaseUser.email,
    profilePicture: firebaseUser.photoURL,
    provider: firebaseUser.providerData?.[0]?.providerId || 'unknown',
    emailVerified: firebaseUser.emailVerified,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser ? normalizeUser(firebaseUser) : null)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function registerWithEmail(email, password) {
    if (!email || !password) throw new Error('Email and password are required.')
    if (!EMAIL_REGEX.test(email)) throw new Error('Please enter a valid email address.')
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await sendEmailVerification(result.user)
    return result
  }

  async function registerWithProvider(provider) {
    const providerMap = {
      Google: new GoogleAuthProvider(),
      Facebook: new FacebookAuthProvider(),
    }
    const authProvider = providerMap[provider]
    if (!authProvider) throw new Error(`Provider "${provider}" is not supported.`)
    return signInWithPopup(auth, authProvider)
  }

  async function resendVerificationEmail() {
    const currentUser = auth.currentUser
    if (currentUser) await sendEmailVerification(currentUser)
  }

  async function refreshUser() {
    const currentUser = auth.currentUser
    if (currentUser) {
      await reload(currentUser)
      setUser(normalizeUser(currentUser))
    }
  }

  function logout() {
    return signOut(auth)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f0f0f',
        color: '#888',
        fontSize: '1rem',
      }}>
        Loading…
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, registerWithEmail, registerWithProvider, resendVerificationEmail, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
