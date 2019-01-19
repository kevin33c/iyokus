const mongoose = require('mongoose');

//util recording schema
const UtilRecordingSchema = mongoose.Schema({
  id:{
    type: String,
    required: true
  },
  reason: {
    type: Number, //100: sms request; 200: inbound message
    required: true
  },
  expireDate: {
    type: Date,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}).index({ "expireDate": 1 }, { expireAfterSeconds: 0 }).index({ id: 1, reason: 1 }, { unique: true });

const utilRecording = module.exports = mongoose.model('utilRecording', UtilRecordingSchema);

//add recording
module.exports.addUtilRecording = function (newUtilRecording, callback) {
  newUtilRecording.save(callback);
};

//verify if there is a non-expired valid record 
module.exports.verifyRecord = function (id, reason, callback) {
  const query = { $and: [{ id: id }, { reason: reason }]};
  utilRecording.findOne(query, callback);
};