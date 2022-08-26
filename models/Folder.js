const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
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
  createddate: {
    type: Date,
    default: Date.now
  }
});

FolderSchema.statics.findOneOrCreate = function findOneOrCreate(condition, doc) {
    const self = this;
    const newDocument = doc;

    return new Promise((resolve, reject) => {

        return self.findOne(condition)
            .then((result) => {
                if (result) {
                    return resolve(result);
                }
                return self.create(newDocument)
                    .then((result) => {
                        return resolve(result);
                    }).catch((error) => {
                        return reject(error);
                    })
            }).catch((error) => {
                return reject(error);
                })
        });
};




module.exports = mongoose.model('folder', FolderSchema);
