const mongoose = require('mongoose');

//address schema
const AddressSchema = mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['user'],
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  phone: {
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
    type: String
  },
  city: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Address = module.exports = mongoose.model('Address', AddressSchema);


//add address module
module.exports.addAddress = function (newAddress, callback) {
  newAddress.save(callback);
};

//select address list by userID
module.exports.getAddressByUserID = function (id, callback) {
  const query = { userID: id };
  Address.find(query, callback).sort({ date: -1 });
};

//delete address by productID
module.exports.deleteAddressByID = function (id, callback) {
  const query = { _id: id };
  Address.deleteOne(query, callback);
};

//edit address module
module.exports.editAddressByID = function (id, newAddress, callback) {
  const query = { _id: id };
  const update = {
    $set: {
      "fullname": newAddress.fullname,
      "phone": newAddress.phone,
      "country": newAddress.country,
      "postCode": newAddress.postCode,
      "address1": newAddress.address1,
      "address2": newAddress.address2,
      "city": newAddress.city,
      "region": newAddress.region,
      "date": Date()
    }
  };

  Address.updateOne(query, update, callback);
};

//set address as default
module.exports.defaultAddressByID = function (id, callback) {
  const query = { _id: id };
  const update = {
    $set: {
      "date": Date()
    }
  };

  Address.updateOne(query, update, callback);
};