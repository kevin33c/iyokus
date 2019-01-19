const mongoose = require('mongoose');

//bid schema
const BidSchema = mongoose.Schema({
  uuID: {
    type: String,
    required: true,
    unique: true
  },
  userID: {
    type: String,
    required: true
  },
  sellerID: {
    type: String,
    required: true
  },
  productID: {
    type: String,
    required: true
  },
  listed_price: {
    type: Number,
    index: true,
    required: true
  },
  quantity_available: {
    type: Number,
    required: true
  },
  bid: {
    type: Number,
    required: true
  },
  bid_quantity: {
    type: Number,
    default: 1
  },
  expireDate: {
    type: Date,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}).index({ "expireDate": 1 }, { expireAfterSeconds: 0 });

const Bid = module.exports = mongoose.model('Bid', BidSchema);

//add bid
module.exports.addBid = function (newBid, callback) {
  newBid.save(callback);
};


//verify if there is a non-expired valid bid
module.exports.verifyPreviousBid = function (userID, productID, callback) {
  const query = { $and: [{ userID: userID }, { productID: productID }, {expireDate : {$gte: new Date() }}] };
  Bid.findOne(query, callback);
};


//delete bid by uuID
module.exports.deleteBidByUuid = function (id, callback) {
  const query = { uuID: id };
  Bid.deleteOne(query, callback);
};