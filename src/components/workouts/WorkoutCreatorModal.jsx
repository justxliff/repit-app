import { useState } from 'react'
import useExerciseLibrary from '../../hooks/useExerciseLibrary'
import './WorkoutCreatorModal.css'

const SECTIONS = [
  { key: 'warmUp',   label: 'Warm-Up' },
  { key: 'workout',  label: 'Workout' },
  { key: 'coolDown', label: 'Cool Down' },
]

const makeEntry = (exerciseId, exerciseName) => ({
  uid: `${Date.now()}-${Math.random()}`,
  exerciseId,
  exerciseName,
  sets: '',
  reps: '',
})

const CloseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function WorkoutCreatorModal({ onClose, onSave }) {
  const { exercises, addExercise } = useExerciseLibrary()

  const [workoutName, setWorkoutName]   = useState('')
  const [sections, setSections]         = useState({ warmUp: [], workout: [], coolDown: [] })
  const [showLibrary, setShowLibrary]   = useState(false)
  const [libSearch, setLibSearch]       = useState('')
  const [newEx, setNewEx]               = useState({ show: false, name: '', category: '' })
  const [errors, setErrors]             = useState({})
  const [showReview, setShowReview]     = useState(false)

  const totalExercises = Object.values(sections).flat().length

  const addToSection = (sectionKey, id) => {
    const ex = exercises.find(x => x.id === Number(id))
    if (!ex) return
    setSections(prev => ({
      ...prev,
      [sectionKey]: [...prev[sectionKey], makeEntry(ex.id, ex.name)],
    }))
  }

  const removeFromSection = (sectionKey, uid) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: prev[sectionKey].filter(e => e.uid !== uid),
    }))
  }

  const updateEntry = (sectionKey, uid, field, value) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map(e => e.uid === uid ? { ...e, [field]: value } : e),
    }))
  }

  const validate = () => {
    const errs = {}
    if (!workoutName.trim()) errs.name = 'Workout name is required'
    if (totalExercises === 0) errs.exercises = 'Add at least one exercise before saving'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleReview = () => {
    if (validate()) setShowReview(true)
  }

  const handleSave = () => {
    onSave({ name: workoutName.trim(), sections })
    onClose()
  }

  const handleCreateExercise = () => {
    if (!newEx.name.trim()) return
    addExercise({ name: newEx.name.trim(), category: newEx.category.trim() || 'Other' })
    setNewEx({ show: false, name: '', category: '' })
  }

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(libSearch.toLowerCase()) ||
    ex.category.toLowerCase().includes(libSearch.toLowerCase())
  )

  if (showReview) {
    return (
      <div className="wcm-overlay" onClick={() => setShowReview(false)}>
        <div className="wcm-modal" onClick={e => e.stopPropagation()}>
          <div className="wcm-header">
            <h2 className="wcm-title">Review Workout</h2>
            <button className="wcm-close" onClick={() => setShowReview(false)} aria-label="Back"><CloseIcon /></button>
          </div>

          <div className="wcm-body">
            <div className="wcm-review-name">{workoutName}</div>
            {SECTIONS.map(sec => (
              sections[sec.key].length > 0 && (
                <div key={sec.key} className="wcm-review-section">
                  <div className="wcm-review-section-label">{sec.label}</div>
                  {sections[sec.key].map((entry, i) => (
                    <div key={entry.uid} className="wcm-review-row">
                      <span className="wcm-review-index">{i + 1}</span>
                      <span className="wcm-review-ex-name">{entry.exerciseName}</span>
                      <span className="wcm-review-detail">
                        {entry.sets ? `${entry.sets} sets` : ''}
                        {entry.sets && entry.reps ? ' × ' : ''}
                        {entry.reps ? `${entry.reps} reps` : ''}
                        {!entry.sets && !entry.reps ? '—' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )
            ))}
          </div>

          <div className="wcm-footer">
            <button className="wcm-btn-secondary" onClick={() => setShowReview(false)}>Edit</button>
            <button className="wcm-btn-save" onClick={handleSave}>Save Workout</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wcm-overlay" onClick={onClose}>
      <div className="wcm-modal" onClick={e => e.stopPropagation()}>

        <div className="wcm-header">
          <div className="wcm-name-wrap">
            <input
              className={`wcm-name-input ${errors.name ? 'wcm-input-error' : ''}`}
              placeholder="Workout name..."
              value={workoutName}
              onChange={e => { setWorkoutName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
            />
            {errors.name && <span className="wcm-field-error">{errors.name}</span>}
          </div>
          <button className="wcm-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>

        <div className="wcm-body">
          {errors.exercises && (
            <div className="wcm-error-banner">{errors.exercises}</div>
          )}

          {SECTIONS.map(sec => (
            <div key={sec.key} className="wcm-section-card">
              <div className="wcm-section-label">{sec.label}</div>

              {sections[sec.key].length > 0 && (
                <div className="wcm-exercise-list">
                  {sections[sec.key].map(entry => (
                    <div key={entry.uid} className="wcm-exercise-row">
                      <span className="wcm-ex-name">{entry.exerciseName}</span>
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
                      </div>
                      <button
                        className="wcm-remove-btn"
                        onClick={() => removeFromSection(sec.key, entry.uid)}
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
                  onChange={e => { addToSection(sec.key, e.target.value) }}
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
          <button className="wcm-btn-library" onClick={() => setShowLibrary(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="3" cy="6" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="3" cy="18" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            Exercise Library
          </button>
          <button className="wcm-btn-review" onClick={handleReview}>
            Review &amp; Save
          </button>
        </div>
      </div>

      {showLibrary && (
        <div className="wcm-lib-overlay" onClick={() => setShowLibrary(false)}>
          <div className="wcm-lib-panel" onClick={e => e.stopPropagation()}>
            <div className="wcm-lib-header">
              <h3 className="wcm-lib-title">Exercise Library</h3>
              <button className="wcm-close" onClick={() => setShowLibrary(false)} aria-label="Close library">
                <CloseIcon size={18} />
              </button>
            </div>

            <input
              className="wcm-lib-search"
              placeholder="Search by name or category..."
              value={libSearch}
              onChange={e => setLibSearch(e.target.value)}
            />

            <div className="wcm-lib-list">
              {filteredExercises.map(ex => (
                <div key={ex.id} className="wcm-lib-item">
                  <div className="wcm-lib-info">
                    <span className="wcm-lib-name">{ex.name}</span>
                    <span className="wcm-lib-cat">{ex.category}</span>
                  </div>
                </div>
              ))}
              {filteredExercises.length === 0 && (
                <div className="wcm-lib-empty">No exercises found</div>
              )}
            </div>

            {newEx.show ? (
              <div className="wcm-new-ex-form">
                <input
                  className="wcm-lib-input"
                  placeholder="Exercise name *"
                  value={newEx.name}
                  onChange={e => setNewEx(p => ({ ...p, name: e.target.value }))}
                />
                <input
                  className="wcm-lib-input"
                  placeholder="Category (e.g. Chest)"
                  value={newEx.category}
                  onChange={e => setNewEx(p => ({ ...p, category: e.target.value }))}
                />
                <div className="wcm-new-ex-actions">
                  <button
                    className="wcm-btn-secondary"
                    onClick={() => setNewEx({ show: false, name: '', category: '' })}
                  >
                    Cancel
                  </button>
                  <button className="wcm-btn-save" onClick={handleCreateExercise}>Add</button>
                </div>
              </div>
            ) : (
              <button
                className="wcm-btn-create-ex"
                onClick={() => setNewEx(p => ({ ...p, show: true }))}
              >
                + Create New Exercise
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
