const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuerySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId
  },
  text: {
    type: String,
    required: true
  },
  firstname: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId
      },
      text: {
        type: String,
        required: true
      },
      firstname: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('query', QuerySchema);
