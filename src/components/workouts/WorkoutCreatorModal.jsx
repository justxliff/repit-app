import { useState } from 'react'
import useExerciseLibrary from '../../hooks/useExerciseLibrary'
import ExerciseCreatorForm from './ExerciseCreatorForm'
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

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

export default function WorkoutCreatorModal({ onClose, onSave }) {
  const { exercises, addExercise, updateExercise, deleteExercise, nameExists } = useExerciseLibrary()

  const [workoutName, setWorkoutName]     = useState('')
  const [sections, setSections]           = useState({ warmUp: [], workout: [], coolDown: [] })
  const [showLibrary, setShowLibrary]     = useState(false)
  const [libView, setLibView]             = useState('list')
  const [libSearch, setLibSearch]         = useState('')
  const [editingExercise, setEditingExercise] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [errors, setErrors]               = useState({})
  const [showReview, setShowReview]       = useState(false)

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

  const handleReview = () => { if (validate()) setShowReview(true) }
  const handleSave   = () => { onSave({ name: workoutName.trim(), sections }); onClose() }

  const handleExerciseSaved = (exerciseData) => {
    if (editingExercise) {
      updateExercise(editingExercise.id, exerciseData)
    } else {
      addExercise(exerciseData)
    }
    setEditingExercise(null)
    setLibView('list')
  }

  const handleEditExercise = (ex) => {
    setEditingExercise(ex)
    setConfirmDeleteId(null)
    setLibView('edit')
  }

  const handleDeleteExercise = (id) => {
    deleteExercise(id)
    setConfirmDeleteId(null)
  }

  const goBackToList = () => {
    setLibView('list')
    setEditingExercise(null)
    setConfirmDeleteId(null)
  }

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(libSearch.toLowerCase()) ||
    (ex.category || '').toLowerCase().includes(libSearch.toLowerCase())
  )

  const closeLibrary = () => {
    setShowLibrary(false)
    setLibView('list')
    setLibSearch('')
    setEditingExercise(null)
    setConfirmDeleteId(null)
  }

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
        <div className="wcm-lib-overlay" onClick={closeLibrary}>
          <div className="wcm-lib-panel" onClick={e => e.stopPropagation()}>

            <div className="wcm-lib-header">
              {(libView === 'creator' || libView === 'edit') && (
                <button className="wcm-lib-back" onClick={goBackToList}>
                  <BackIcon /> Back
                </button>
              )}
              <h3 className="wcm-lib-title">
                {libView === 'creator' ? 'New Exercise' : libView === 'edit' ? 'Edit Exercise' : 'Exercise Library'}
              </h3>
              <button className="wcm-close" onClick={closeLibrary} aria-label="Close library">
                <CloseIcon size={18} />
              </button>
            </div>

            {libView === 'list' && (
              <>
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
                        <span className="wcm-lib-cat">{ex.category || ex.type || ''}</span>
                      </div>
                      {confirmDeleteId === ex.id ? (
                        <div className="wcm-lib-confirm">
                          <span className="wcm-lib-confirm-text">Delete?</span>
                          <button className="wcm-lib-confirm-yes" onClick={() => handleDeleteExercise(ex.id)}>Yes</button>
                          <button className="wcm-lib-confirm-no" onClick={() => setConfirmDeleteId(null)}>No</button>
                        </div>
                      ) : (
                        <div className="wcm-lib-actions">
                          <button
                            className="wcm-lib-action-btn"
                            onClick={() => handleEditExercise(ex)}
                            aria-label="Edit exercise"
                            title="Edit"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="wcm-lib-action-btn wcm-lib-delete-btn"
                            onClick={() => setConfirmDeleteId(ex.id)}
                            aria-label="Delete exercise"
                            title="Delete"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredExercises.length === 0 && (
                    <div className="wcm-lib-empty">No exercises found</div>
                  )}
                </div>
                <button className="wcm-btn-create-ex" onClick={() => setLibView('creator')}>
                  + Create New Exercise
                </button>
              </>
            )}

            {(libView === 'creator' || libView === 'edit') && (
              <div className="wcm-lib-creator-scroll">
                <ExerciseCreatorForm
                  exercises={exercises}
                  onSave={handleExerciseSaved}
                  onCancel={goBackToList}
                  initialValues={libView === 'edit' ? editingExercise : null}
                  editId={libView === 'edit' ? editingExercise?.id : null}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
