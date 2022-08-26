const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
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
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  bloodgroup: {
    type: String
  },
  phone: {
    type: String
  },
  description: {
    type: String,
  },
  createddate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('profile', ProfileSchema);
