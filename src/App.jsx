import React, { useState } from 'react'
import './App.css'

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
  const [activeTab, setActiveTab] = useState('dashboard')
  const [workouts, setWorkouts] = useState(SAMPLE_WORKOUTS)
  const [showAddWorkout, setShowAddWorkout] = useState(false)
  const [newWorkout, setNewWorkout] = useState({ name: '', duration: '', exercises: [] })

  const totalWorkouts = workouts.length
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0)
  const thisWeek = workouts.filter(w => {
    const d = new Date(w.date)
    const now = new Date('2026-03-26')
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
            {['dashboard', 'workouts', 'exercises'].map(tab => (
              <button
                key={tab}
                className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        {activeTab === 'dashboard' && (
          <div className="page">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back! Keep pushing.</p>
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
          <div className="page">
            <div className="page-header">
              <div>
                <h1 className="page-title">Workouts</h1>
                <p className="page-subtitle">Track and manage your sessions</p>
              </div>
              <button className="btn-primary" onClick={() => setShowAddWorkout(true)}>+ Add Workout</button>
            </div>

            {showAddWorkout && (
              <div className="modal-overlay" onClick={() => setShowAddWorkout(false)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                  <h2 className="modal-title">New Workout</h2>
                  <form onSubmit={handleAddWorkout}>
                    <div className="form-group">
                      <label>Workout Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Upper Body Day"
                        value={newWorkout.name}
                        onChange={e => setNewWorkout({ ...newWorkout, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Duration (minutes)</label>
                      <input
                        type="number"
                        placeholder="e.g. 45"
                        value={newWorkout.duration}
                        onChange={e => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Exercises</label>
                      <div className="exercise-picker">
                        {EXERCISES.map(ex => (
                          <button
                            key={ex.id}
                            type="button"
                            className={`exercise-chip ${newWorkout.exercises.includes(ex.name) ? 'selected' : ''}`}
                            onClick={() => toggleExercise(ex.name)}
                          >
                            {ex.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="modal-actions">
                      <button type="button" className="btn-secondary" onClick={() => setShowAddWorkout(false)}>Cancel</button>
                      <button type="submit" className="btn-primary">Save Workout</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="workout-list">
              {workouts.map(w => (
                <div key={w.id} className="workout-card">
                  <div className="workout-info">
                    <div className="workout-name">{w.name}</div>
                    <div className="workout-meta">{w.date} &middot; {w.duration} min</div>
                    <div className="workout-exercises">{w.exercises.join(', ') || 'No exercises logged'}</div>
                  </div>
                  <div className="workout-duration">{w.duration}<span>min</span></div>
                </div>
              ))}
            </div>
          </div>
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
