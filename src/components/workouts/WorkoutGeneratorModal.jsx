import { useState, useEffect } from 'react'
import useExerciseLibrary from '../../hooks/useExerciseLibrary'
import { useProfileData } from '../../hooks/useProfileData'
import './WorkoutGeneratorModal.css'

const GOALS = ['Weight Loss', 'Body Toning', 'Muscle Gain', 'Flexibility']
const FOCUSES = ['Strength', 'Endurance', 'Explosion']

const EQUIPMENT = [
  'Body Weight',
  'Dumbbell',
  'Barbell',
  'Free Weights',
  'Cable Machine',
  'Lifting Machines',
  'Advanced Gym Equipment',
]

const MUSCLE_GROUPS = ['Chest', 'Back', 'Arms', 'Legs', 'Shoulders', 'Core']

const EXPERIENCE_LABELS = {
  1: 'Highly Untrained',
  2: 'Beginner',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Highly Trained',
}

const SECTIONS = [
  { key: 'warmUp',   label: 'Warm-Up' },
  { key: 'workout',  label: 'Workout' },
  { key: 'coolDown', label: 'Cool Down' },
]

const TOTAL_STEPS = 4

function buildPrompt({ goal, focus, experienceLevel, equipment, muscleGroups, libraryExercises }) {
  const librarySection = libraryExercises.length > 0
    ? `The user has these exercises in their library (prefer using these where appropriate):\n${libraryExercises.map(e => `- ${e.name} (${e.category}, ${e.type})`).join('\n')}`
    : 'The user has no exercises saved. Generate exercises freely using your knowledge.'

  return `You are a professional personal trainer. Generate a complete, structured workout plan based on the following user profile:

Goal: ${goal}
Focus: ${focus}
Experience Level: ${experienceLevel}/5 (${EXPERIENCE_LABELS[experienceLevel]})
Equipment Available: ${equipment.join(', ')}
Target Muscle Groups: ${muscleGroups.join(', ')}

${librarySection}

Return ONLY a valid JSON object — no explanation, no markdown, no extra text — with this exact structure:
{
  "name": "a short descriptive workout name (e.g. 'Upper Body Strength', 'Full Body Burn')",
  "sections": {
    "warmUp": [
      { "name": "Exercise Name", "sets": "2", "reps": "10 reps", "weight": "" }
    ],
    "workout": [
      { "name": "Exercise Name", "sets": "3", "reps": "12 reps", "weight": "moderate" }
    ],
    "coolDown": [
      { "name": "Exercise Name", "sets": "1", "reps": "30 seconds", "weight": "" }
    ]
  }
}

Rules:
- warmUp: 2-4 light-intensity exercises
- workout: 4-8 main exercises targeting the chosen muscle groups using the available equipment
- coolDown: 2-3 stretching or recovery exercises
- sets: a string like "3" or "2"
- reps: a string like "12 reps", "30 seconds", "to failure"
- weight: empty string for bodyweight, otherwise a short suggestion like "light", "moderate", "heavy"
- Scale intensity and volume to the experience level
- Only use exercises achievable with the stated equipment`
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function StepIndicator({ step }) {
  return (
    <div className="wgm-steps">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div key={i} className={`wgm-step-dot ${i + 1 <= step ? 'wgm-step-active' : ''}`} />
      ))}
    </div>
  )
}

