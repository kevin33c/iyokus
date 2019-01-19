const mongoose = require('mongoose');


//Refund schema
const ClaimSchema = mongoose.Schema({
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
    required: true
  },
  reason:{
    type: String,
    required: true
  },
  comment:{
    type: String,
  },
  status: {
    type: Number,
    required: true,
    default: 0 //0 raised -> 1 completed
  },
  date: {
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

const Claim = module.exports = mongoose.model('Claim', ClaimSchema);

//add claim
module.exports.addClaim = function (newClaim, callback) {
  newClaim.save(callback);
};
