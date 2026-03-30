import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './RegisterPage.css'

const PROVIDERS = [
  {
    id: 'Google',
    label: 'Continue with Google',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    id: 'Apple',
    label: 'Continue with Apple',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
  },
  {
    id: 'Facebook',
    label: 'Continue with Facebook',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
]

function getFirebaseErrorMessage(code) {
  switch (code) {
    case 'auth/email-already-in-use': return 'An account with this email already exists.'
    case 'auth/invalid-email': return 'Please enter a valid email address.'
    case 'auth/weak-password': return 'Password must be at least 6 characters.'
    case 'auth/popup-closed-by-user': return 'Sign-in popup was closed. Please try again.'
    case 'auth/account-exists-with-different-credential': return 'An account already exists with a different sign-in method.'
    case 'auth/popup-blocked': return 'Popup was blocked by your browser. Please allow popups and try again.'
    default: return 'Registration failed. Please try again.'
  }
}

export default function RegisterPage() {
  const { registerWithEmail, registerWithProvider } = useAuth()

  const [view, setView] = useState('options')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loadingProvider, setLoadingProvider] = useState(null)
  const [emailLoading, setEmailLoading] = useState(false)

  async function handleEmailSubmit(e) {
    e.preventDefault()
    setError('')
    setEmailLoading(true)
    try {
      await registerWithEmail(email, password)
    } catch (err) {
      setError(err.code ? getFirebaseErrorMessage(err.code) : err.message)
    } finally {
      setEmailLoading(false)
    }
  }

  async function handleProviderClick(providerId) {
    if (providerId === 'Apple') {
      setError('Apple sign-in is not yet configured. Please use Google, Facebook, or Email.')
      return
    }
    setError('')
    setLoadingProvider(providerId)
    try {
      await registerWithProvider(providerId)
    } catch (err) {
      setError(err.code ? getFirebaseErrorMessage(err.code) : err.message)
      setLoadingProvider(null)
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-logo">
          <span className="register-logo-icon">💪</span>
          <span className="register-logo-text">RepIt</span>
        </div>
        <h1 className="register-title">Create your account</h1>
        <p className="register-subtitle">Start tracking your workouts today</p>

        {error && (
          <div className="register-error" role="alert">
            <span className="register-error-icon">⚠</span>
            {error}
          </div>
        )}

        {view === 'options' && (
          <>
            <div className="provider-list">
              {PROVIDERS.map(p => (
                <button
                  key={p.id}
                  className={`provider-btn ${loadingProvider === p.id ? 'loading' : ''}`}
                  onClick={() => handleProviderClick(p.id)}
                  disabled={loadingProvider !== null}
                >
                  <span className="provider-icon">{p.icon}</span>
                  <span>{loadingProvider === p.id ? `Connecting to ${p.id}…` : p.label}</span>
                </button>
              ))}
            </div>

            <div className="register-divider">
              <span>or</span>
            </div>

            <button
              className="btn-email-toggle"
              onClick={() => { setView('email'); setError('') }}
              disabled={loadingProvider !== null}
            >
              Register with Email
            </button>
          </>
        )}

        {view === 'email' && (
          <form className="email-form" onSubmit={handleEmailSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                disabled={emailLoading}
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={emailLoading}
              />
            </div>
            <button type="submit" className="btn-register-email" disabled={emailLoading}>
              {emailLoading ? 'Creating account…' : 'Create Account'}
            </button>
            <button
              type="button"
              className="btn-back"
              onClick={() => { setView('options'); setError('') }}
              disabled={emailLoading}
            >
              ← Back to options
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
