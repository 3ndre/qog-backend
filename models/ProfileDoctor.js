const mongoose = require('mongoose');

const ProfileDoctorSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctor'
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  speciality: {
    type: String,
  },
  education: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  createddate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('profiledoctor', ProfileDoctorSchema);
