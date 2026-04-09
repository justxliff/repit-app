import React, { useState } from 'react'
import { useAuth } from './context/AuthContext'
import RegisterPage from './pages/RegisterPage'
import UserProfilePage from './pages/UserProfilePage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import WorkoutCreationPage from './pages/WorkoutCreationPage'
import './App.css'

const NAV_TABS = [
  {
    id: 'profile',
    label: 'Profile',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'workouts',
    label: 'Workouts',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4v16M18 4v16M3 8h4M17 8h4M3 16h4M17 16h4" />
      </svg>
    ),
  },
  {
    id: 'exercises',
    label: 'Exercises',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <circle cx="3" cy="6" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="3" cy="18" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

const EXERCISES = [
  { id: 1, name: 'Push-ups', category: 'Chest', muscles: 'Chest, Triceps, Shoulders' },
  { id: 2, name: 'Pull-ups', category: 'Back', muscles: 'Lats, Biceps' },
  { id: 3, name: 'Squats', category: 'Legs', muscles: 'Quads, Glutes, Hamstrings' },
  { id: 4, name: 'Deadlift', category: 'Full Body', muscles: 'Hamstrings, Glutes, Back' },
  { id: 5, name: 'Bench Press', category: 'Chest', muscles: 'Chest, Triceps' },
  { id: 6, name: 'Overhead Press', category: 'Shoulders', muscles: 'Shoulders, Triceps' },
  { id: 7, name: 'Plank', category: 'Core', muscles: 'Core, Shoulders' },
  { id: 8, name: 'Lunges', category: 'Legs', muscles: 'Quads, Glutes' },
]

const SAMPLE_WORKOUTS = [
  { id: 1, name: 'Upper Body Day', date: '2026-03-25', exercises: ['Push-ups', 'Pull-ups', 'Overhead Press'], duration: 45 },
  { id: 2, name: 'Leg Day', date: '2026-03-23', exercises: ['Squats', 'Lunges', 'Deadlift'], duration: 50 },
  { id: 3, name: 'Core & Cardio', date: '2026-03-21', exercises: ['Plank', 'Push-ups'], duration: 30 },
]

export default function App() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [workouts, setWorkouts] = useState(SAMPLE_WORKOUTS)
  const [showAddWorkout, setShowAddWorkout] = useState(false)
  const [newWorkout, setNewWorkout] = useState({ name: '', duration: '', exercises: [] })

  if (!user) {
    return <RegisterPage />
  }

  if (user.provider === 'password' && !user.emailVerified) {
    return <VerifyEmailPage />
  }

  const totalWorkouts = workouts.length
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0)
  const thisWeek = workouts.filter(w => {
    const d = new Date(w.date)
    const now = new Date()
    const diff = (now - d) / (1000 * 60 * 60 * 24)
    return diff <= 7
  }).length

  function handleAddWorkout(e) {
    e.preventDefault()
    const workout = {
      id: Date.now(),
      name: newWorkout.name,
      date: new Date().toISOString().split('T')[0],
      exercises: newWorkout.exercises,
      duration: parseInt(newWorkout.duration) || 0,
    }
    setWorkouts([workout, ...workouts])
    setNewWorkout({ name: '', duration: '', exercises: [] })
    setShowAddWorkout(false)
  }

  function toggleExercise(name) {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.includes(name)
        ? prev.exercises.filter(e => e !== name)
        : [...prev.exercises, name],
    }))
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">💪</span>
            <span className="logo-text">RepIt</span>
          </div>
          <nav className="nav">
            {NAV_TABS.map(tab => (
              <button
                key={tab.id}
                className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                aria-label={tab.label}
              >
                {tab.icon}
              </button>
            ))}
          </nav>
          <button className="btn-power" onClick={logout} title="Sign out">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      <main className="main">
        {activeTab === 'profile' && (
          <UserProfilePage onNavigate={setActiveTab} />
        )}

        {activeTab === 'dashboard' && (
          <div className="page">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user.name}! Keep pushing.</p>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{totalWorkouts}</div>
                <div className="stat-label">Total Workouts</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{thisWeek}</div>
                <div className="stat-label">This Week</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{totalMinutes}</div>
                <div className="stat-label">Total Minutes</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{EXERCISES.length}</div>
                <div className="stat-label">Exercises</div>
              </div>
            </div>

            <h2 className="section-title">Recent Workouts</h2>
            <div className="workout-list">
              {workouts.slice(0, 3).map(w => (
                <div key={w.id} className="workout-card">
                  <div className="workout-info">
                    <div className="workout-name">{w.name}</div>
                    <div className="workout-meta">{w.date} &middot; {w.duration} min</div>
                    <div className="workout-exercises">{w.exercises.join(', ')}</div>
                  </div>
                  <div className="workout-duration">{w.duration}<span>min</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'workouts' && (
          <WorkoutCreationPage />
        )}

        {activeTab === 'exercises' && (
          <div className="page">
            <h1 className="page-title">Exercise Library</h1>
            <p className="page-subtitle">Browse available exercises</p>
            <div className="exercises-grid">
              {EXERCISES.map(ex => (
                <div key={ex.id} className="exercise-card">
                  <div className="exercise-category">{ex.category}</div>
                  <div className="exercise-name">{ex.name}</div>
                  <div className="exercise-muscles">{ex.muscles}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
