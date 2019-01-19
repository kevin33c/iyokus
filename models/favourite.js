const mongoose = require('mongoose');

//favourite schema
const FavouriteSchema = mongoose.Schema({
  userID:{
    type: String,
    required: true
  },
  productID: {
    type: String,
    required: true
  },
  sellerID: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  image_Main: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}).index({ userID: 1, productID: 1 }, { unique: true });

const Favourite = module.exports = mongoose.model('Favourite', FavouriteSchema);


//add product module
module.exports.addFavourite = function (newFavourite, callback) {
  newFavourite.save(callback);
};

//select address list by userID
module.exports.getFavouriteByUserID = function (id, callback) {
  const query = { userID: id };
  Favourite.find(query, callback).sort({ date: -1 });
};

//delete address by productID
module.exports.deleteFavouriteByID = function (userID, productID, callback) {
  const query = { $and: [{ userID: userID }, { productID: productID }] };
  Favourite.deleteOne(query, callback);
};

