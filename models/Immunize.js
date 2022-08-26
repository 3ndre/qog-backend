const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImmunizeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId
  },
  vaccineName: {
    type: String,
    required: true
  },
  date: {
    type: String,
  }
});

module.exports = mongoose.model('immunize', ImmunizeSchema);
