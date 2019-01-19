const mongoose = require('mongoose');


//Refund schema
const RefundSchema = mongoose.Schema({
  sellerID:{
    type: String,
    required: true
  },
  userID:{
    type: String,
    required: true
  },
  offerID:{
    type: String,
    required: true,
    unique: true
  },
  reason:{
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    required: true
  },
  deliveryFee: {
    type: Number,
  },
  transactionFee: {
    type: Number,
    required: true
  },
  transactionVAT: {
    type: Number,
    required: true
  },
  iyokusFee: {
    type: Number,
    required: true
  },
  feeVAT: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  sellerPayout: {
    type: Number,
    required: true
  },
  refundStatus: {
    type: Number,
    required: true,
    default: 0 //0 raised -> 1 completed/refunded
  },
  date: {
    type: Date,
    default: Date.now
  },
  lastEditDate: {
    type: Date,
    default: Date.now
  },
  processed: {
    type: Boolean,
    default: false
  },
  processedBy: {
    type: String,
    default: null
  },
  processedAt: {
    type: Date,
    default: null
  }
});

const Refund = module.exports = mongoose.model('Refund', RefundSchema);

//add claim
module.exports.addRefund = function (newRefund, callback) {
  newRefund.save(callback);
};
