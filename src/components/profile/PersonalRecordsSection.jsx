import React, { useState } from 'react'

const EMPTY_PR = {
  id: null,
  exercise: '',
  sets: '',
  reps: '',
  useTime: false,
  timeMinutes: '',
  timeSeconds: '',
  weight: '',
  weightUnit: 'lbs',
  date: '',
}

function calcProgress(records, current) {
  const sameExercise = records
    .filter(r => r.id !== current.id && r.exercise.toLowerCase() === current.exercise.toLowerCase())
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  if (!sameExercise.length) return null

  const prev = sameExercise[0]

  const currentVal = current.weight ? +current.weight : current.useTime ? null : +current.reps
  const prevVal = prev.weight ? +prev.weight : prev.useTime ? null : +prev.reps

  if (!currentVal || !prevVal || prevVal === 0) return null

  const pct = ((currentVal - prevVal) / prevVal) * 100
  return pct.toFixed(1)
}

function PRForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!form.exercise.trim()) errs.exercise = 'Exercise name is required.'
    if (!form.useTime && !form.reps) errs.reps = 'Reps is required.'
    if (form.useTime && !form.timeMinutes && !form.timeSeconds)
      errs.time = 'Please enter a time.'
    if (!form.date) errs.date = 'Date is required.'
    return errs
  }

  function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave({ ...form, id: form.id || Date.now() })
  }

  return (
    <div className="pr-form">
      <div className="form-row">
        <label>Exercise <span className="required">*</span></label>
        <input
          type="text"
          value={form.exercise}
          onChange={e => setForm(f => ({ ...f, exercise: e.target.value }))}
          placeholder="e.g. Bench Press"
          className={errors.exercise ? 'input-error' : ''}
        />
        {errors.exercise && <span className="field-error">{errors.exercise}</span>}
      </div>

      <div className="form-row">
        <label>Sets</label>
        <input
          type="number"
          value={form.sets}
          onChange={e => setForm(f => ({ ...f, sets: e.target.value }))}
          placeholder="e.g. 3"
          min="0"
        />
      </div>

      <div className="form-row">
        <label>Reps or Time <span className="required">*</span></label>
        <div className="toggle-row">
          <button
            type="button"
            className={`toggle-btn ${!form.useTime ? 'active' : ''}`}
            onClick={() => setForm(f => ({ ...f, useTime: false }))}
          >Reps</button>
          <button
            type="button"
            className={`toggle-btn ${form.useTime ? 'active' : ''}`}
            onClick={() => setForm(f => ({ ...f, useTime: true }))}
          >Time</button>
        </div>
        {!form.useTime ? (
          <input
            type="number"
            value={form.reps}
            onChange={e => setForm(f => ({ ...f, reps: e.target.value }))}
            placeholder="e.g. 10"
            min="0"
            className={errors.reps ? 'input-error' : ''}
          />
        ) : (
          <div className="time-inputs">
            <input
              type="number"
              value={form.timeMinutes}
              onChange={e => setForm(f => ({ ...f, timeMinutes: e.target.value }))}
              placeholder="min"
              min="0"
            />
            <span>:</span>
            <input
              type="number"
              value={form.timeSeconds}
              onChange={e => setForm(f => ({ ...f, timeSeconds: e.target.value }))}
              placeholder="sec"
              min="0"
              max="59"
            />
          </div>
        )}
        {(errors.reps || errors.time) && (
          <span className="field-error">{errors.reps || errors.time}</span>
        )}
      </div>

      <div className="form-row">
        <label>Weight</label>
        <div className="input-with-unit">
          <input
            type="number"
            value={form.weight}
            onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
            placeholder="e.g. 135"
            min="0"
          />
          <select
            value={form.weightUnit}
            onChange={e => setForm(f => ({ ...f, weightUnit: e.target.value }))}
          >
            <option value="lbs">lbs</option>
            <option value="kg">kg</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <label>Date <span className="required">*</span></label>
        <input
          type="date"
          value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          className={errors.date ? 'input-error' : ''}
        />
        {errors.date && <span className="field-error">{errors.date}</span>}
      </div>

      <div className="section-actions">
        <button className="btn-save-section" onClick={handleSave}>Save PR</button>
        <button className="btn-cancel-section" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

export default function PersonalRecordsSection({ data: records, onSave }) {
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)

  function handleAdd(pr) {
    onSave([pr, ...records])
    setAdding(false)
  }

  function handleEdit(pr) {
    onSave(records.map(r => r.id === pr.id ? pr : r))
    setEditingId(null)
  }

  function handleDelete(id) {
    onSave(records.filter(r => r.id !== id))
  }

  function formatPerformance(pr) {
    if (pr.useTime) {
      const m = pr.timeMinutes || '0'
      const s = String(pr.timeSeconds || '0').padStart(2, '0')
      return `${m}:${s}`
    }
    const parts = []
    if (pr.sets) parts.push(`${pr.sets} sets`)
    if (pr.reps) parts.push(`${pr.reps} reps`)
    if (pr.weight) parts.push(`${pr.weight} ${pr.weightUnit}`)
    return parts.join(' · ') || '—'
  }

  const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="section-content">
      {!adding && (
        <button className="btn-add-pr" onClick={() => setAdding(true)}>+ Add Personal Record</button>
      )}

      {adding && (
        <PRForm
          initial={{ ...EMPTY_PR }}
          onSave={handleAdd}
          onCancel={() => setAdding(false)}
        />
      )}

      {sorted.length === 0 && !adding && (
        <p className="empty-state">No personal records yet. Add your first PR above.</p>
      )}

      <div className="pr-list">
        {sorted.map(pr => {
          if (editingId === pr.id) {
            return (
              <div key={pr.id} className="pr-card pr-card-editing">
                <PRForm
                  initial={{ ...pr }}
                  onSave={handleEdit}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            )
          }

          const progress = calcProgress(records, pr)
          const progressNum = progress !== null ? parseFloat(progress) : null

          return (
            <div key={pr.id} className="pr-card">
              <div className="pr-card-header">
                <span className="pr-exercise">{pr.exercise}</span>
                {progressNum !== null && (
                  <span className={`pr-progress ${progressNum >= 0 ? 'progress-up' : 'progress-down'}`}>
                    {progressNum >= 0 ? '+' : ''}{progress}%
                  </span>
                )}
              </div>
              <div className="pr-performance">{formatPerformance(pr)}</div>
              <div className="pr-date">{pr.date}</div>
              <div className="pr-card-actions">
                <button className="btn-pr-edit" onClick={() => setEditingId(pr.id)}>Edit</button>
                <button className="btn-pr-delete" onClick={() => handleDelete(pr.id)}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
