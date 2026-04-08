import React, { useState } from 'react'

const EMPTY_FORM = {
  exercise: '',
  sets: '',
  repType: 'reps',
  reps: '',
  minutes: '',
  seconds: '',
  weight: '',
  weightUnit: 'lbs',
  date: '',
}

function getNumericValue(record) {
  if (record.weight && !isNaN(+record.weight) && +record.weight > 0) return +record.weight
  if (record.repType === 'reps' && record.reps && !isNaN(+record.reps)) return +record.reps
  if (record.repType === 'time') {
    const m = +(record.minutes || 0)
    const s = +(record.seconds || 0)
    const total = m * 60 + s
    return total > 0 ? total : null
  }
  return null
}

function calcProgress(records) {
  const groups = {}
  records.forEach(r => {
    const key = r.exercise?.trim().toLowerCase()
    if (!key) return
    if (!groups[key]) groups[key] = []
    groups[key].push(r)
  })
  Object.values(groups).forEach(group => {
    group.sort((a, b) => new Date(a.date) - new Date(b.date))
  })
  const progressMap = {}
  Object.values(groups).forEach(group => {
    group.forEach((record, idx) => {
      if (idx === 0) return
      const prev = group[idx - 1]
      const currVal = getNumericValue(record)
      const prevVal = getNumericValue(prev)
      if (currVal !== null && prevVal !== null && prevVal !== 0) {
        progressMap[record.id] = ((currVal - prevVal) / prevVal * 100).toFixed(1)
      }
    })
  })
  return progressMap
}

function formatRecord(record) {
  const parts = []
  if (record.sets) parts.push(`${record.sets} sets`)
  if (record.repType === 'reps' && record.reps) parts.push(`${record.reps} reps`)
  if (record.repType === 'time') {
    const m = record.minutes || '0'
    const s = (record.seconds || '0').toString().padStart(2, '0')
    parts.push(`${m}:${s}`)
  }
  if (record.weight) parts.push(`${record.weight} ${record.weightUnit}`)
  return parts.join(' · ')
}

function validate(form) {
  const errs = {}
  if (!form.exercise.trim()) errs.exercise = 'Exercise name is required.'
  if (!form.date) errs.date = 'Date is required.'
  if (form.sets && (isNaN(form.sets) || !Number.isInteger(+form.sets) || +form.sets < 0))
    errs.sets = 'Sets must be a whole number.'
  if (form.repType === 'reps' && !form.reps)
    errs.reps = 'Reps is required.'
  if (form.repType === 'time' && !form.minutes && !form.seconds)
    errs.time = 'Time is required.'
  if (form.weight && (isNaN(form.weight) || !Number.isInteger(+form.weight) || +form.weight < 0))
    errs.weight = 'Weight must be a whole number.'
  return errs
}

