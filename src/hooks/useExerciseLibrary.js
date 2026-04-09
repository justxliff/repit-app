import { useState, useEffect } from 'react'

const SEED_EXERCISES = [
  { id: 1,  name: 'Push-ups',       category: 'Chest',     muscles: 'Chest, Triceps, Shoulders' },
  { id: 2,  name: 'Pull-ups',       category: 'Back',      muscles: 'Lats, Biceps' },
  { id: 3,  name: 'Squats',         category: 'Legs',      muscles: 'Quads, Glutes, Hamstrings' },
  { id: 4,  name: 'Deadlift',       category: 'Full Body', muscles: 'Hamstrings, Glutes, Back' },
  { id: 5,  name: 'Overhead Press', category: 'Shoulders', muscles: 'Shoulders, Triceps' },
  { id: 6,  name: 'Lunges',         category: 'Legs',      muscles: 'Quads, Glutes' },
  { id: 7,  name: 'Plank',          category: 'Core',      muscles: 'Core, Shoulders' },
  { id: 8,  name: 'Bench Press',    category: 'Chest',     muscles: 'Chest, Triceps, Shoulders' },
  { id: 9,  name: 'Barbell Row',    category: 'Back',      muscles: 'Lats, Rhomboids, Biceps' },
  { id: 10, name: 'Bicep Curls',    category: 'Arms',      muscles: 'Biceps' },
  { id: 11, name: 'Tricep Dips',    category: 'Arms',      muscles: 'Triceps' },
  { id: 12, name: 'Leg Press',      category: 'Legs',      muscles: 'Quads, Glutes' },
  { id: 13, name: 'Crunches',       category: 'Core',      muscles: 'Abs' },
  { id: 14, name: 'Hip Thrust',     category: 'Legs',      muscles: 'Glutes, Hamstrings' },
  { id: 15, name: 'Lat Pulldown',   category: 'Back',      muscles: 'Lats, Biceps' },
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

  const addExercise = ({ name, category, muscles = '' }) => {
    const newEx = { id: Date.now(), name, category, muscles }
    setExercises(prev => {
      const updated = [...prev, newEx]
      localStorage.setItem('repit_exercises', JSON.stringify(updated))
      return updated
    })
    return newEx
  }

  return { exercises, addExercise }
}
