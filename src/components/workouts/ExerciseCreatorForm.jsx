import { useState } from 'react'
import './ExerciseCreatorForm.css'

const TYPES = ['Cardio', 'Stretch', 'Lift', 'Custom']

const emptyForm = () => ({
  name: '',
  type: '',
  customType: '',
  setsMode: 'Number',
  setsValue: '',
  repsMode: 'Number',
  repsNumber: '',
  repsMins: '',
  repsSecs: '',
  weight: '',
})

function Pill({ options, value, onChange }) {
  return (
    <div className="ecf-pills">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          className={`ecf-pill ${value === opt ? 'active' : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function SetsBlock({ form, setForm, prefix = '' }) {
  const setKey  = `${prefix}setsMode`
  const valKey  = `${prefix}setsValue`
  return (
    <div className="ecf-field">
      <label className="ecf-label">Sets <span className="ecf-req">*</span></label>
      <Pill
        options={['Number', 'Failure']}
        value={form[setKey]}
        onChange={v => setForm(p => ({ ...p, [setKey]: v, [valKey]: '' }))}
      />
      {form[setKey] === 'Number' && (
        <input
          className="ecf-input"
          type="number"
          min="1"
          placeholder="e.g. 3"
          value={form[valKey]}
          onChange={e => setForm(p => ({ ...p, [valKey]: e.target.value }))}
        />
      )}
    </div>
  )
}

function RepsBlock({ form, setForm, prefix = '' }) {
  const modeKey = `${prefix}repsMode`
  const numKey  = `${prefix}repsNumber`
  const minKey  = `${prefix}repsMins`
  const secKey  = `${prefix}repsSecs`
  return (
    <div className="ecf-field">
      <label className="ecf-label">Reps <span className="ecf-req">*</span></label>
      <Pill
        options={['Number', 'Time', 'Failure']}
        value={form[modeKey]}
        onChange={v => setForm(p => ({ ...p, [modeKey]: v, [numKey]: '', [minKey]: '', [secKey]: '' }))}
      />
      {form[modeKey] === 'Number' && (
        <input
          className="ecf-input"
          type="number"
          min="1"
          placeholder="e.g. 10"
          value={form[numKey]}
          onChange={e => setForm(p => ({ ...p, [numKey]: e.target.value }))}
        />
      )}
      {form[modeKey] === 'Time' && (
        <div className="ecf-time-row">
          <div className="ecf-time-wrap">
            <input
              className="ecf-input ecf-time-input"
              type="number"
              min="0"
              placeholder="0"
              value={form[minKey]}
              onChange={e => setForm(p => ({ ...p, [minKey]: e.target.value }))}
            />
            <span className="ecf-time-unit">min</span>
          </div>
          <div className="ecf-time-wrap">
            <input
              className="ecf-input ecf-time-input"
              type="number"
              min="0"
              max="59"
              placeholder="0"
              value={form[secKey]}
              onChange={e => setForm(p => ({ ...p, [secKey]: e.target.value }))}
            />
            <span className="ecf-time-unit">sec</span>
          </div>
        </div>
      )}
    </div>
  )
}

function validateForm(form, nameExists, allowSuperSet, errors = {}) {
  const errs = { ...errors }

  if (!form.name.trim()) {
    errs.name = 'Name is required'
  } else if (nameExists(form.name)) {
    errs.name = 'An exercise with this name already exists'
  }

  if (!form.type) errs.type = 'Type is required'
  if (form.type === 'Custom' && !form.customType.trim()) errs.customType = 'Custom type cannot be empty'

  if (form.setsMode === 'Number') {
    const n = Number(form.setsValue)
    if (!form.setsValue || isNaN(n) || !Number.isInteger(n) || n < 1)
      errs.sets = 'Enter a valid positive integer for sets'
  }

  if (form.repsMode === 'Number') {
    const n = Number(form.repsNumber)
    if (!form.repsNumber || isNaN(n) || !Number.isInteger(n) || n < 1)
      errs.reps = 'Enter a valid positive integer for reps'
  } else if (form.repsMode === 'Time') {
    const mins = Number(form.repsMins)
    const secs = Number(form.repsSecs)
    if ((!form.repsMins && !form.repsSecs) || isNaN(mins) || isNaN(secs) || secs < 0 || secs > 59 || mins < 0)
      errs.reps = 'Enter a valid time (minutes 0+ and seconds 0–59)'
  }

  if (form.weight !== '') {
    const n = Number(form.weight)
    if (isNaN(n) || !Number.isInteger(n) || n < 1)
      errs.weight = 'Weight must be a valid positive integer'
  }

  return errs
}

function buildExerciseData(form, superSetData = null) {
  return {
    name: form.name.trim(),
    type: form.type === 'Custom' ? form.customType.trim() : form.type,
    category: form.type === 'Custom' ? form.customType.trim() : form.type,
    sets: form.setsMode === 'Failure' ? 'Failure' : Number(form.setsValue),
    reps: form.repsMode === 'Failure'
      ? 'Failure'
      : form.repsMode === 'Time'
        ? `${form.repsMins || 0}m ${form.repsSecs || 0}s`
        : Number(form.repsNumber),
    weight: form.weight !== '' ? Number(form.weight) : null,
    superSet: superSetData,
    muscles: '',
  }
}

function ReviewRow({ label, value }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="ecf-review-row">
      <span className="ecf-review-label">{label}</span>
      <span className="ecf-review-value">{String(value)}</span>
    </div>
  )
}

export default function ExerciseCreatorForm({ onSave, onCancel, exercises = [], allowSuperSet = true }) {
  const [view, setView]       = useState('form')
  const [form, setForm]       = useState(emptyForm())
  const [errors, setErrors]   = useState({})
  const [hasSuperSet, setHasSuperSet] = useState(false)
  const [ssType, setSsType]   = useState('existing')
  const [ssExId, setSsExId]   = useState('')
  const [ssForm, setSsForm]   = useState(emptyForm())
  const [ssErrors, setSsErrors] = useState({})

  const nameExists = (name) =>
    exercises.some(ex => ex.name.trim().toLowerCase() === name.trim().toLowerCase())

  const ssNameExists = (name) =>
    nameExists(name) || name.trim().toLowerCase() === form.name.trim().toLowerCase()

  const handleReview = () => {
    const errs = validateForm(form, nameExists, allowSuperSet)

    let ssErrs = {}
    if (hasSuperSet && ssType === 'new') {
      ssErrs = validateForm(ssForm, ssNameExists, false)
    }

    setErrors(errs)
    setSsErrors(ssErrs)
    if (Object.keys(errs).length === 0 && Object.keys(ssErrs).length === 0) {
      setView('review')
    }
  }

  const handleSave = () => {
    let superSetData = null
    if (hasSuperSet) {
      if (ssType === 'existing') {
        const linked = exercises.find(ex => ex.id === Number(ssExId))
        superSetData = linked ? { type: 'existing', exercise: linked } : null
      } else {
        superSetData = { type: 'new', exercise: buildExerciseData(ssForm) }
      }
    }
    onSave(buildExerciseData(form, superSetData))
  }

  if (view === 'review') {
    const isExistingSS = hasSuperSet && ssType === 'existing'
    const linkedEx = isExistingSS ? exercises.find(ex => ex.id === Number(ssExId)) : null
    return (
      <div className="ecf-review">
        <div className="ecf-review-title">Review Exercise</div>
        <div className="ecf-review-section">
          <ReviewRow label="Name" value={form.name} />
          <ReviewRow label="Type" value={form.type === 'Custom' ? form.customType : form.type} />
          <ReviewRow label="Sets" value={form.setsMode === 'Failure' ? 'To Failure' : `${form.setsValue} sets`} />
          <ReviewRow
            label="Reps"
            value={
              form.repsMode === 'Failure' ? 'To Failure'
              : form.repsMode === 'Time' ? `${form.repsMins || 0}m ${form.repsSecs || 0}s`
              : `${form.repsNumber} reps`
            }
          />
          {form.weight !== '' && <ReviewRow label="Weight" value={`${form.weight} lbs`} />}
        </div>

        {hasSuperSet && (
          <div className="ecf-review-section">
            <div className="ecf-review-section-label">Super Set</div>
            {isExistingSS && linkedEx && (
              <ReviewRow label="Linked Exercise" value={linkedEx.name} />
            )}
            {ssType === 'new' && (
              <>
                <ReviewRow label="Name" value={ssForm.name} />
                <ReviewRow label="Type" value={ssForm.type === 'Custom' ? ssForm.customType : ssForm.type} />
                <ReviewRow label="Sets" value={ssForm.setsMode === 'Failure' ? 'To Failure' : `${ssForm.setsValue} sets`} />
                <ReviewRow
                  label="Reps"
                  value={
                    ssForm.repsMode === 'Failure' ? 'To Failure'
                    : ssForm.repsMode === 'Time' ? `${ssForm.repsMins || 0}m ${ssForm.repsSecs || 0}s`
                    : `${ssForm.repsNumber} reps`
                  }
                />
                {ssForm.weight !== '' && <ReviewRow label="Weight" value={`${ssForm.weight} lbs`} />}
              </>
            )}
          </div>
        )}

        <div className="ecf-review-actions">
          <button className="ecf-btn-secondary" onClick={() => setView('form')}>Edit</button>
          <button className="ecf-btn-primary" onClick={handleSave}>Save Exercise</button>
        </div>
      </div>
    )
  }

  return (
    <div className="ecf-form">
      <div className="ecf-field">
        <label className="ecf-label">Name <span className="ecf-req">*</span></label>
        <input
          className={`ecf-input ${errors.name ? 'ecf-error-input' : ''}`}
          placeholder="e.g. Romanian Deadlift"
          value={form.name}
          onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })) }}
        />
        {errors.name && <span className="ecf-error-msg">{errors.name}</span>}
      </div>

      <div className="ecf-field">
        <label className="ecf-label">Type <span className="ecf-req">*</span></label>
        <Pill
          options={TYPES}
          value={form.type}
          onChange={v => { setForm(p => ({ ...p, type: v, customType: '' })); setErrors(p => ({ ...p, type: '', customType: '' })) }}
        />
        {errors.type && <span className="ecf-error-msg">{errors.type}</span>}
        {form.type === 'Custom' && (
          <>
            <input
              className={`ecf-input ${errors.customType ? 'ecf-error-input' : ''}`}
              placeholder="Enter custom type..."
              value={form.customType}
              onChange={e => { setForm(p => ({ ...p, customType: e.target.value })); setErrors(p => ({ ...p, customType: '' })) }}
            />
            {errors.customType && <span className="ecf-error-msg">{errors.customType}</span>}
          </>
        )}
      </div>

      <SetsBlock form={form} setForm={setForm} />
      {errors.sets && <span className="ecf-error-msg ecf-error-offset">{errors.sets}</span>}

      <RepsBlock form={form} setForm={setForm} />
      {errors.reps && <span className="ecf-error-msg ecf-error-offset">{errors.reps}</span>}

      <div className="ecf-field">
        <label className="ecf-label">Weight <span className="ecf-optional">(optional)</span></label>
        <div className="ecf-input-row">
          <input
            className={`ecf-input ${errors.weight ? 'ecf-error-input' : ''}`}
            type="number"
            min="1"
            placeholder="e.g. 135"
            value={form.weight}
            onChange={e => { setForm(p => ({ ...p, weight: e.target.value })); setErrors(p => ({ ...p, weight: '' })) }}
          />
          <span className="ecf-unit">lbs</span>
        </div>
        {errors.weight && <span className="ecf-error-msg">{errors.weight}</span>}
      </div>

      {allowSuperSet && (
        <div className="ecf-field">
          <div className="ecf-toggle-row">
            <label className="ecf-label">Super Set <span className="ecf-optional">(optional)</span></label>
            <button
              type="button"
              className={`ecf-toggle ${hasSuperSet ? 'on' : ''}`}
              onClick={() => setHasSuperSet(p => !p)}
            >
              {hasSuperSet ? 'On' : 'Off'}
            </button>
          </div>

          {hasSuperSet && (
            <div className="ecf-superset-block">
              <Pill
                options={['existing', 'new']}
                value={ssType}
                onChange={v => { setSsType(v); setSsExId(''); setSsForm(emptyForm()) }}
              />

              {ssType === 'existing' && (
                <select
                  className="ecf-select"
                  value={ssExId}
                  onChange={e => setSsExId(e.target.value)}
                >
                  <option value="">Select an exercise...</option>
                  {exercises.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              )}

              {ssType === 'new' && (
                <div className="ecf-ss-new-form">
                  <div className="ecf-ss-divider">New Super Set Exercise</div>
                  <div className="ecf-field">
                    <label className="ecf-label">Name <span className="ecf-req">*</span></label>
                    <input
                      className={`ecf-input ${ssErrors.name ? 'ecf-error-input' : ''}`}
                      placeholder="e.g. Hammer Curl"
                      value={ssForm.name}
                      onChange={e => { setSsForm(p => ({ ...p, name: e.target.value })); setSsErrors(p => ({ ...p, name: '' })) }}
                    />
                    {ssErrors.name && <span className="ecf-error-msg">{ssErrors.name}</span>}
                  </div>

                  <div className="ecf-field">
                    <label className="ecf-label">Type <span className="ecf-req">*</span></label>
                    <Pill
                      options={TYPES}
                      value={ssForm.type}
                      onChange={v => { setSsForm(p => ({ ...p, type: v, customType: '' })); setSsErrors(p => ({ ...p, type: '' })) }}
                    />
                    {ssErrors.type && <span className="ecf-error-msg">{ssErrors.type}</span>}
                    {ssForm.type === 'Custom' && (
                      <>
                        <input
                          className={`ecf-input ${ssErrors.customType ? 'ecf-error-input' : ''}`}
                          placeholder="Enter custom type..."
                          value={ssForm.customType}
                          onChange={e => { setSsForm(p => ({ ...p, customType: e.target.value })); setSsErrors(p => ({ ...p, customType: '' })) }}
                        />
                        {ssErrors.customType && <span className="ecf-error-msg">{ssErrors.customType}</span>}
                      </>
                    )}
                  </div>

                  <SetsBlock form={ssForm} setForm={setSsForm} />
                  {ssErrors.sets && <span className="ecf-error-msg ecf-error-offset">{ssErrors.sets}</span>}

                  <RepsBlock form={ssForm} setForm={setSsForm} />
                  {ssErrors.reps && <span className="ecf-error-msg ecf-error-offset">{ssErrors.reps}</span>}

                  <div className="ecf-field">
                    <label className="ecf-label">Weight <span className="ecf-optional">(optional)</span></label>
                    <div className="ecf-input-row">
                      <input
                        className="ecf-input"
                        type="number"
                        min="1"
                        placeholder="e.g. 25"
                        value={ssForm.weight}
                        onChange={e => setSsForm(p => ({ ...p, weight: e.target.value }))}
                      />
                      <span className="ecf-unit">lbs</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="ecf-form-actions">
        <button type="button" className="ecf-btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="button" className="ecf-btn-primary" onClick={handleReview}>Review &amp; Save</button>
      </div>
    </div>
  )
}
