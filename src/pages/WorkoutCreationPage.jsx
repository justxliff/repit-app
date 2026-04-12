import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import useWorkouts from '../hooks/useWorkouts'
import useExerciseLibrary from '../hooks/useExerciseLibrary'
import WorkoutCreatorModal from '../components/workouts/WorkoutCreatorModal'
import WorkoutGeneratorModal from '../components/workouts/WorkoutGeneratorModal'
import WorkoutEditorModal from '../components/workouts/WorkoutEditorModal'
import ExerciseFormModal from '../components/workouts/ExerciseFormModal'
import './WorkoutCreationPage.css'

const ExerciseLibIcon = () => (
  <div className="wc-tile-icon">
    <span className="wc-arm-emoji">💪</span>
    <div className="wc-overlay-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <circle cx="3" cy="6" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="3" cy="18" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    </div>
  </div>
)

const CreatorIcon = () => (
  <div className="wc-tile-icon">
    <span className="wc-arm-emoji">💪</span>
    <div className="wc-overlay-icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </div>
  </div>
)

const GeneratorIcon = () => (
  <div className="wc-tile-icon">
    <span className="wc-arm-emoji">💪</span>
    <div className="wc-overlay-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z" />
        <path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" />
      </svg>
    </div>
  </div>
)

export default function WorkoutCreationPage() {
  const { user } = useAuth()
  const { workouts, saveWorkout, updateWorkout } = useWorkouts(user?.email)
  const { exercises, addExercise, updateExercise } = useExerciseLibrary()

  const [activeModal, setActiveModal] = useState(null)
  const [editingWorkout, setEditingWorkout] = useState(null)
  const [editingExercise, setEditingExercise] = useState(null)

  function handleExerciseSave(data) {
    if (editingExercise) {
      updateExercise(editingExercise.id, data)
    } else {
      addExercise(data)
    }
    setEditingExercise(null)
    setActiveModal(null)
  }

  return (
    <div className="wc-page">
      <div className="wc-fixed-title">
        <h1 className="wc-title">Workout Creator</h1>
      </div>

      <div className="wc-body">
        <div className="wc-tiles">
          <button className="wc-tile" onClick={() => { setEditingExercise(null); setActiveModal('exercise') }}>
            <ExerciseLibIcon />
            <span className="wc-tile-label">Exercise Creator</span>
          </button>

          <button className="wc-tile" onClick={() => setActiveModal('creator')}>
            <CreatorIcon />
            <span className="wc-tile-label">Workout Creator</span>
          </button>

          <button className="wc-tile" onClick={() => setActiveModal('generator')}>
            <GeneratorIcon />
            <span className="wc-tile-label">Workout Generator</span>
          </button>
        </div>

        {/* Workout Library Panel */}
        <div className="wc-panel-wrap">
          <div className="wc-panel-header">
            <span className="wc-panel-label">Workout Library</span>
            <span className="wc-panel-count">{workouts.length}</span>
          </div>
          <div className="wc-shelf">
            {workouts.length === 0 ? (
              <div className="wc-empty">
                <span>Get started with a new workout</span>
              </div>
            ) : (
              workouts.map(w => (
                <button
                  key={w.id}
                  className="wc-workout-tile"
                  onClick={() => setEditingWorkout(w)}
                >
                  <div className="wc-workout-name">{w.name}</div>
                  <div className="wc-workout-meta">{w.date}</div>
                  <div className="wc-workout-count">
                    {Object.values(w.sections || {}).flat().length} exercise
                    {Object.values(w.sections || {}).flat().length !== 1 ? 's' : ''}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Exercise Library Panel */}
        <div className="wc-panel-wrap">
          <div className="wc-panel-header">
            <span className="wc-panel-label">Exercise Library</span>
            <span className="wc-panel-count">{exercises.length}</span>
          </div>
          <div className="wc-shelf">
            <button
              className="wc-ex-create-tile"
              onClick={() => { setEditingExercise(null); setActiveModal('exercise') }}
            >
              <div className="wc-ex-create-tile-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <span className="wc-ex-create-tile-label">New Exercise</span>
            </button>

            {exercises.map(ex => (
              <button
                key={ex.id}
                className="wc-workout-tile"
                onClick={() => { setEditingExercise(ex); setActiveModal('exercise') }}
              >
                <div className="wc-workout-name">{ex.name}</div>
                <div className="wc-workout-meta">{ex.category || ex.type || ''}</div>
                {ex.muscles && (
                  <div className="wc-workout-count">{ex.muscles}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeModal === 'exercise' && (
        <ExerciseFormModal
          exercises={exercises}
          initialValues={editingExercise}
          editId={editingExercise?.id ?? null}
          onClose={() => { setActiveModal(null); setEditingExercise(null) }}
          onSave={handleExerciseSave}
        />
      )}
      {activeModal === 'creator' && (
        <WorkoutCreatorModal
          onClose={() => setActiveModal(null)}
          onSave={(workout) => {
            saveWorkout(workout)
            setActiveModal(null)
          }}
        />
      )}
      {activeModal === 'generator' && (
        <WorkoutGeneratorModal
          onClose={() => setActiveModal(null)}
          onSave={(workout) => {
            saveWorkout(workout)
            setActiveModal(null)
          }}
          userEmail={user?.email}
        />
      )}
      {editingWorkout && (
        <WorkoutEditorModal
          workout={editingWorkout}
          onClose={() => setEditingWorkout(null)}
          onSave={(changes) => {
            updateWorkout(editingWorkout.id, changes)
            setEditingWorkout(null)
          }}
        />
      )}
    </div>
  )
}
