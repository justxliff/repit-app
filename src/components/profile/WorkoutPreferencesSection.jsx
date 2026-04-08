import React, { useState } from 'react'

const GOALS = ['Lose Weight', 'Build Muscle', 'Improve Endurance', 'Increase Strength', 'Stay Active']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DURATIONS = ['30 min', '45 min', '60 min', '75 min', '90+ min']

export default function WorkoutPreferencesSection({ data, onSave }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(data)

  function handleCancel() {
    setForm(data)
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

  function handleSave() {
    onSave(form)
    setEditing(false)
  }

  if (!editing) {
    return (
      <div className="section-view">
        <div className="section-fields">
          <div className="section-field-row">
            <span className="section-field-label">Goal</span>
            <span className="section-field-value">{data.goal || '—'}</span>
          </div>
          <div className="section-field-row">
            <span className="section-field-label">Experience</span>
            <span className="section-field-value">{data.experienceLevel || '—'}</span>
          </div>
          <div className="section-field-row">
            <span className="section-field-label">Preferred Days</span>
            <span className="section-field-value">{data.preferredDays?.length ? data.preferredDays.join(', ') : '—'}</span>
          </div>
          <div className="section-field-row">
            <span className="section-field-label">Session Length</span>
            <span className="section-field-value">{data.sessionDuration || '—'}</span>
          </div>
        </div>
        <button className="btn-edit-section" onClick={() => { setForm(data); setEditing(true) }}>Edit</button>
      </div>
    )
  }

  return (
    <div className="section-edit">
      <div className="form-field">
        <label className="form-label">Goal</label>
        <select className="form-select" value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}>
          <option value="">Select a goal</option>
          {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className="form-field">
        <label className="form-label">Experience Level</label>
        <select className="form-select" value={form.experienceLevel} onChange={e => setForm(f => ({ ...f, experienceLevel: e.target.value }))}>
          <option value="">Select level</option>
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="form-field">
        <label className="form-label">Preferred Days</label>
        <div className="day-picker">
          {DAYS.map(day => (
            <button
              key={day}
              type="button"
              className={`day-btn ${form.preferredDays.includes(day) ? 'day-btn-active' : ''}`}
              onClick={() => toggleDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Session Duration</label>
        <select className="form-select" value={form.sessionDuration} onChange={e => setForm(f => ({ ...f, sessionDuration: e.target.value }))}>
          <option value="">Select duration</option>
          {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="section-edit-actions">
        <button className="btn-save-section" onClick={handleSave}>Save</button>
        <button className="btn-cancel-section" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  )
}
