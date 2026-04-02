import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './VerifyEmailPage.css'

export default function VerifyEmailPage() {
  const { user, resendVerificationEmail, refreshUser, logout } = useAuth()
  const [resendStatus, setResendStatus] = useState(null)
  const [checking, setChecking] = useState(false)
  const [cooldown, setCooldown] = useState(false)

  async function handleResend() {
    if (cooldown) return
    try {
      await resendVerificationEmail()
      setResendStatus('sent')
      setCooldown(true)
      setTimeout(() => setCooldown(false), 30000)
    } catch {
      setResendStatus('error')
    }
  }

  async function handleCheck() {
    setChecking(true)
    await refreshUser()
    setChecking(false)
  }

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-icon">✉</div>
        <h1 className="verify-title">Check your inbox</h1>
        <p className="verify-body">
          We sent a verification link to <strong>{user?.email}</strong>. Click the link in that email to activate your account.
        </p>

        {resendStatus === 'sent' && (
          <div className="verify-notice success">Verification email resent.</div>
        )}
        {resendStatus === 'error' && (
          <div className="verify-notice error">Something went wrong. Please try again.</div>
        )}

        <button className="btn-check" onClick={handleCheck} disabled={checking}>
          {checking ? 'Checking…' : "I've verified my email"}
        </button>

        <button
          className="btn-resend"
          onClick={handleResend}
          disabled={cooldown}
        >
          {cooldown ? 'Email sent — wait 30s to resend' : 'Resend verification email'}
        </button>

        <button className="btn-signout-verify" onClick={logout}>
          Sign out and use a different account
        </button>
      </div>
    </div>
  )
}
