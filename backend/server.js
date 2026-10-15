
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const workoutRoutes = require('./routes/workoutRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/workouts', workoutRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(error => {
    console.log('MongoDB connection error:', error.message);
  });
