
import { createContext, useContext, useEffect, useReducer } from 'react';

const WorkoutsContext = createContext();

const initialState = {
  workouts: [],
  isLoading: true,
  error: ''
};

function workoutsReducer(state, action) {
  switch (action.type) {
    case 'SET_WORKOUTS':
      return {
        ...state,
        workouts: action.payload,
        isLoading: false,
        error: ''
      };

    case 'ADD_WORKOUT':
      return {
        ...state,
        workouts: [action.payload, ...state.workouts],
        error: ''
      };

    case 'DELETE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter(
          workout => workout._id !== action.payload
        ),
        error: ''
      };

    case 'UPDATE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.map(workout =>
          workout._id === action.payload._id
            ? action.payload
            : workout
        ),
        error: ''
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: ''
      };

    default:
      return state;
  }
}

export function WorkoutsProvider({ children }) {
  const [state, dispatch] = useReducer(workoutsReducer, initialState);

  const API_URL = 'http://localhost:5000/api/workouts';

  // Load workouts when the application opens
  useEffect(() => {
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not load workouts');
        }

        return response.json();
      })
      .then(data => {
        dispatch({
          type: 'SET_WORKOUTS',
          payload: data
        });
      })
      .catch(error => {
        dispatch({
          type: 'SET_ERROR',
          payload: error.message
        });
      });
  }, []);

  // Add a workout
  function addWorkout(workout) {
    dispatch({ type: 'CLEAR_ERROR' });

    return fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workout)
    })
      .then(response =>
        response.json().then(data => {
          if (!response.ok) {
            throw new Error(data.error || 'Could not add workout');
          }

          return data;
        })
      )
      .then(data => {
        dispatch({
          type: 'ADD_WORKOUT',
          payload: data
        });

        return data;
      })
      .catch(error => {
        dispatch({
          type: 'SET_ERROR',
          payload: error.message
        });

        return null;
      });
  }

  // Delete a workout
  function deleteWorkout(id) {
    dispatch({ type: 'CLEAR_ERROR' });

    return fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
      .then(response =>
        response.json().then(data => {
          if (!response.ok) {
            throw new Error(data.error || 'Could not delete workout');
          }

          return data;
        })
      )
      .then(() => {
        dispatch({
          type: 'DELETE_WORKOUT',
          payload: id
        });
      })
      .catch(error => {
        dispatch({
          type: 'SET_ERROR',
          payload: error.message
        });
      });
  }

  // Update a workout
  function updateWorkout(id, workout) {
    dispatch({ type: 'CLEAR_ERROR' });

    return fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workout)
    })
      .then(response =>
        response.json().then(data => {
          if (!response.ok) {
            throw new Error(data.error || 'Could not update workout');
          }

          return data;
        })
      )
      .then(data => {
        dispatch({
          type: 'UPDATE_WORKOUT',
          payload: data
        });

        return data;
      })
      .catch(error => {
        dispatch({
          type: 'SET_ERROR',
          payload: error.message
        });

        return null;
      });
  }

  function clearError() {
    dispatch({ type: 'CLEAR_ERROR' });
  }

  return (
    <WorkoutsContext.Provider
      value={{
        ...state,
        addWorkout,
        deleteWorkout,
        updateWorkout,
        clearError
      }}
    >
      {children}
    </WorkoutsContext.Provider>
  );
}

export function useWorkoutsContext() {
  return useContext(WorkoutsContext);
}
