const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  parentfolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'folder'
  },
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
  },
  filetype: {
    type: String,
  },
  extension: {
    type: String,
  },
  createddate: {
    type: Date,
    default: Date.now
  }
});




module.exports = mongoose.model('file', FileSchema);
