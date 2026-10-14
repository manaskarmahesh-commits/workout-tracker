const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Workout = require('./models/workout');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes

// GET all workouts
app.get('/api/workouts', (req, res) => {
      Workout.find()
             .then(data=>res.status(200).json(data))

});



// POST a new workout
app.post('/api/workouts', (req, res) => {
    Workout.create(req.body)
           .then(newworkout=>{
            res.status(201).json(newworkout);
           })

});

// DELETE a workout
app.delete('/api/workouts/:id', (req, res) => {
    Workout.findByIdAndDelete(req.params.id)
    .then((deleteworkout)=>{
           if(!deleteworkout){
            return res.status(404).json({
                message:"workout not found"
            })
           }
           res.status(200).json({
            message:"workout deleted"
           })
    })

});





// MongoDB connection and server startup
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log('Server running');
        });
    })
    .catch((error) => {
        console.log(error);
    });
