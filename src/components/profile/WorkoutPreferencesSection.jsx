import React, { useState } from 'react'

const GOALS = ['Weight Loss', 'Muscle Gain', 'Endurance', 'General Fitness', 'Flexibility']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DURATIONS = ['15 min', '30 min', '45 min', '60 min', '90+ min']

export default function WorkoutPreferencesSection({ data, onSave }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(data)

  function handleCancel() {
    setForm(data)
    setEditing(false)
  }

  function handleSave() {
    onSave(form)
    setEditing(false)
  }

  function toggleDay(day) {
    setForm(f => ({
      ...f,
      preferredDays: f.preferredDays.includes(day)
        ? f.preferredDays.filter(d => d !== day)
        : [...f.preferredDays, day],
    }))
  }

  if (editing) {
    return (
      <div className="section-content">
        <div className="form-row">
          <label>Primary Goal</label>
          <div className="chip-group">
            {GOALS.map(g => (
              <button
                key={g}
                type="button"
                className={`chip ${form.goal === g ? 'chip-selected' : ''}`}
                onClick={() => setForm(f => ({ ...f, goal: f.goal === g ? '' : g }))}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label>Experience Level</label>
          <div className="chip-group">
            {LEVELS.map(l => (
              <button
                key={l}
                type="button"
                className={`chip ${form.experienceLevel === l ? 'chip-selected' : ''}`}
                onClick={() => setForm(f => ({ ...f, experienceLevel: f.experienceLevel === l ? '' : l }))}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label>Preferred Workout Days</label>
          <div className="chip-group">
            {DAYS.map(d => (
              <button
                key={d}
                type="button"
                className={`chip chip-day ${form.preferredDays.includes(d) ? 'chip-selected' : ''}`}
                onClick={() => toggleDay(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label>Session Duration</label>
          <div className="chip-group">
            {DURATIONS.map(d => (
              <button
                key={d}
                type="button"
                className={`chip ${form.sessionDuration === d ? 'chip-selected' : ''}`}
                onClick={() => setForm(f => ({ ...f, sessionDuration: f.sessionDuration === d ? '' : d }))}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="section-actions">
          <button className="btn-save-section" onClick={handleSave}>Save</button>
          <button className="btn-cancel-section" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="section-content">
      <div className="detail-list">
        <div className="detail-row">
          <span className="detail-label">Primary Goal</span>
          <span className="detail-value">{data.goal || '—'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Experience Level</span>
          <span className="detail-value">{data.experienceLevel || '—'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Preferred Days</span>
          <span className="detail-value">
            {data.preferredDays?.length ? data.preferredDays.join(', ') : '—'}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Session Duration</span>
          <span className="detail-value">{data.sessionDuration || '—'}</span>
        </div>
      </div>
      <button className="btn-edit-section" onClick={() => { setForm(data); setEditing(true) }}>Edit</button>
    </div>
  )
}
