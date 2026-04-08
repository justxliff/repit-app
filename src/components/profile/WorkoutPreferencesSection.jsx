import React, { useState } from 'react'

const GOALS = ['Weight Loss', 'Body Toning', 'Muscle Gain', 'Flexibility']
const FOCUSES = ['Strength', 'Endurance', 'Explosion']

export default function WorkoutPreferencesSection({ data, onSave }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(data)
  const [errors, setErrors] = useState({})

  function handleCancel() {
    setForm(data)
    setErrors({})
    setEditing(false)
  }

  function validate() {
    const errs = {}
    if (!form.goal) errs.goal = 'Workout goal is required.'
    if (!form.focus) errs.focus = 'Focus is required.'
    return errs
  }

  function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
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
            <span className="section-field-label">Focus</span>
            <span className="section-field-value">{data.focus || '—'}</span>
          </div>
        </div>
        <button className="btn-edit-section" onClick={() => { setForm(data); setErrors({}); setEditing(true) }}>Edit</button>
      </div>
    )
  }

  return (
    <div className="section-edit">
      <div className="form-field">
        <label className="form-label">Workout Goal *</label>
        <div className="pref-option-group">
          {GOALS.map(g => (
            <button
              key={g}
              type="button"
              className={`pref-option-btn ${form.goal === g ? 'pref-option-active' : ''}`}
              onClick={() => setForm(f => ({ ...f, goal: g }))}
            >
              {g}
            </button>
          ))}
        </div>
        {errors.goal && <span className="field-error">{errors.goal}</span>}
      </div>

      <div className="form-field">
        <label className="form-label">Focus *</label>
        <div className="pref-option-group">
          {FOCUSES.map(fc => (
            <button
              key={fc}
              type="button"
              className={`pref-option-btn ${form.focus === fc ? 'pref-option-active' : ''}`}
              onClick={() => setForm(f => ({ ...f, focus: fc }))}
            >
              {fc}
            </button>
          ))}
        </div>
        {errors.focus && <span className="field-error">{errors.focus}</span>}
      </div>

      <div className="section-edit-actions">
        <button className="btn-save-section" onClick={handleSave}>Save</button>
        <button className="btn-cancel-section" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  )
}
