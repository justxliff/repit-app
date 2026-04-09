import { useState } from 'react'
import WorkoutCreatorModal from '../components/workouts/WorkoutCreatorModal'
import WorkoutGeneratorModal from '../components/workouts/WorkoutGeneratorModal'
import './WorkoutCreationPage.css'

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

export default function WorkoutCreationPage({ workouts = [] }) {
  const [activeModal, setActiveModal] = useState(null)

  return (
    <div className="wc-page">
      <div className="wc-fixed-title">
        <h1 className="wc-title">Workout Creator</h1>
      </div>

      <div className="wc-body">
        <div className="wc-tiles">
          <button
            className="wc-tile"
            onClick={() => setActiveModal('creator')}
          >
            <CreatorIcon />
            <span className="wc-tile-label">Workout Creator</span>
          </button>

          <button
            className="wc-tile"
            onClick={() => setActiveModal('generator')}
          >
            <GeneratorIcon />
            <span className="wc-tile-label">Workout Generator</span>
          </button>
        </div>

        <div className="wc-shelf-wrap">
          <div className="wc-shelf">
            {workouts.length === 0 ? (
              <div className="wc-empty">
                <span>Get started with a new workout</span>
              </div>
            ) : (
              workouts.map((w, i) => (
                <div key={i} className="wc-workout-tile">
                  <div className="wc-workout-name">{w.name}</div>
                  <div className="wc-workout-meta">{w.date} · {w.duration}m</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {activeModal === 'creator' && (
        <WorkoutCreatorModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'generator' && (
        <WorkoutGeneratorModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  )
}
