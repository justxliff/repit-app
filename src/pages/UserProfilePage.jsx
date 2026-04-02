import React from 'react'
import { useAuth } from '../context/AuthContext'
import './UserProfilePage.css'

function Avatar({ user }) {
  if (user.profilePicture) {
    return <img className="profile-avatar" src={user.profilePicture} alt={user.name} onError={e => { e.target.style.display = 'none' }} />
  }
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'
  return <div className="profile-avatar-placeholder">{initials}</div>
}

export default function UserProfilePage({ onNavigate }) {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <Avatar user={user} />
        <h1 className="profile-name">{user.name}</h1>
        {user.email && <p className="profile-email">{user.email}</p>}
        <span className="profile-provider-badge">
          {user.provider === 'Email' ? '✉ Email' : `Connected via ${user.provider}`}
        </span>
      </div>

      <div className="profile-section">
        <h2 className="profile-section-title">Account Details</h2>
        <div className="profile-detail-list">
          <div className="profile-detail-row">
            <span className="profile-detail-label">Name</span>
            <span className="profile-detail-value">{user.name}</span>
          </div>
          {user.email && (
            <div className="profile-detail-row">
              <span className="profile-detail-label">Email</span>
              <span className="profile-detail-value">{user.email}</span>
            </div>
          )}
          <div className="profile-detail-row">
            <span className="profile-detail-label">Registered via</span>
            <span className="profile-detail-value">{user.provider}</span>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn-go-dashboard" onClick={() => onNavigate('dashboard')}>
          Go to Dashboard
        </button>
        <button className="btn-logout" onClick={logout}>
          Sign Out
        </button>
      </div>
    </div>
  )
}
