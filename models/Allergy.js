const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AllergySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  allergyCategory: {// food | medication | environment | biologic
    type: String
  },
  encounterDate: {
    type: String
  },
  encounterAge: {
    type: String
  },
  lastOccurence: {
    type: String
  },
  status: {// low | high | unable-to-assess
    type: String
  },
  reaction: { //symptoms
    type: String
  },  
  note: {
    type: String
  },
});

module.exports = mongoose.model('allergy', AllergySchema);
