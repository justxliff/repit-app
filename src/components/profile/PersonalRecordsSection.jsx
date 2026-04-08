import React, { useState } from 'react'

export default function PersonalRecordsSection({ data, onSave }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ exercise: '', value: '', unit: 'lbs' })

  function resetForm() {
    setForm({ exercise: '', value: '', unit: 'lbs' })
    setShowAdd(false)
    setEditId(null)
  }

  function handleAdd() {
    if (!form.exercise.trim() || !form.value.trim()) return
    onSave([...data, { id: Date.now(), ...form }])
    resetForm()
  }

  function handleEdit(record) {
    setForm({ exercise: record.exercise, value: record.value, unit: record.unit })
    setEditId(record.id)
    setShowAdd(false)
  }

  function handleUpdate() {
    if (!form.exercise.trim() || !form.value.trim()) return
    onSave(data.map(r => r.id === editId ? { ...r, ...form } : r))
    resetForm()
  }

  function handleDelete(id) {
    onSave(data.filter(r => r.id !== id))
  }

  return (
    <div className="section-view">
      {data.length === 0 && !showAdd && !editId && (
        <p className="section-empty">No personal records yet. Add your first one!</p>
      )}

      <div className="pr-list">
        {data.map(record => (
          editId === record.id ? (
            <div key={record.id} className="pr-edit-row">
              <input className="form-input" value={form.exercise} onChange={e => setForm(f => ({ ...f, exercise: e.target.value }))} placeholder="Exercise" />
              <div className="form-row">
                <input className="form-input" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="Value" inputMode="decimal" />
                <select className="form-select-sm" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                  <option value="min">min</option>
                  <option value="sec">sec</option>
                  <option value="reps">reps</option>
                </select>
              </div>
              <div className="section-edit-actions">
                <button className="btn-save-section" onClick={handleUpdate}>Update</button>
                <button className="btn-cancel-section" onClick={resetForm}>Cancel</button>
              </div>
            </div>
          ) : (
            <div key={record.id} className="pr-row">
              <div className="pr-info">
                <span className="pr-exercise">{record.exercise}</span>
                <span className="pr-value">{record.value} {record.unit}</span>
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
          <div className="form-field">
            <label className="form-label">Exercise</label>
            <input className="form-input" value={form.exercise} onChange={e => setForm(f => ({ ...f, exercise: e.target.value }))} placeholder="e.g. Bench Press" />
          </div>
          <div className="form-field">
            <label className="form-label">Personal Best</label>
            <div className="form-row">
              <input className="form-input" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="e.g. 225" inputMode="decimal" />
              <select className="form-select-sm" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
                <option value="min">min</option>
                <option value="sec">sec</option>
                <option value="reps">reps</option>
              </select>
            </div>
          </div>
          <div className="section-edit-actions">
            <button className="btn-save-section" onClick={handleAdd}>Add</button>
            <button className="btn-cancel-section" onClick={resetForm}>Cancel</button>
          </div>
        </div>
      )}

      {!showAdd && !editId && (
        <button className="btn-edit-section" onClick={() => setShowAdd(true)}>+ Add Record</button>
      )}
    </div>
  )
}
