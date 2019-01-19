const mongoose = require('mongoose');

//bid schema
const ArchiveBidSchema = mongoose.Schema({
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
});

const archiveBid = module.exports = mongoose.model('archiveBid', ArchiveBidSchema);

//add archiveBid
module.exports.addArchiveBid = function (newArchiveBid, callback) {
  newArchiveBid.save(callback);
};


//delete archiveBid by uuID
module.exports.deleteArchiveBidByUuid = function (id, callback) {
  const query = { uuID: id };
  archiveBid.deleteOne(query, callback);
};