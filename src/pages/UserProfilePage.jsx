import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProfileData } from '../hooks/useProfileData'
import DemographicSection from '../components/profile/DemographicSection'
import WorkoutPreferencesSection from '../components/profile/WorkoutPreferencesSection'
import PersonalRecordsSection from '../components/profile/PersonalRecordsSection'
import './UserProfilePage.css'

const ICON_PROPS = { viewBox: '0 0 24 24', fill: 'none', stroke: '#ff5722', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round' }

const ICONS = {
  demographic: (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="7" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  preferences: (
    <svg {...ICON_PROPS}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  ),
  personalRecords: (
    <svg {...ICON_PROPS}>
      <path d="M8 21h8M12 17v4" />
      <path d="M5 3h14v6c0 3.9-3.1 7-7 7s-7-3.1-7-7V3z" />
      <path d="M5 6H2v1c0 2.2 1.3 4 3 4.5M19 6h3v1c0 2.2-1.3 4-3 4.5" />
    </svg>
  ),
}

const TILES = [
  {
    id: 'demographic',
    label: 'Demographic Info',
    summary: (profile) => {
      const d = profile.demographic
      const parts = []
      if (d.name) parts.push(d.name)
      if (d.age) parts.push(`Age ${d.age}`)
      if (d.weight) parts.push(`${d.weight} ${d.weightUnit}`)
      return parts.length ? parts.join(' · ') : 'Not set up yet'
    },
  },
  {
    id: 'preferences',
    label: 'Workout Preferences',
    summary: (profile) => {
      const p = profile.preferences
      const parts = []
      if (p.goal) parts.push(p.goal)
      if (p.experienceLevel) parts.push(p.experienceLevel)
      if (p.preferredDays?.length) parts.push(`${p.preferredDays.length} days/wk`)
      return parts.length ? parts.join(' · ') : 'Not set up yet'
    },
  },
  {
    id: 'personalRecords',
    label: 'Personal Records',
    summary: (profile) => {
      const count = profile.personalRecords?.length || 0
      return count === 0 ? 'No records yet' : `${count} record${count !== 1 ? 's' : ''} saved`
    },
  },
]

function Avatar({ authUser, demographicPicture }) {
  const picture = demographicPicture || authUser?.profilePicture
  if (picture) {
    return (
      <div className="profile-avatar-wrap">
        <img className="profile-avatar" src={picture} alt="Profile" onError={e => { e.target.style.display = 'none' }} />
      </div>
    )
  }
  const name = authUser?.name || ''
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
  return (
    <div className="profile-avatar-wrap">
      <div className="profile-avatar-placeholder">{initials}</div>
    </div>
  )
}

export default function UserProfilePage({ onNavigate }) {
  const { user, logout } = useAuth()
  const { profile, saveSection } = useProfileData(user?.email)
  const [activeSection, setActiveSection] = useState(null)

  if (!user) return null

  const displayName = profile.demographic.name || user.name
  const activeTile = TILES.find(t => t.id === activeSection)

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <Avatar authUser={user} demographicPicture={profile.demographic.profilePicture} />
        <h1 className="profile-name">{displayName}</h1>
        {user.email && <p className="profile-email">{user.email}</p>}
      </div>

      {!activeSection ? (
        <div className="profile-tiles">
          {TILES.map(tile => (
            <button
              key={tile.id}
              className="profile-tile"
              onClick={() => setActiveSection(tile.id)}
            >
              <span className="tile-label">{tile.label}</span>
              <span className="tile-icon">{ICONS[tile.id]}</span>
              <span className="tile-summary">{tile.summary(profile)}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="profile-section-body">
          <button className="btn-back" onClick={() => setActiveSection(null)}>
            ‹ Back
          </button>
          <div className="section-header">
            <span className="section-header-icon">{activeTile.icon}</span>
            <h2 className="section-header-label">{activeTile.label}</h2>
          </div>

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
      )}

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
