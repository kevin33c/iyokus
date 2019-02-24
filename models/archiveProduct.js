const mongoose = require('mongoose');

//user schemas
const ArchiveProductSchema = mongoose.Schema({
  productID: {
    type: String,
    required: true,
  },
  sellerID: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    enum: [1, 0],
    default: 1,
    required: true
  },
  condition: {
    type: Number,
    default: 0
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
    default: 2
  },
  isVariant: {
    type: Boolean,
    default: false
  },
  variant1: { //color
    type: [String]
  },
  variant2: { //size
    type: [String]
  },
  description: {
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
  quantity: {
    type: Number,
    default: 1,
    required: true
  },
  tags: {
    type: [String]
  },
  locked_period: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  country: { //ES, GB, US, etc.
    type: String,
    required: true
  },
  location: {
    type: [String],
    required: true
  },
  deliveryMethod: {
    type: Number,
    default: 0,
    required: true
  },
  deliveryCost: {
    type: Number,
    default: 0,
    required: true
  },
  isFreeDelivery: {
    type: Boolean,
    default: false
  },
  return_policy: {
    type: Number,
    required: true
  },
  image_Main: {
    type: String,
    required: true
  },
  image_1: {
    type: String
  },
  image_2: {
    type: String
  },
  image_3: {
    type: String
  },
  relevance: {
    type: Number,
    required: true
  },
  free: {
    type: Boolean,
    default: false
  },
  international: {
    type: Boolean,
    default: false
  },
  isReferenced: {
    type: Boolean,
    default: false
  },
  referenceURL: {
    type: String
  },
  referenceID: {
    type: String
  },
  reason: {
    type: String //new; update; delete
  },
  date: {
    type: Date,
    default: Date.now
  },
});


const archiveProduct = module.exports = mongoose.model('archiveProduct', ArchiveProductSchema);

//add archive product
module.exports.addArchiveProduct = function (newArchiveProduct, callback) {
  newArchiveProduct.save(callback);
};