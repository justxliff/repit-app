import React, { useState, useRef } from 'react'

function resizeImage(file, maxSize = 300) {
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
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.src = url
  })
}

export default function DemographicSection({ data, authUser, onSave }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(data)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  function startEdit() {
    setForm({ ...data, name: data.name || authUser?.name || '' })
    setErrors({})
    setEditing(true)
  }

  function handleCancel() {
    setForm(data)
    setErrors({})
    setEditing(false)
  }

  async function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const resized = await resizeImage(file)
    setForm(f => ({ ...f, profilePicture: resized }))
    e.target.value = ''
  }

  function validate() {
    const errs = {}
    if (!form.name?.trim()) errs.name = 'Name is required.'
    if (form.age && (isNaN(form.age) || !Number.isInteger(+form.age) || +form.age < 0))
      errs.age = 'Age must be a whole number.'
    if (form.weight) {
      if (isNaN(form.weight) || !Number.isInteger(+form.weight) || +form.weight < 0)
        errs.weight = 'Weight must be a whole number.'
      if (!form.weightUnit)
        errs.weightUnit = 'Please select a weight unit.'
    }
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
            <span className="section-field-label">Name</span>
            <span className="section-field-value">{data.name || '—'}</span>
          </div>
          <div className="section-field-row">
            <span className="section-field-label">Age</span>
            <span className="section-field-value">{data.age || '—'}</span>
          </div>
          <div className="section-field-row">
            <span className="section-field-label">Weight</span>
            <span className="section-field-value">{data.weight ? `${data.weight} ${data.weightUnit}` : '—'}</span>
          </div>
        </div>
        <button className="btn-edit-section" onClick={startEdit}>Edit</button>
      </div>
    )
  }

  return (
    <div className="section-edit">
      <div className="profile-pic-upload">
        <div className="profile-pic-preview-wrap">
          {form.profilePicture
            ? <img src={form.profilePicture} alt="Preview" className="profile-pic-preview" />
            : <div className="profile-pic-placeholder">Photo</div>}
        </div>

        <div className="profile-pic-actions">
          <button
            type="button"
            className="btn-pic-option"
            onClick={() => cameraInputRef.current?.click()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            Take Photo
          </button>
          <button
            type="button"
            className="btn-pic-option"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Upload Photo
          </button>
          {form.profilePicture && (
            <button
              type="button"
              className="btn-remove-pic"
              onClick={() => setForm(f => ({ ...f, profilePicture: null }))}
            >
              Remove
            </button>
          )}
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Name *</label>
        <input
          className={`form-input ${errors.name ? 'input-error' : ''}`}
          value={form.name || ''}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label className="form-label">Age</label>
        <input
          className={`form-input ${errors.age ? 'input-error' : ''}`}
          value={form.age || ''}
          onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
          placeholder="e.g. 28"
          inputMode="numeric"
        />
        {errors.age && <span className="field-error">{errors.age}</span>}
      </div>

      <div className="form-field">
        <label className="form-label">Weight</label>
        <div className="form-row">
          <input
            className={`form-input ${errors.weight ? 'input-error' : ''}`}
            value={form.weight || ''}
            onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
            placeholder="e.g. 175"
            inputMode="numeric"
          />
          <select
            className={`form-select-sm ${errors.weightUnit ? 'input-error' : ''}`}
            value={form.weightUnit || ''}
            onChange={e => setForm(f => ({ ...f, weightUnit: e.target.value }))}
          >
            <option value="">Unit</option>
            <option value="lbs">lbs</option>
            <option value="kg">kg</option>
          </select>
        </div>
        {errors.weight && <span className="field-error">{errors.weight}</span>}
        {errors.weightUnit && <span className="field-error">{errors.weightUnit}</span>}
      </div>

      <div className="section-edit-actions">
        <button className="btn-save-section" onClick={handleSave}>Save</button>
        <button className="btn-cancel-section" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  )
}
