const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const ProductVisitSchema = new Schema({
  productID:{
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
  userID:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const ProductVisit = module.exports = mongoose.model('ProductVisit', ProductVisitSchema);

module.exports.addProductVisit = function (newProductVisit, callback) {
  newProductVisit.save(callback);
};