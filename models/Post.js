const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  vaccineName: {
    type: String,
    required: true
  },
  vaccineManufacturerName: {
    type: String
  },
  expiryDate: {
    type: Date
  },
  lotNumber: {
    type: String
  },
  doseQty: {
    type: String
  },
  targetDisease: {
    type: String
  },
  performerName: {
    type: String
  },
  institutionType: {
    type: String
  },
  institutionName: {
    type: String
  },
  location: {
    type: String
  },
  note: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('post', PostSchema);
