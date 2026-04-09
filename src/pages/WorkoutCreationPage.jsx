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
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2a2.5 2.5 0 0 1 5 0v.5A6 6 0 0 1 18 8v1a4 4 0 0 1-1 7.87V18a3 3 0 0 1-6 0v-1.13A4 4 0 0 1 6 9V8a6 6 0 0 1 3.5-5.5V2z" />
        <line x1="12" y1="13" x2="12" y2="17" />
        <circle cx="12" cy="18.5" r="0.5" fill="currentColor" />
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
