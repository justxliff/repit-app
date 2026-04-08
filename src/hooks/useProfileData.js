import { useState } from 'react'

const DEFAULT = {
  demographic: {
    name: '',
    age: '',
    weight: '',
    weightUnit: 'lbs',
    profilePicture: null,
  },
  preferences: {
    goal: '',
    focus: '',
  },
  personalRecords: [],
}

function loadProfile(key) {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return DEFAULT
    const parsed = JSON.parse(stored)
    return {
      demographic: { ...DEFAULT.demographic, ...(parsed.demographic || {}) },
      preferences: { ...DEFAULT.preferences, ...(parsed.preferences || {}) },
      personalRecords: Array.isArray(parsed.personalRecords) ? parsed.personalRecords : [],
    }
  } catch {
    return DEFAULT
  }
}

export function useProfileData(userId) {
  const key = `repit_profile_${userId || 'guest'}`

  const [profile, setProfile] = useState(() => loadProfile(key))

  function saveSection(section, data) {
    setProfile(prev => {
      const next = { ...prev, [section]: data }
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  return { profile, saveSection }
}
