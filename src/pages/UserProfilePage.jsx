import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProfileData } from '../hooks/useProfileData'
import DemographicSection from '../components/profile/DemographicSection'
import WorkoutPreferencesSection from '../components/profile/WorkoutPreferencesSection'
import PersonalRecordsSection from '../components/profile/PersonalRecordsSection'
import './UserProfilePage.css'

const SECTIONS = [
  { id: 'demographic', label: 'Demographic Info' },
  { id: 'preferences', label: 'Workout Preferences' },
  { id: 'personalRecords', label: 'Personal Records' },
]

function Avatar({ authUser, demographicPicture }) {
  const picture = demographicPicture || authUser?.profilePicture
  if (picture) {
    return <img className="profile-avatar" src={picture} alt="Profile" onError={e => { e.target.style.display = 'none' }} />
  }
  const name = authUser?.name || ''
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
  return <div className="profile-avatar-placeholder">{initials}</div>
}

export default function UserProfilePage({ onNavigate }) {
  const { user, logout } = useAuth()
  const { profile, saveSection } = useProfileData(user?.email)
  const [activeSection, setActiveSection] = useState('demographic')

  if (!user) return null

  const displayName = profile.demographic.name || user.name

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <Avatar authUser={user} demographicPicture={profile.demographic.profilePicture} />
        <h1 className="profile-name">{displayName}</h1>
        {user.email && <p className="profile-email">{user.email}</p>}
        <span className="profile-provider-badge">
          {user.provider === 'password' ? '✉ Email' : `Connected via ${user.provider}`}
        </span>
      </div>

      <div className="profile-section-nav">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            className={`section-nav-btn ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="profile-section-body">
        {activeSection === 'demographic' && (
          <DemographicSection
            data={profile.demographic}
            authUser={user}
            onSave={data => saveSection('demographic', data)}
          />
        )}
        {activeSection === 'preferences' && (
          <WorkoutPreferencesSection
            data={profile.preferences}
            onSave={data => saveSection('preferences', data)}
          />
        )}
        {activeSection === 'personalRecords' && (
          <PersonalRecordsSection
            data={profile.personalRecords}
            onSave={data => saveSection('personalRecords', data)}
          />
        )}
      </div>

      <div className="profile-footer-actions">
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
