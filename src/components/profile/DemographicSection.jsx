import React, { useState } from 'react'

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
  }

  function validate() {
    const errs = {}
    if (!form.name?.trim()) errs.name = 'Name is required.'
    if (form.age && (isNaN(form.age) || !Number.isInteger(+form.age) || +form.age < 0))
      errs.age = 'Age must be a whole number.'
    if (form.weight && (isNaN(form.weight) || !Number.isInteger(+form.weight) || +form.weight < 0))
      errs.weight = 'Weight must be a whole number.'
    if (form.weight && !form.weightUnit)
      errs.weightUnit = 'Please select a unit.'
    return errs
  }

  function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
    setEditing(false)
  }

  const displayName = data.name || authUser?.name || '—'
  const displayWeight = data.weight ? `${data.weight} ${data.weightUnit}` : '—'

  if (editing) {
    return (
      <div className="section-content">
        <div className="form-row">
          <label>Name <span className="required">*</span></label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-row">
          <label>Age</label>
          <input
            type="number"
            value={form.age}
            onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
            placeholder="e.g. 25"
            min="0"
            max="120"
            className={errors.age ? 'input-error' : ''}
          />
          {errors.age && <span className="field-error">{errors.age}</span>}
        </div>

        <div className="form-row">
          <label>Weight</label>
          <div className="input-with-unit">
            <input
              type="number"
              value={form.weight}
              onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
              placeholder="e.g. 170"
              min="0"
              className={errors.weight ? 'input-error' : ''}
            />
            <select
              value={form.weightUnit}
              onChange={e => setForm(f => ({ ...f, weightUnit: e.target.value }))}
            >
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>
          </div>
          {errors.weight && <span className="field-error">{errors.weight}</span>}
        </div>

        <div className="form-row">
          <label>Profile Picture</label>
          <div className="picture-upload-area">
            {form.profilePicture && (
              <img src={form.profilePicture} alt="Preview" className="picture-preview" />
            )}
            <label className="picture-upload-btn">
              {form.profilePicture ? 'Change Photo' : 'Upload Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
            {form.profilePicture && (
              <button
                type="button"
                className="picture-remove-btn"
                onClick={() => setForm(f => ({ ...f, profilePicture: null }))}
              >
                Remove
              </button>
            )}
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
          <span className="detail-label">Name</span>
          <span className="detail-value">{displayName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Age</span>
          <span className="detail-value">{data.age || '—'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Weight</span>
          <span className="detail-value">{displayWeight}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Profile Picture</span>
          <span className="detail-value">{data.profilePicture ? 'Uploaded' : '—'}</span>
        </div>
      </div>
      <button className="btn-edit-section" onClick={startEdit}>Edit</button>
    </div>
  )
}
