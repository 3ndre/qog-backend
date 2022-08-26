const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  medName: {
    type: String,
    required: true
  },
  date: {
    type: String,
  },
  status: {
    type: String,
  }
});

module.exports = mongoose.model('med', MedSchema);
