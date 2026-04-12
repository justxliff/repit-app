import { useState, useEffect } from 'react'

export default function useWorkouts(email) {
  const [workouts, setWorkouts] = useState([])

  useEffect(() => {
    if (!email) return
    const stored = localStorage.getItem(`repit_workouts_${email}`)
    if (stored) setWorkouts(JSON.parse(stored))
  }, [email])

  const saveWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
    setWorkouts(prev => {
      const updated = [newWorkout, ...prev]
      localStorage.setItem(`repit_workouts_${email}`, JSON.stringify(updated))
      return updated
    })
  }

  const updateWorkout = (id, changes) => {
    setWorkouts(prev => {
      const updated = prev.map(w => w.id === id ? { ...w, ...changes } : w)
      localStorage.setItem(`repit_workouts_${email}`, JSON.stringify(updated))
      return updated
    })
  }

  return { workouts, saveWorkout, updateWorkout }
}
