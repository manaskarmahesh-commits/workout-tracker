
const Workout = require('../models/Workout');

// GET all workouts — latest first
const getWorkouts = (req, res) => {
  Workout.find()
    .sort({ createdAt: -1 })
    .then(workouts => res.status(200).json(workouts))
    .catch(error => res.status(500).json({ error: error.message }));
};

// GET a single workout
const getWorkout = (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid workout ID' });
  }

  Workout.findById(req.params.id)
    .then(workout => {
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }

      res.status(200).json(workout);
    })
    .catch(error => res.status(500).json({ error: error.message }));
};

// POST a new workout
const createWorkout = (req, res) => {
  const { title, load, reps } = req.body;

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (load === undefined || load === null || load === '' ||
      typeof load !== 'number' || !Number.isFinite(load)) {
    return res.status(400).json({ error: 'Load must be a number' });
  }

  if (reps === undefined || reps === null || reps === '' ||
      typeof reps !== 'number' || !Number.isFinite(reps)) {
    return res.status(400).json({ error: 'Reps must be a number' });
  }

  Workout.create({
    title: title.trim(),
    load,
    reps
  })
    .then(workout => res.status(201).json(workout))
    .catch(error => {
      if (error.name === 'ValidationError' ||
          error.name === 'CastError') {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: error.message });
    });
};

// DELETE a workout
const deleteWorkout = (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid workout ID' });
  }

  Workout.findByIdAndDelete(req.params.id)
    .then(workout => {
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }

      res.status(200).json(workout);
    })
    .catch(error => res.status(500).json({ error: error.message }));
};

// PATCH a workout
const updateWorkout = (req, res) => {
  const { title, load, reps } = req.body;

  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid workout ID' });
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Provide data to update' });
  }

  if (title !== undefined &&
      (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }

  if (load !== undefined &&
      (typeof load !== 'number' || !Number.isFinite(load))) {
    return res.status(400).json({ error: 'Load must be a number' });
  }

  if (reps !== undefined &&
      (typeof reps !== 'number' || !Number.isFinite(reps))) {
    return res.status(400).json({ error: 'Reps must be a number' });
  }

  const updates = { ...req.body };

  if (title !== undefined) {
    updates.title = title.trim();
  }

  Workout.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  })
    .then(workout => {
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }

      res.status(200).json(workout);
    })
    .catch(error => {
      if (error.name === 'ValidationError' ||
          error.name === 'CastError') {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: error.message });
    });
};

module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
};