function MultiSelect({ options, selected, onChange }) {
  const toggle = (opt) => {
    if (opt === 'All the Above') {
      onChange(selected.length === options.length ? [] : [...options])
      return
    }
    onChange(
      selected.includes(opt)
        ? selected.filter(o => o !== opt)
        : [...selected.filter(o => o !== 'All the Above'), opt]
    )
  }
  return (
    <div className="wgm-chip-grid">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          className={`wgm-chip ${selected.includes(opt) ? 'wgm-chip-active' : ''}`}
          onClick={() => toggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function WorkoutGeneratorModal({ onClose, onSave, userEmail }) {
  const { exercises: libraryExercises, addExercise } = useExerciseLibrary()
  const { profile } = useProfileData(userEmail)

  const [step, setStep] = useState(1)
  const [useProfilePrefs, setUseProfilePrefs] = useState(null)
  const [goal, setGoal] = useState('')
  const [focus, setFocus] = useState('')
  const [experienceLevel, setExperienceLevel] = useState(null)
  const [equipment, setEquipment] = useState([])
  const [muscleGroups, setMuscleGroups] = useState([])

  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'review' | 'error'
  const [error, setError] = useState('')
  const [generatedWorkout, setGeneratedWorkout] = useState(null)
  const [editedSections, setEditedSections] = useState(null)
  const [addedToLibrary, setAddedToLibrary] = useState(false)

  const profileHasPrefs = profile?.preferences?.goal && profile?.preferences?.focus

  useEffect(() => {
    if (useProfilePrefs === true) {
      setGoal(profile?.preferences?.goal || '')
      setFocus(profile?.preferences?.focus || '')
    }
  }, [useProfilePrefs, profile])

  const activeGoal = useProfilePrefs ? profile?.preferences?.goal : goal
  const activeFocus = useProfilePrefs ? profile?.preferences?.focus : focus

  const canProceedStep1 = useProfilePrefs !== null && (
    useProfilePrefs === true ? profileHasPrefs : (activeGoal && activeFocus)
  )
  const canProceedStep2 = experienceLevel !== null
  const canProceedStep3 = equipment.length > 0
  const canGenerate = muscleGroups.length > 0

  async function handleGenerate() {
    setStatus('loading')
    setError('')

    try {
      const prompt = buildPrompt({
        goal: activeGoal,
        focus: activeFocus,
        experienceLevel,
        equipment,
        muscleGroups,
        libraryExercises,
      })

      const res = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`)
      }

      const raw = data.choices?.[0]?.message?.content || ''
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No valid JSON returned from AI.')

      const parsed = JSON.parse(jsonMatch[0])
      if (!parsed.name || !parsed.sections) throw new Error('Unexpected response structure.')

      setGeneratedWorkout(parsed)
      setEditedSections(JSON.parse(JSON.stringify(parsed.sections)))
      setStatus('review')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  function updateEntry(sectionKey, index, field, value) {
    setEditedSections(prev => {
      const updated = { ...prev }
      updated[sectionKey] = prev[sectionKey].map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
      return updated
    })
  }

  function handleSave() {
    const workout = {
      name: generatedWorkout.name,
      sections: editedSections,
    }
    onSave(workout)
  }

  function handleAddToLibrary() {
    if (!editedSections) return
    const allExercises = Object.values(editedSections).flat()
    const existingNames = new Set(libraryExercises.map(e => e.name.toLowerCase()))
    allExercises.forEach(entry => {
      if (!existingNames.has(entry.name.toLowerCase())) {
        addExercise({
          name: entry.name,
          type: 'Lift',
          category: muscleGroups[0] || 'Full Body',
          sets: entry.sets,
          reps: entry.reps,
          weight: entry.weight || '',
          muscles: muscleGroups.join(', '),
        })
      }
    })
    setAddedToLibrary(true)
  }

  const libraryWasEmpty = libraryExercises.length === 0

  return (
    <div className="wgm-overlay" onClick={onClose}>
      <div className="wgm-modal" onClick={e => e.stopPropagation()}>
        <div className="wgm-header">
          <div className="wgm-header-left">
            <h2 className="wgm-title">
              {status === 'review' ? generatedWorkout?.name : 'Workout Generator'}
            </h2>
            {status === 'idle' || status === 'error' ? (
              <StepIndicator step={step} />
            ) : null}
          </div>
          <button className="wgm-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="wgm-body">
          {/* ─── STEP 1: Preferences ─── */}
          {status !== 'loading' && status !== 'review' && step === 1 && (
            <div className="wgm-step">
              <p className="wgm-step-label">Step 1 of {TOTAL_STEPS}</p>
              <h3 className="wgm-step-title">Workout Preferences</h3>

              {profileHasPrefs && (
                <>
                  <p className="wgm-question">Use your profile preferences?</p>
                  <p className="wgm-pref-summary">
                    {profile.preferences.goal} · {profile.preferences.focus}
                  </p>
                  <div className="wgm-yes-no">
                    <button
                      className={`wgm-yn-btn ${useProfilePrefs === true ? 'wgm-yn-active' : ''}`}
                      onClick={() => setUseProfilePrefs(true)}
                    >
                      Yes, use defaults
                    </button>
                    <button
                      className={`wgm-yn-btn ${useProfilePrefs === false ? 'wgm-yn-active' : ''}`}
                      onClick={() => setUseProfilePrefs(false)}
                    >
                      No, choose for this workout
                    </button>
                  </div>
                </>
              )}

              {(!profileHasPrefs || useProfilePrefs === false) && (
                <>
                  {!profileHasPrefs && (
                    <p className="wgm-question">Select your preferences for this workout:</p>
                  )}
                  <div className="wgm-pref-group">
                    <label className="wgm-pref-label">Goal</label>
                    <div className="wgm-chip-grid">
                      {GOALS.map(g => (
                        <button
                          key={g}
                          type="button"
                          className={`wgm-chip ${goal === g ? 'wgm-chip-active' : ''}`}
                          onClick={() => setGoal(g)}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="wgm-pref-group">
                    <label className="wgm-pref-label">Focus</label>
                    <div className="wgm-chip-grid">
                      {FOCUSES.map(f => (
                        <button
                          key={f}
                          type="button"
                          className={`wgm-chip ${focus === f ? 'wgm-chip-active' : ''}`}
                          onClick={() => setFocus(f)}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ─── STEP 2: Experience Level ─── */}
          {status !== 'loading' && status !== 'review' && step === 2 && (
            <div className="wgm-step">
              <p className="wgm-step-label">Step 2 of {TOTAL_STEPS}</p>
              <h3 className="wgm-step-title">Experience Level</h3>
              <p className="wgm-question">Rate your training experience (1–5):</p>
              <div className="wgm-exp-grid">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`wgm-exp-btn ${experienceLevel === n ? 'wgm-exp-active' : ''}`}
                    onClick={() => setExperienceLevel(n)}
                  >
                    <span className="wgm-exp-num">{n}</span>
                    <span className="wgm-exp-desc">{EXPERIENCE_LABELS[n]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── STEP 3: Equipment ─── */}
          {status !== 'loading' && status !== 'review' && step === 3 && (
            <div className="wgm-step">
              <p className="wgm-step-label">Step 3 of {TOTAL_STEPS}</p>
              <h3 className="wgm-step-title">Equipment Available</h3>
              <p className="wgm-question">Select everything you have access to:</p>
              <MultiSelect
                options={[...EQUIPMENT, 'All the Above']}
                selected={equipment.length === EQUIPMENT.length ? [...EQUIPMENT, 'All the Above'] : equipment}
                onChange={selected => setEquipment(selected.filter(o => o !== 'All the Above'))}
              />
            </div>
          )}

          {/* ─── STEP 4: Muscle Groups ─── */}
          {status !== 'loading' && status !== 'review' && step === 4 && (
            <div className="wgm-step">
              <p className="wgm-step-label">Step 4 of {TOTAL_STEPS}</p>
              <h3 className="wgm-step-title">Muscle Groups</h3>
              <p className="wgm-question">Which muscles do you want to target?</p>
              <MultiSelect
                options={MUSCLE_GROUPS}
                selected={muscleGroups}
                onChange={setMuscleGroups}
              />
              {status === 'error' && (
                <div className="wgm-error-banner">{error}</div>
              )}
            </div>
          )}

          {/* ─── LOADING ─── */}
          {status === 'loading' && (
            <div className="wgm-loading">
              <div className="wgm-spinner" />
              <p className="wgm-loading-text">Generating your workout…</p>
              <p className="wgm-loading-sub">This usually takes a few seconds</p>
            </div>
          )}

          {/* ─── REVIEW ─── */}
          {status === 'review' && editedSections && (
            <div className="wgm-review">
              <div className="wgm-review-meta">
                <span>{activeGoal} · {activeFocus}</span>
                <span>Level {experienceLevel}/5</span>
              </div>

              {SECTIONS.map(sec => (
                editedSections[sec.key]?.length > 0 && (
                  <div key={sec.key} className="wgm-review-section">
                    <div className="wgm-review-section-label">{sec.label}</div>
                    {editedSections[sec.key].map((entry, i) => (
                      <div key={i} className="wgm-review-row">
                        <span className="wgm-review-index">{i + 1}.</span>
                        <span className="wgm-review-name">{entry.name}</span>
                        <div className="wgm-review-inputs">
                          <label className="wgm-review-field">
                            <span>Sets</span>
                            <input
                              value={entry.sets}
                              onChange={e => updateEntry(sec.key, i, 'sets', e.target.value)}
                            />
                          </label>
                          <label className="wgm-review-field">
                            <span>Reps</span>
                            <input
                              value={entry.reps}
                              onChange={e => updateEntry(sec.key, i, 'reps', e.target.value)}
                            />
                          </label>
                          <label className="wgm-review-field">
                            <span>Weight</span>
                            <input
                              value={entry.weight}
                              onChange={e => updateEntry(sec.key, i, 'weight', e.target.value)}
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ))}

              {libraryWasEmpty && !addedToLibrary && (
                <div className="wgm-add-library-banner">
                  <p>These exercises aren't in your library yet.</p>
                  <button className="wgm-btn-add-library" onClick={handleAddToLibrary}>
                    Add to Exercise Library
                  </button>
                </div>
              )}

              {addedToLibrary && (
                <div className="wgm-added-banner">Exercises added to your library!</div>
              )}
            </div>
          )}
        </div>

        {/* ─── FOOTER ─── */}
        <div className="wgm-footer">
          {status === 'review' ? (
            <>
              <button
                className="wgm-btn-secondary"
                onClick={() => {
                  setStatus('idle')
                  setStep(4)
                  setGeneratedWorkout(null)
                  setEditedSections(null)
                  setAddedToLibrary(false)
                }}
              >
                Regenerate
              </button>
              <button className="wgm-btn-primary" onClick={handleSave}>
                Save Workout
              </button>
            </>
          ) : status === 'loading' ? null : (
            <>
              <button
                className="wgm-btn-secondary"
                onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>

              {step < TOTAL_STEPS ? (
                <button
                  className="wgm-btn-primary"
                  disabled={
                    (step === 1 && !canProceedStep1) ||
                    (step === 2 && !canProceedStep2) ||
                    (step === 3 && !canProceedStep3)
                  }
                  onClick={() => setStep(s => s + 1)}
                >
                  Next
                </button>
              ) : (
                <button
                  className="wgm-btn-primary"
                  disabled={!canGenerate}
                  onClick={handleGenerate}
                >
                  Generate
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
