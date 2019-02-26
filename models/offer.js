const mongoose = require('mongoose');

//Offer schema
const OfferSchema = mongoose.Schema({
  uuID: {
    type: String,
    required: true
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
    required: true
  },
  variant1: { //color
    type: String
  },
  variant2: { //size
    type: String
  },
  bid: {
    type: Number,
    required: true
  },
  bid_quantity: {
    type: Number,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  offer_quantity: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image_Main: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Counter', 'System Accept', 'System Reject', 'User Accept','User Reject'],
    required: true
  },
  valid: {
    type: Boolean,
    default: true
  },
  expireDate: {
    type: Date,
    required: true
  },
  date: {
    type: Date,
    expires: 86400,
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
}).index({ "date": 1 }, { expireAfterSeconds: 86400 });

const Offer = module.exports = mongoose.model('Offer', OfferSchema);

//add offer
module.exports.addOffer = function (newOffer, callback) {
  newOffer.save(callback);
};

//retrieve offer by uuid
module.exports.getOfferByID = function (id, callback) {
  const query = { $and: [{ uuID: id }, { valid: true }, {expireDate : {$gte: new Date() }}] };
  Offer.findOne(query, callback);
  //change to find
};

//get offers by userID
module.exports.getOfferByUserID = function (id, callback) {
  //const query = { userID: id };
  const query = { $and: [{ userID: id }, { status: /Accept/i }]};
  Offer.find(query, callback).sort({ date: -1 });
};

//get offers by sellerID
module.exports.getOfferBySellerID = function (id, callback) {
  const query = { sellerID: id };
  Offer.find(query, callback).sort({ date: -1 });
};

//invalid offer by uuid
module.exports.invalidOfferByID = function (id, callback) {
  const query = { $and: [{ uuID: id }, { valid: true }, {expireDate : {$gte: new Date() }}] };
  const update = {
    $set: {
      "valid": "false",
      "date": Date()
    }
  };
  Offer.updateOne(query, update, callback);
};

//accept offer by uuid
module.exports.acceptOfferByID = function (id, callback) {
  const query = { $and: [{ uuID: id }, { valid: true }, {expireDate : {$gte: new Date() }}] };
  const update = {
    $set: {
      "status": "User Accept",
      "date": Date()
    }
  };
  Offer.updateOne(query, update, callback);
};

//reject offer by uuid
module.exports.rejectOfferByID = function (id, callback) {
  const query = { $and: [{ uuID: id }, { valid: true }, {expireDate : {$gte: new Date() }}] };
  const update = {
    $set: {
      "status": "User Reject",
      "valid": "false",
      "date": Date()
    }
  };
  Offer.updateOne(query, update, callback);
};

//delete offer
module.exports.deleteOfferByID = function (id, callback) {
  const query = { uuID: id };
  Offer.deleteOne(query, callback);
};