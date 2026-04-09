import { useState, useEffect } from 'react'

const SEED_EXERCISES = [
  { id: 1,  name: 'Push-ups',       category: 'Chest',     type: 'Lift',   muscles: 'Chest, Triceps, Shoulders' },
  { id: 2,  name: 'Pull-ups',       category: 'Back',      type: 'Lift',   muscles: 'Lats, Biceps' },
  { id: 3,  name: 'Squats',         category: 'Legs',      type: 'Lift',   muscles: 'Quads, Glutes, Hamstrings' },
  { id: 4,  name: 'Deadlift',       category: 'Full Body', type: 'Lift',   muscles: 'Hamstrings, Glutes, Back' },
  { id: 5,  name: 'Overhead Press', category: 'Shoulders', type: 'Lift',   muscles: 'Shoulders, Triceps' },
  { id: 6,  name: 'Lunges',         category: 'Legs',      type: 'Lift',   muscles: 'Quads, Glutes' },
  { id: 7,  name: 'Plank',          category: 'Core',      type: 'Stretch',muscles: 'Core, Shoulders' },
  { id: 8,  name: 'Bench Press',    category: 'Chest',     type: 'Lift',   muscles: 'Chest, Triceps, Shoulders' },
  { id: 9,  name: 'Barbell Row',    category: 'Back',      type: 'Lift',   muscles: 'Lats, Rhomboids, Biceps' },
  { id: 10, name: 'Bicep Curls',    category: 'Arms',      type: 'Lift',   muscles: 'Biceps' },
  { id: 11, name: 'Tricep Dips',    category: 'Arms',      type: 'Lift',   muscles: 'Triceps' },
  { id: 12, name: 'Leg Press',      category: 'Legs',      type: 'Lift',   muscles: 'Quads, Glutes' },
  { id: 13, name: 'Crunches',       category: 'Core',      type: 'Lift',   muscles: 'Abs' },
  { id: 14, name: 'Hip Thrust',     category: 'Legs',      type: 'Lift',   muscles: 'Glutes, Hamstrings' },
  { id: 15, name: 'Lat Pulldown',   category: 'Back',      type: 'Lift',   muscles: 'Lats, Biceps' },
]

export default function useExerciseLibrary() {
  const [exercises, setExercises] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('repit_exercises')
    if (stored) {
      setExercises(JSON.parse(stored))
    } else {
      setExercises(SEED_EXERCISES)
      localStorage.setItem('repit_exercises', JSON.stringify(SEED_EXERCISES))
    }
  }, [])

  const nameExists = (name, excludeId = null) =>
    exercises.some(
      ex => ex.name.trim().toLowerCase() === name.trim().toLowerCase() && ex.id !== excludeId
    )

  const addExercise = (exercise) => {
    const newEx = { id: Date.now(), ...exercise }
    setExercises(prev => {
      const updated = [...prev, newEx]
      localStorage.setItem('repit_exercises', JSON.stringify(updated))
      return updated
    })
    return newEx
  }

  const updateExercise = (id, exercise) => {
    setExercises(prev => {
      const updated = prev.map(ex => ex.id === id ? { ...ex, ...exercise, id } : ex)
      localStorage.setItem('repit_exercises', JSON.stringify(updated))
      return updated
    })
  }

  const deleteExercise = (id) => {
    setExercises(prev => {
      const updated = prev.filter(ex => ex.id !== id)
      localStorage.setItem('repit_exercises', JSON.stringify(updated))
      return updated
    })
  }

  return { exercises, addExercise, updateExercise, deleteExercise, nameExists }
}
