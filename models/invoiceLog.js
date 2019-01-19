const mongoose = require('mongoose');

//errolog schema
const InvoiceLogSchema = mongoose.Schema({
  invoiceID:{
    type: Number,
    required: true
  },
  offerID: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const invoiceLog = module.exports = mongoose.model('invoiceLog', InvoiceLogSchema);


//add invoice
module.exports.addInvoice = function (newInvoice, callback) {
  newInvoice.save(callback);
};

module.exports.getLaststInvoice = function (callback) {
  invoiceLog.findOne(callback).sort({"date": -1}).limit(1)
};