const mongoose = require('mongoose');

//bid schema
const PaymentCryptoSchema = mongoose.Schema({
  network: {
    type: String,
    required: true
  },
  transaction_id: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  detected_at: {
    type: String,
    required: true
  },
  value: {
    local: {
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: Number,
        required: true
      }
    },
    crypto: {
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: Number,
        required: true
      }
    }
  },
  confirmed_at: {
    type: String,
    required: true
  },
  id: {
    type: String, //55827e9e-e4f8-4665-a85b-4d5cc7158284
    required: true
  },
  code: {
    type: String, //NDQVRFAQ
    required: true
  },
  hosted_url: {
    type: String, //https://commerce.coinbase.com/charges/NDQVRFAQ
    required: true
  },
  block: {
    height: {
      type: String,
      required: true
    },
    hash: {
      type: String,
      required: true
    },
    confirmations: {
      type: String,
      required: true
    },
    confirmations_required: {
      type: String,
      required: true
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const PaymentCrypto = module.exports = mongoose.model('PaymentCrypto', PaymentCryptoSchema);


//add Crypto payment
module.exports.addPaymentCrypto = function (newPaymentCrypto, callback) {
  newPaymentCrypto.save(callback);
};