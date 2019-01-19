const mongoose = require('mongoose');

//Offer schema
const ArchiveOfferSchema = mongoose.Schema({
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
    index: true,
    required: true
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
    default: Date.now
  }
});

const archiveOffer = module.exports = mongoose.model('archiveOffer', ArchiveOfferSchema);

//add offer
module.exports.addArchiveOffer = function (newArchiveOffer, callback) {
  newArchiveOffer.save(callback);
};

//get offer by uuid
module.exports.getArchiveOfferByID = function (id, callback) {
  const query = { $and: [{ uuID: id }] };
  archiveOffer.findOne(query, callback);
};



//invalid offer by uuid
module.exports.invalidArchiveOfferByID = function (id, callback) {
  const query = { $and: [{ uuID: id }, { valid: true }, {expireDate : {$gte: new Date() }}] };
  const update = {
    $set: {
      "valid": "false",
      "date": Date()
    }
  };
  archiveOffer.updateOne(query, update, callback);
};

//accept offer by uuid
module.exports.acceptArchiveOfferByID = function (id, callback) {
  const query = { $and: [{ uuID: id }, { valid: true }, {expireDate : {$gte: new Date() }}] };
  const update = {
    $set: {
      "status": "User Accept",
      "date": Date()
    }
  };
  archiveOffer.updateOne(query, update, callback);
};

//reject offer by uuid
module.exports.rejectArchiveOfferByID = function (id, callback) {
  const query = { $and: [{ uuID: id }, { valid: true }, {expireDate : {$gte: new Date() }}] };
  const update = {
    $set: {
      "status": "User Reject",
      "valid": "false",
      "date": Date()
    }
  };
  archiveOffer.updateOne(query, update, callback);
};