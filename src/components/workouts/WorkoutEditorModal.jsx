import { useState } from 'react'
import useExerciseLibrary from '../../hooks/useExerciseLibrary'
import './WorkoutCreatorModal.css'

const SECTIONS = [
  { key: 'warmUp',   label: 'Warm-Up' },
  { key: 'workout',  label: 'Workout' },
  { key: 'coolDown', label: 'Cool Down' },
]

const CloseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

function normalizeEntry(entry) {
  return {
    uid: entry.uid || `${Date.now()}-${Math.random()}`,
    displayName: entry.exerciseName || entry.name || '',
    sets: entry.sets || '',
    reps: entry.reps || '',
    weight: entry.weight || '',
  }
}

function normalizeSections(sections) {
  const result = { warmUp: [], workout: [], coolDown: [] }
  for (const key of Object.keys(result)) {
    if (Array.isArray(sections?.[key])) {
      result[key] = sections[key].map(normalizeEntry)
    }
  }
  return result
}

export default function WorkoutEditorModal({ workout, onClose, onSave }) {
  const { exercises } = useExerciseLibrary()

  const [name, setName] = useState(workout.name || '')
  const [sections, setSections] = useState(() => normalizeSections(workout.sections))
  const [nameError, setNameError] = useState('')

  function updateEntry(sectionKey, uid, field, value) {
    setSections(prev => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map(e => e.uid === uid ? { ...e, [field]: value } : e),
    }))
  }

  function removeEntry(sectionKey, uid) {
    setSections(prev => ({
      ...prev,
      [sectionKey]: prev[sectionKey].filter(e => e.uid !== uid),
    }))
  }

  function addEntry(sectionKey, exerciseId) {
    const ex = exercises.find(x => x.id === Number(exerciseId))
    if (!ex) return
    const entry = {
      uid: `${Date.now()}-${Math.random()}`,
      displayName: ex.name,
      sets: '',
      reps: '',
      weight: '',
    }
    setSections(prev => ({
      ...prev,
      [sectionKey]: [...prev[sectionKey], entry],
    }))
  }

  function handleSave() {
    if (!name.trim()) {
      setNameError('Workout name is required')
      return
    }
    const denormalized = {}
    for (const key of Object.keys(sections)) {
      denormalized[key] = sections[key].map(e => ({
        uid: e.uid,
        name: e.displayName,
        sets: e.sets,
        reps: e.reps,
        weight: e.weight,
      }))
    }
    onSave({ name: name.trim(), sections: denormalized })
    onClose()
  }

  return (
    <div className="wcm-overlay" onClick={onClose}>
      <div className="wcm-modal" onClick={e => e.stopPropagation()}>

        <div className="wcm-header">
          <div className="wcm-name-wrap">
            <input
              className={`wcm-name-input ${nameError ? 'wcm-input-error' : ''}`}
              placeholder="Workout name..."
              value={name}
              onChange={e => { setName(e.target.value); setNameError('') }}
            />
            {nameError && <span className="wcm-field-error">{nameError}</span>}
          </div>
          <button className="wcm-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="wcm-body">
          {SECTIONS.map(sec => (
            <div key={sec.key} className="wcm-section-card">
              <div className="wcm-section-label">{sec.label}</div>

              {sections[sec.key].length > 0 && (
                <div className="wcm-exercise-list">
                  {sections[sec.key].map(entry => (
                    <div key={entry.uid} className="wcm-exercise-row">
                      <span className="wcm-ex-name">{entry.displayName}</span>
                      <div className="wcm-ex-inputs">
                        <label className="wcm-ex-label">
                          Sets
                          <input
                            type="number"
                            min="1"
                            value={entry.sets}
                            onChange={e => updateEntry(sec.key, entry.uid, 'sets', e.target.value)}
                            placeholder="—"
                          />
                        </label>
                        <label className="wcm-ex-label">
                          Reps
                          <input
                            type="number"
                            min="1"
                            value={entry.reps}
                            onChange={e => updateEntry(sec.key, entry.uid, 'reps', e.target.value)}
                            placeholder="—"
                          />
                        </label>
                        <label className="wcm-ex-label">
                          Weight
                          <input
                            value={entry.weight}
                            onChange={e => updateEntry(sec.key, entry.uid, 'weight', e.target.value)}
                            placeholder="—"
                          />
                        </label>
                      </div>
                      <button
                        className="wcm-remove-btn"
                        onClick={() => removeEntry(sec.key, entry.uid)}
                        aria-label="Remove exercise"
                      >
                        <CloseIcon size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="wcm-add-row">
                <select
                  className="wcm-add-select"
                  value=""
                  onChange={e => { addEntry(sec.key, e.target.value) }}
                >
                  <option value="">+ Add exercise</option>
                  {exercises.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="wcm-footer">
          <button className="wcm-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="wcm-btn-save" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}
