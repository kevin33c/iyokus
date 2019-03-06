const mongoose = require('mongoose');

//order schema
const OrderSchema = mongoose.Schema({
  //IDs
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
  deliveryMethod: {
    type: Number,
    required: true
  },
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
  //DELIVERY INFO
  delCompany: {
    type: String
  },
  delRef: {
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
    default: "gbp"
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
  verificationCode: {
    type: String,
    required: true
  },
  orderStatus: {
    type: Number,
    enum: [0, 1, 2, 3], //0 Order Received -> 1 Dispatched -> 2 Completed -> 3 cancelled/refunded
    default: 0
  },
  paymentStatus: {
    type: String,
    required: true,
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

const Order = module.exports = mongoose.model('Order', OrderSchema);


//add order
module.exports.addOrder = function (newOrder, callback) {
  newOrder.save(callback);
};

//get all order by ID
module.exports.getOrderByOfferID = function (id, callback) {
  const query = { $and: [{ offerID: id }] };
  Order.findOne(query, callback);
};

//get all order by offerID and userID
module.exports.getOrderByOfferIDandUserID = function (offerID, userID, callback) {
  const query = { $and: [{ offerID: offerID }, { userID: userID }] };
  Order.findOne(query, callback);
};

//get all order by offerID and sellerID
module.exports.getOrderByOfferIDandSellerID = function (offerID, sellerID, callback) {
  const query = { $and: [{ offerID: offerID }, { sellerID: sellerID }] };
  Order.findOne(query, callback).select('-verificationCode');
};

//get all order by user ID
module.exports.getOrdersByUserID = function (id, callback) {
  const query = { $and: [{ userID: id }] };
  Order.find(query, callback).sort({ date: -1 });
};

//get all order by seller ID
module.exports.getOrdersBySellerID = function (id, callback) {
  const query = { $and: [{ sellerID: id }] };
  Order.find(query, callback).sort({ date: -1 }).select('-verificationCode');
};


//update order status to dispatched
module.exports.dispatchOrder = function (id, delCompany, delRef, callback) {
  const query = { offerID: id };
  const update = {
    $set: {
      "orderStatus": 1,
      "delCompany": delCompany,
      "delRef": delRef,
      "lastEditDate": Date()
    }
  };
  Order.findOneAndUpdate(query, update, {new: true}, callback);
};


//update order status to complete
module.exports.changeOrderStatusToComplete = function (id, callback) {
  const query = { offerID: id };
  const update = {
    $set: {
      "orderStatus": 2,
      "lastEditDate": Date()
    }
  };
  Order.updateOne(query, update, callback);
};


//update order status to refunded
module.exports.changeOrderStatusToRefunded = function (id, deliveryFee, callback) {
  const query = { offerID: id };
  const update = {
    $set: {
      "orderStatus": 3,
      "sellerPayout": deliveryFee,
      "lastEditDate": Date()
    }
  };
  Order.updateOne(query, update, callback);
};