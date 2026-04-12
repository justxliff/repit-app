import ExerciseCreatorForm from './ExerciseCreatorForm'
import './WorkoutCreatorModal.css'

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function ExerciseFormModal({ onClose, onSave, initialValues = null, editId = null, exercises = [] }) {
  return (
    <div className="wcm-overlay" onClick={onClose}>
      <div className="wcm-modal" onClick={e => e.stopPropagation()}>
        <div className="wcm-header">
          <h2 className="wcm-title">{editId ? 'Edit Exercise' : 'New Exercise'}</h2>
          <button className="wcm-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="wcm-body">
          <ExerciseCreatorForm
            exercises={exercises}
            onSave={onSave}
            onCancel={onClose}
            initialValues={initialValues}
            editId={editId}
          />
        </div>
      </div>
    </div>
  )
}
