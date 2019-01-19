const mongoose = require('mongoose');

//errolog schema
const ErrorLogSchema = mongoose.Schema({
  id:{
    type: String,
    required: true
  },
  message: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const errorLog = module.exports = mongoose.model('errorLog', ErrorLogSchema);


//add error log
module.exports.addErrorLog = function (newErrorLog, callback) {
  newErrorLog.save(callback);
};
