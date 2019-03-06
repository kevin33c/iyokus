const mongoose = require('mongoose');

//order schema
const StagingOrderSchema = mongoose.Schema({
  //IDs
  offerID:{
    type: String,
    required: true
  },
  userID:{
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
  deliveryMethod: {
    type: Number,
    enum: [0, 1],
    required: true
  },
  //delivery address inf
  ProductType: {
    type: Number,
    enum: [0, 1],
    required: true
  },
  name: {
    type: String
  },
  country: {
    type: String
  },
  postCode: {
    type: String
  },
  address1: {
    type: String
  },
  address2: {
    type: String
  },
  city: {
    type: String
  },
  region: {
    type: String
  },
  phone: {
    type: String
  },
  //offer infor
  productName: {
    type: String,
    required: true
  },
  image_Main: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: "eur"
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true
  },
  variant1: { //color
    type: String
  },
  variant2: { //size
    type: String
  },
  isInternational: {
    type: Boolean,
  },
  referenceURL: {
    type: String
  },
  date: {
    type: Date,
    expires: 3600,
    default: Date.now
  }
}).index({ "date": 1 }, { expireAfterSeconds: 3600 });


const StagingOrder = module.exports = mongoose.model('StagingOrder', StagingOrderSchema);

//add order
module.exports.addStagingOrder = function (newStagingOrder, callback) {
  newStagingOrder.save(callback);
};


//retrieve order by offerID
module.exports.getStagingOrderByID = function (id, callback) {
  const query = { $and: [{ offerID: id }] };
  StagingOrder.findOne(query, callback).sort({ date: -1 });
};