function PRForm({ form, setForm, errors, onSubmit, onCancel, submitLabel }) {
  return (
    <div className="pr-form-fields">
      <div className="form-field">
        <label className="form-label">Exercise *</label>
        <input
          className={`form-input ${errors.exercise ? 'input-error' : ''}`}
          value={form.exercise}
          onChange={e => setForm(f => ({ ...f, exercise: e.target.value }))}
          placeholder="e.g. Bench Press"
        />
        {errors.exercise && <span className="field-error">{errors.exercise}</span>}
      </div>

      <div className="form-field">
        <label className="form-label">Date *</label>
        <input
          type="date"
          className={`form-input ${errors.date ? 'input-error' : ''}`}
          value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
        />
        {errors.date && <span className="field-error">{errors.date}</span>}
      </div>

      <div className="form-field">
        <label className="form-label">Sets</label>
        <input
          className={`form-input ${errors.sets ? 'input-error' : ''}`}
          value={form.sets}
          onChange={e => setForm(f => ({ ...f, sets: e.target.value }))}
          placeholder="Optional"
          inputMode="numeric"
        />
        {errors.sets && <span className="field-error">{errors.sets}</span>}
      </div>

      <div className="form-field">
        <label className="form-label">Performance *</label>
        <div className="rep-type-toggle">
          <button
            type="button"
            className={`rep-type-btn ${form.repType === 'reps' ? 'rep-type-active' : ''}`}
            onClick={() => setForm(f => ({ ...f, repType: 'reps' }))}
          >
            Reps
          </button>
          <button
            type="button"
            className={`rep-type-btn ${form.repType === 'time' ? 'rep-type-active' : ''}`}
            onClick={() => setForm(f => ({ ...f, repType: 'time' }))}
          >
            Time
          </button>
        </div>

        {form.repType === 'reps' ? (
          <input
            className={`form-input ${errors.reps ? 'input-error' : ''}`}
            value={form.reps}
            onChange={e => setForm(f => ({ ...f, reps: e.target.value }))}
            placeholder="e.g. 10"
            inputMode="numeric"
          />
        ) : (
          <div className="form-row">
            <input
              className={`form-input ${errors.time ? 'input-error' : ''}`}
              value={form.minutes}
              onChange={e => setForm(f => ({ ...f, minutes: e.target.value }))}
              placeholder="min"
              inputMode="numeric"
            />
            <input
              className={`form-input ${errors.time ? 'input-error' : ''}`}
              value={form.seconds}
              onChange={e => setForm(f => ({ ...f, seconds: e.target.value }))}
              placeholder="sec"
              inputMode="numeric"
            />
          </div>
        )}
        {(errors.reps || errors.time) && (
          <span className="field-error">{errors.reps || errors.time}</span>
        )}
      </div>

      <div className="form-field">
        <label className="form-label">Weight</label>
        <div className="form-row">
          <input
            className={`form-input ${errors.weight ? 'input-error' : ''}`}
            value={form.weight}
            onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
            placeholder="Optional"
            inputMode="numeric"
          />
          <select
            className="form-select-sm"
            value={form.weightUnit}
            onChange={e => setForm(f => ({ ...f, weightUnit: e.target.value }))}
          >
            <option value="lbs">lbs</option>
            <option value="kg">kg</option>
          </select>
        </div>
        {errors.weight && <span className="field-error">{errors.weight}</span>}
      </div>

      <div className="section-edit-actions">
        <button className="btn-save-section" onClick={onSubmit}>{submitLabel}</button>
        <button className="btn-cancel-section" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

export default function PersonalRecordsSection({ data, onSave }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const progressMap = calcProgress(data)

  function resetForm() {
    setForm(EMPTY_FORM)
    setErrors({})
    setShowAdd(false)
    setEditId(null)
  }

  function handleAdd() {
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave([...data, { id: Date.now(), ...form }])
    resetForm()
  }

  function handleEdit(record) {
    setForm({
      exercise: record.exercise || '',
      sets: record.sets || '',
      repType: record.repType || 'reps',
      reps: record.reps || '',
      minutes: record.minutes || '',
      seconds: record.seconds || '',
      weight: record.weight || '',
      weightUnit: record.weightUnit || 'lbs',
      date: record.date || '',
    })
    setErrors({})
    setEditId(record.id)
    setShowAdd(false)
  }

  function handleUpdate() {
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(data.map(r => r.id === editId ? { ...r, ...form } : r))
    resetForm()
  }

  function handleDelete(id) {
    onSave(data.filter(r => r.id !== id))
  }

  const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="section-view">
      {data.length === 0 && !showAdd && !editId && (
        <p className="section-empty">No personal records yet. Add your first one!</p>
      )}

      <div className="pr-list">
        {sorted.map(record => (
          editId === record.id ? (
            <div key={record.id} className="pr-edit-row">
              <PRForm
                form={form}
                setForm={setForm}
                errors={errors}
                onSubmit={handleUpdate}
                onCancel={resetForm}
                submitLabel="Update"
              />
            </div>
          ) : (
            <div key={record.id} className="pr-row">
              <div className="pr-info">
                <span className="pr-exercise">{record.exercise}</span>
                <span className="pr-value">{formatRecord(record)}</span>
                {record.date && (
                  <span className="pr-date">
                    {new Date(record.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                {progressMap[record.id] !== undefined && (
                  <span className={`pr-progress ${+progressMap[record.id] >= 0 ? 'pr-progress-up' : 'pr-progress-down'}`}>
                    {+progressMap[record.id] >= 0 ? '▲' : '▼'} {Math.abs(progressMap[record.id])}%
                  </span>
                )}
              </div>
              <div className="pr-actions">
                <button className="btn-pr-edit" onClick={() => handleEdit(record)}>Edit</button>
                <button className="btn-pr-delete" onClick={() => handleDelete(record.id)}>✕</button>
              </div>
            </div>
          )
        ))}
      </div>

      {showAdd && !editId && (
        <div className="pr-add-form">
          <PRForm
            form={form}
            setForm={setForm}
            errors={errors}
            onSubmit={handleAdd}
            onCancel={resetForm}
            submitLabel="Add"
          />
        </div>
      )}

      {!showAdd && !editId && (
        <button
          className="btn-edit-section"
          onClick={() => { setShowAdd(true); setForm(EMPTY_FORM); setErrors({}) }}
        >
          + Add Record
        </button>
      )}
    </div>
  )
}
