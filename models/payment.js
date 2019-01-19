const mongoose = require('mongoose');

//bid schema
const PaymentSchema = mongoose.Schema({
  type: {
    type: String, //-> payout --> refund
    required: true
  },
  paymentID: {
    type: String,
    required: true
  },
  last4: {
    type: String
  },
  brand: {
    type: String
  },
  balance_transaction: {
    type: String,
    required: true
  },
  country: {
    type: String
  },
  sellerID: {
    type: String,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
  offerID: {
    type: String,
    required: true,
  },
  productID: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  fee: {
    type: Number
  },
  amount: {
    type: Number,
    required: true
  },
  cash: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});


const Payment = module.exports = mongoose.model('Payment', PaymentSchema);


//add payment
module.exports.addPayment = function (newPayment, callback) {
  newPayment.save(callback);
};

module.exports.getPayment = function (id, callback) {
  const query = { offerID: id };
  Payment.findOne(query, callback);
};