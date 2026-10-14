import './App.css'
import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:5000/api/workouts'

function App() {
  const [workout, setWorkout] = useState([])
  const [title, setTitle] = useState('')
  const [load, setLoad] = useState('')
  const [reps, setReps] = useState('')

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((tasks) => setWorkout(tasks))
      .catch((error) => console.log(error))
  }, [])

  function addWorkout(event) {
    event.preventDefault()

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        load: load,
        reps: reps,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setWorkout([...workout, data])
        setTitle('')
        setLoad('')
        setReps('')
      })
      .catch((error) => console.log(error))
  }

  function deletewkt(id) {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete workout')
        }
        setWorkout((prevWorkout) =>
          prevWorkout.filter((work) => work._id !== id)
        )
      })
      .catch((error) => console.log(error))
  }

  function formatDate(date) {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div id="app" className="app">
      <header id="app-header" className="app-header">
        <h1 className="app-title">Workout Tracker</h1>
      </header>

      <main id="app-main" className="app-main">
      <section id="workout-list" className="workout-list">
          <h2 className="section-title">Your Workouts</h2>

   {workout.length === 0 && (
         <p id="empty-message" className="empty-message">
              No workouts yet. Add your first one.
            </p>
          )}

          {workout.map((work) => (
            <article key={work._id} className="workout-card">
         <div className="workout-info">
                <h3 className="workout-title">{work.title}</h3>
                <p className="workout-detail">
         <span className="workout-label">Load (kg):</span> {work.load}
                </p>
                <p className="workout-detail">
                  <span className="workout-label">Reps:</span> {work.reps}
                </p>
          <p className="workout-date">{formatDate(work.createdAt)}</p>
              </div>
              <button
          type="button"
                className="btn btn-delete"
          onClick={() => deletewkt(work._id)}
              >
               Delete
              </button>
           </article>
          ))}
        </section>

        <aside id="workout-form-section" className="form-section">
      <form id="workout-form" className="workout-form" onSubmit={addWorkout}>
            <h2 className="section-title">Add a New Workout</h2>

  <label htmlFor="title" className="form-label">
    Exercise title
           </label>
            <input
              id="title"
          className="form-input"
              type="text"
          value={title}
        onChange={(event) => setTitle(event.target.value)}
              required
            />

   <label htmlFor="load" className="form-label">
              Load (in Kgs)
     </label>
            <input
              id="load"
              className="form-input"
       type="number"
       value={load}
         onChange={(event) => setLoad(event.target.value)}
              required
            />

            <label htmlFor="reps" className="form-label">
              Reps
            </label>
            <input
              id="reps"
              className="form-input"
      type="number"
      value={reps}
              onChange={(event) => setReps(event.target.value)}
              required
            />

        <button type="submit" id="add-btn" className="btn btn-add">
              Add Workout
       </button>
    </form>
    </aside>
     </main>
    </div>
  )
}

export default App