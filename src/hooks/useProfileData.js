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
    experienceLevel: '',
    preferredDays: [],
    sessionDuration: '',
  },
  personalRecords: [],
}

export function useProfileData(userId) {
  const key = `repit_profile_${userId || 'guest'}`

  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) return { ...DEFAULT, ...JSON.parse(stored) }
    } catch {}
    return DEFAULT
  })

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
