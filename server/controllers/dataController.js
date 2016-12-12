import workouts from '../../client/config/workouts';
import Workout from '../schema/workout_schema';
import Program from '../schema/program_schema';

const mongoose = require('mongoose');

exports.submitWorkout = (req, res, next) => {
  const workout_key = req.body.workoutKey; // [phase, day, week]
  const workoutData = req.body.workoutData; // { exercise: [], ... }
  const user_id = req.body.userId;
  const program_id = req.body.programId;
  const stop_time = new Date;

  //-------------------
  // Error Handling
  //-------------------

  // Return error if no user ID is provided
  if (!user_id) {
    return res.status(422).send({ error: 'No user id was provided.' });
  }

  // Return error if workout Key is provided
  if (!workoutKey) {
    return res.status(422).send({ error: 'No workout key was provided.' });
  }

  // Return error if no workout data is provided
  if (!workoutData) {
    return res.status(422).send({ error: 'No workout data was provided.' });
  }

  Workout.findOne({ user_id, program_id }, (err, existingWorkout) => {
    // If error, return error
    if (err) { return next(err); }

    // If this user already has a program of type programType, send warning 
    if (existingWorkout) {
      return res.status().send({ error: 'That workout already exists for this program.' });
    }

    const workout = new Workout({
      user_id,
      program_id,
      stop_date,
      workout_key,
      exercises: workoutData,
    });

    workout.save((err, workout) => {
      if (err) { return next(err); }

      // update user cookie?
      res.status(200).send({
        msg: 'Success',
      });
    });
  });
}

exports.createNewProgram = (req, res, next) => {
  const programType = req.body.programType;
  const user_id = req.body.userId;
  const last_modified = new Date;
  const start_date = new Date;

  //-------------------
  // Error Handling
  //-------------------

  // Return error if no program type is provided
  if (!programType) {
    return res.status(422).send({ error: 'No program type was provided.' });
  }

  // Return error if no user ID is provided
  if (!user_id) {
    return res.status(422).send({ error: 'No user id was provided.' });
  }

  Program.findOne({ user_id, programType }, (err, existingProgram) => {
    // If error, return error
    if (err) { return next(err); }

    // If this user already has a program of type programType, send warning --> this should be refactored to test if the `existingProgram` is **incomplete**
    // if (existingProgram) {
    //   return res.status().send({ error: 'That program already exists' });
    // }

    // const Program = mongoose.model('Program');

    const program = new Program({
      user_id,
      last_modified,
      start_date,
      program_type: programType,
    });

    program.save((err, program) => {
      if (err) { return next(err); }

      // update user cookie?
      res.status(200).json({
        program,
      });
    });
  });
}

exports.getCurrentProgram = (req, res, next) => {
  const user_id = req.query.user_id;
  console.log(user_id);
  
  if (!user_id) {
    return res.status(422).send({ error: 'No user ID was provided.' });
  }

  // Get all Programs for user and sort descending
  Program
    .find({ user_id })
    .sort({ last_modified: 'desc' })
    .exec((err, programs) => {
    
      // If error, return error
      if (err) { return next(err); }

      if (!programs) { 
        return res.status(422).send({ error: 'This user has no programs.' });
      }

      // received all programs associated with user_id?
      // console.log(programs); 

      const currentProgram = programs[0]; // if sort desc worked, most current is at index 0

      res.status(200).json({
        currentProgram,
      });
    });
}