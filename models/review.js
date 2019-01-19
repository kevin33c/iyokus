const mongoose = require('mongoose');


//Review schema
const ReviewSchema = mongoose.Schema({
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
  stars: {
    type: Number,
    required: true
  },
  comment: {
    type: String
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

const Review = module.exports = mongoose.model('Review', ReviewSchema);

//add review
module.exports.addReview = function (newReview, callback) {
  newReview.save(callback);
};


//check for review
module.exports.getReviewByOfferID = function (id, callback) {
  const query = { offerID: id };
  Review.findOne(query, callback);
};


//check for review
module.exports.getReviewsBySellerID = function (id, callback) {
  const query = { sellerID: id };
  Review.find(query, callback);
};