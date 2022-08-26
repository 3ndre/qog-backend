const mongoose = require('mongoose');

const FolderDoctorSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctor'
  },
  parentfolderdoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'folderdoctor'
  },
  namedoctor: {
    type: String,
    required: true
  },
  createddate: {
    type: Date,
    default: Date.now
  }
});

FolderDoctorSchema.statics.findOneOrCreate = function findOneOrCreate(condition, doc) {
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




module.exports = mongoose.model('folderdoctor', FolderDoctorSchema);
