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

function resizeImage(file, maxSize = 400) {
  return new Promise(resolve => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.src = url
  })
}

function Avatar({ authUser, demographicPicture, onImageChange }) {
  const inputRef = React.useRef(null)
  const picture = demographicPicture || authUser?.profilePicture

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const resized = await resizeImage(file)
    onImageChange(resized)
    e.target.value = ''
  }

  const overlay = (
    <div className="avatar-edit-overlay" onClick={() => inputRef.current?.click()}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
      Edit
    </div>
  )

  return (
    <div className="profile-avatar-wrap" onClick={() => inputRef.current?.click()}>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      {picture
        ? <img className="profile-avatar" src={picture} alt="Profile" onError={e => { e.target.style.display = 'none' }} />
        : (() => {
            const name = authUser?.name || ''
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
            return <div className="profile-avatar-placeholder">{initials}</div>
          })()
      }
      {overlay}
    </div>
  )
}

export default function UserProfilePage({ onNavigate }) {
  const { user } = useAuth()
  const { profile, saveSection } = useProfileData(user?.email)
  const [activeSection, setActiveSection] = useState(null)

  if (!user) return null

  const displayName = profile.demographic.name || user.name
  const activeTile = TILES.find(t => t.id === activeSection)

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <Avatar
          authUser={user}
          demographicPicture={profile.demographic.profilePicture}
          onImageChange={pic => saveSection('demographic', { ...profile.demographic, profilePicture: pic })}
        />
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
      </div>
    </div>
  )
}
