const mongoose = require('mongoose');


//bid schema
const AccountSchema = mongoose.Schema({
  sellerID:{
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  birthDay: {
    type: String
  },
  country: {
    type: String,
    required: true
  },
  postCode: {
    type: String,
    required: true
  },
  address1: {
    type: String,
    required: true
  },
  address2: {
    type: String,
  },
  city: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  cif: {
    type: String
  },
  bankName: {
    type: String,
    required: true
  },
  iban: {
    type: String,
    required: true
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

const Account = module.exports = mongoose.model('Account', AccountSchema);

//add payment
module.exports.addAccount = function (newAccount, callback) {
  newAccount.save(callback);
};

//get acount by sellerID
module.exports.getAccountBySellerID = function (sellerID, callback) {
  const query = { $and: [{ sellerID: sellerID }] };
  Account.find(query, callback).sort({ date: -1 });
};