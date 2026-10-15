
import { useState } from 'react';
import { format } from 'timeago.js';
import './App.css';
import { useWorkoutsContext } from './WorkoutsContext.jsx';

function App() {
  const {
    workouts,
    isLoading,
    error,
    addWorkout,
    deleteWorkout,
    updateWorkout,
    clearError
  } = useWorkoutsContext();

  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [editId, setEditId] = useState(null);

  function resetForm() {
    setTitle('');
    setLoad('');
    setReps('');
    setEditId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    clearError();

    const workout = {
      title: title.trim(),
      load: Number(load),
      reps: Number(reps)
    };

    if (!workout.title || load === '' || reps === '') {
      return;
    }

    if (editId) {
      updateWorkout(editId, workout).then(data => {
        if (data) {
          resetForm();
        }
      });
    } else {
      addWorkout(workout).then(data => {
        if (data) {
          resetForm();
        }
      });
    }
  }

  function startEditing(workout) {
    setEditId(workout._id);
    setTitle(workout.title);
    setLoad(String(workout.load));
    setReps(String(workout.reps));
    clearError();
  }

  function handleDelete(id) {
    deleteWorkout(id);
  }

  return (
    <main className="app">
      <header className="page-header">
        <h1>Workout Budyyy</h1>
        <p>Track your workouts. Keep making progress.</p>
      </header>

      <section className="workout-form-section">
        <h2>{editId ? 'Update workout' : 'Add a workout'}</h2>

        <form onSubmit={handleSubmit}>
     <label htmlFor="title">Workout title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Bench Press"
            value={title}
            onChange={event => setTitle(event.target.value)}
       required
     />

     <label htmlFor="load">Load (kg)</label>
     <input
       id="load"
       type="number"
       placeholder="e.g. 60"
       value={load}
       onChange={event => setLoad(event.target.value)}
            required
    />

    <label htmlFor="reps">Reps</label>
    <input
      id="reps"
      type="number"
      placeholder="e.g. 10"
            value={reps}
            onChange={event => setReps(event.target.value)}
            required
          />

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <div className="form-buttons">
            <button type="submit">
           {editId ? 'Save changes' : 'Add workout'}
         </button>

         {editId && (
           <button
             type="button"
             className="cancel-button"
             onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="workout-list-section">
        <h2>Your workouts</h2>

        {isLoading && <p>Loading workouts...</p>}

        {!isLoading && !error && workouts.length === 0 && (
          <p>No workouts yet. Add your first workout above.</p>
        )}

        <div className="workout-list">
    {workouts.map(workout => (
      <article className="workout-card" key={workout._id}>
        <div className="workout-details">
          <h3>{workout.title}</h3>
          <p>Load: {workout.load} kg</p>
                <p>Reps: {workout.reps}</p>

                {workout.createdAt && (
                  <p className="timestamp">
                    Added {format(workout.createdAt)}
                  </p>
                )}
              </div>

              <div className="card-buttons">
                <button
                  type="button"
       className="edit-button"
       onClick={() => startEditing(workout)}
     >
       Edit
     </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(workout._id)}
                >
                  Delete
          </button>
        </div>
      </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
