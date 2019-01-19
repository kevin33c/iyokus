const mongoose = require('mongoose');

//order schema
const FulfilmentSchema = mongoose.Schema({
  //************IDs*************/
  offerID: {
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
  //************IDs*************/

  //************Product Information*************/
  deliveryMethod: {
    type: Number,
    enum: [0, 1],
    required: true
  },
  location: {
    type: String
  },
  productName: {
    type: String,
    required: true
  },
  image_Main: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    enum: [1, 0],
    required: true
  },
  condition: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  gender: {
    type: Number,
    enum: [0, 1, 2],
    required: true
  },
  //************Product Information*************/

  //************Pricing Information*************/
  currency: {
    type: String,
    required: true
  },
  listed_price: {
    type: Number,
    required: true
  },
  reserve_price: {
    type: Number,
    required: true
  },
  bid: {
    type: Number,
    default: 999999
  },
  bid_quantity: {
    type: Number,
    default: 999999
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },

  //************Pricing Information*************/

  //************Payment & Fees Information*************/
  deliveryFee: {
    type: Number,
    default: 0
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
  //************Payment & Fees Information*************/
  orderDate: {
    type: Date,
    required: true
  },
  payoutToSeller: {
    type: Boolean,
    default: false,
    required: true
  },
  //************Status*************/
  fulfilmentStatus: {
    type: Number,
    enum: [0, 1], //1 complete -> 0 refunded
    default: 1
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

const Fulfilment = module.exports = mongoose.model('Fulfilment', FulfilmentSchema);

//add fulfilment
module.exports.addFulfilment = function (newFulfilment, callback) {
  newFulfilment.save(callback);
};

//get fulfilment information for seller
module.exports.getFulfilmentsBySellerID = function (id, fromDate, toDate, callback) {
  const query = { $and: [{ sellerID: id }, { "date": { "$gte": new Date(fromDate), "$lte": new Date(toDate) } }] };

  Fulfilment.find(query, callback).sort({ date: -1 });
};


//update fulfilment status to refunded
module.exports.changeFulfilmentStatusToRefunded = function (id, deliveryFee, payoutToSeller, callback) {
  const query = { offerID: id };
  const update = {
    $set: {
      "fulfilmentStatus": 0,
      "sellerPayout": deliveryFee,
      "payoutToSeller": payoutToSeller,
      "lastEditDate": Date()
    }
  };
  Fulfilment.updateOne(query, update, callback);
};