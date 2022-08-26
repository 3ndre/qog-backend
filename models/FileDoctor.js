const mongoose = require('mongoose');

const FileDoctorSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctor'
  },
  parentfolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'folderdoctor'
  },
  namedoctor: {
    type: String,
    required: true
  },
  contentdoctor: {
    type: String,
  },
  filetypedoctor: {
    type: String,
  },
  extensiondoctor: {
    type: String,
  },
  createddate: {
    type: Date,
    default: Date.now
  }
});




module.exports = mongoose.model('filedoctor', FileDoctorSchema);
