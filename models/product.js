const mongoose = require('mongoose');

//user schemas
const ProductSchema = mongoose.Schema({
  productID: {
    type: String,
    required: true,
    unique: true
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
    enum: [0, 1],
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
  status: {
    type: String,
    enum: ['published', 'inactive', 'deleted'],
    default: 'inactive'
  },
  relevance: {
    type: Number,
    required: true
  },
  view_count: {
    type: Number,
    default: 0
  },
  sales_count: {
    type: Number,
    default: 0
  },
  free: {
    type: Boolean,
    default: false
  },
  isInternational: {
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
  verified: {
    type: Boolean,
    default: true
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
  },
}).index({ name: 'text', brand: 'text', description: 'text', tags: 'text' }, { name: 'Iyokus index', weights: { name: 10, brand: 8, description: 3, tags: 3 } })



const Product = module.exports = mongoose.model('Product', ProductSchema);

//add product module
module.exports.addProduct = function (newProduct, callback) {
  newProduct.save(callback);
};

//select product list by SellerID
module.exports.getProductBySellerID = function (sellerID, status, callback) {
  const query = { $and: [{ sellerID: sellerID }, { status: status }] };
  Product.find(query, callback).sort({ date: -1 });
};

//select product to edit by _id
module.exports.getProductByProductID = function (id, sellerID, callback) {
  const query = { $and: [{ _id: id }, { sellerID: sellerID }] };
  Product.findOne(query, callback);
};

//delete product by _id
module.exports.deleteProductByProductID = function (id, callback) {

  const query = { _id: id };
  const update = {
    $set: {
      "status": "deleted",
      "lastEditDate": Date()
    }
  };
  Product.updateOne(query, update, callback);

};


//edit product
module.exports.editProductByID = function (id, newProduct, callback) {
  const query = { _id: id };
  const update = {
    $set: {
      "name": newProduct.name,
      "type": newProduct.type,
      "condition": newProduct.condition,
      "brand": newProduct.brand,
      "category": newProduct.category,
      "subcategory": newProduct.subcategory,
      "gender": newProduct.gender,
      "isVariant": newProduct.isVariant,
      "variant1": newProduct.variant1,
      "variant2": newProduct.variant2,
      "description": newProduct.description,
      "listed_price": newProduct.listed_price,
      "reserve_price": newProduct.reserve_price,
      "quantity": newProduct.quantity,
      "tags": newProduct.tags,
      "locked_period": newProduct.locked_period,
      "currency": newProduct.currency,
      "country": newProduct.country,
      "location": newProduct.location,
      "deliveryMethod": newProduct.deliveryMethod,
      "deliveryCost": newProduct.deliveryCost,
      "isFreeDelivery": newProduct.isFreeDelivery,
      "return_policy": newProduct.return_policy,
      "image_Main": newProduct.image_Main,
      "image_1": newProduct.image_1,
      "image_2": newProduct.image_2,
      "image_3": newProduct.image_3,
      "isInternational": newProduct.isInternational,
      "isReferenced": newProduct.isReferenced,
      "referenceURL": newProduct.referenceURL,
      "referenceID": newProduct.referenceID,
      "lastEditDate": Date(),
      "processed": false //so admin can pick up the update for review
    }
  };
  Product.updateOne(query, update, callback);
};

//publish product
module.exports.publishProductByID = function (id, callback) {
  const query = { _id: id };
  const update = {
    $set: {
      "status": "published",
      "lastEditDate": Date()
    }
  };
  Product.updateOne(query, update, callback);
};

//take down product
module.exports.downProductByID = function (id, callback) {
  const query = { _id: id };
  const update = {
    $set: {
      "status": "inactive",
      "lastEditDate": Date()
    }
  };
  Product.updateOne(query, update, callback);
};

//select product by _id
module.exports.getPublishedProductByID = function (id, callback) {
  const query = { $and: [{ _id: id }, { status: "published" }, { verified: true }] };
  Product.findOne(query, callback).select('-reserve_price -sales_count -referenceURL');
};

//select product by _id
module.exports.getPublishedProductExByID = function (id, callback) {
  const query = { $and: [{ _id: id }, { verified: true }] };
  Product.findOne(query, callback).select('-reserve_price -sales_count -referenceURL');
};

//increase product view count
module.exports.increaseViewCountByID = function (id, callback) {
  const query = { _id: id };
  const update = {
    $inc: { view_count: 1 }
  };
  Product.updateOne(query, update, callback);
};

//decrease product unit sold from quantity AND incrase sales count
module.exports.decreaseInventoryByID = function (id, quantity, callback) {
  const query = { _id: id };
  const update = {
    $inc: { quantity: quantity * -1, sales_count: quantity }
  };
  Product.updateOne(query, update, callback);
};

//search product by category
module.exports.searchProductByCategory = function (category, location, callback) {

  //parse the string to array object
  location = JSON.parse(location)

  //if user not login or not defined location speficiation OR required All locations
  if (location == null || location == undefined || contains.call(location, 'All') || location.length == 0) {
    var query = { $and: [{ category: category }, { status: "published" }, { verified: true }] }
  } else {
    //if specific location(s) required
    var query = {
      $or: [{ $and: [{ category: category }, { status: "published" }, { location: { $in: location } }, { verified: true }] },
      { $and: [{ category: category }, { status: "published" }, { deliveryMethod: 1 }, { verified: true }] }]
    };
  };

  Product.find(query, callback).sort({ relevance: -1 }).limit(1000).select('-reserve_price -sales_count -referenceURL');
};

/*
//PAGINATION!!!
.limit(perPage)
.skip(perPage * page)
.count() //Return total number of iteam
*/

module.exports.paginationSearch = function (perPage, page, subcategory, callback) {
  console.log(perPage);
  console.log(page);
  console.log(perPage * page);

  var query = { $and: [{ subcategory: subcategory }, { status: "published" }, { verified: true }] };
  var a = perPage * page;
  var b = perPage;
  Product.find(query, callback).sort({ relevance: -1 }).skip(a).limit(b).select('-reserve_price -sales_count -referenceURL');
};



//search product by subcategory
module.exports.searchProductBySubcategory = function (subcategory, location, callback) {

  //parse the string to array object
  location = JSON.parse(location)

  //if user not login or not defined location speficiation OR required All locations
  if (location == null || location == undefined || contains.call(location, 'All') || location.length == 0) {
    var query = { $and: [{ subcategory: subcategory }, { status: "published" }, { verified: true }] };
  } else {
    //if specific location(s) required
    var query = {
      $or: [{ $and: [{ subcategory: subcategory }, { status: "published" }, { location: { $in: location } }, { verified: true }] },
      { $and: [{ subcategory: subcategory }, { status: "published" }, { deliveryMethod: 1 }, { verified: true }] }]
    };
  };

  Product.find(query, callback).sort({ relevance: -1 }).limit(1000).select('-reserve_price -sales_count -referenceURL');
};

//search product by gender ONLY for Fashion (300) and Sport (400)
module.exports.searchProductByGender = function (search, location, callback) {

  //parse the string to array object
  location = JSON.parse(location)

  //if user not login or not defined location speficiation OR required All locations
  if (location == null || location == undefined || contains.call(location, 'All') || location.length == 0) {
    var query = { $and: [{ category: search.category }, { gender: search.gender }, { status: "published" }, { verified: true }] };
  } else {
    //if specific location(s) required
    var query = {
      $or: [{ $and: [{ category: search.category }, { gender: search.gender }, { status: "published" }, { location: { $in: location } }, { verified: true }] },
      { $and: [{ category: search.category }, { gender: search.gender }, { status: "published" }, { deliveryMethod: 1 }, { verified: true }] }]
    };
  };

  Product.find(query, callback).sort({ relevance: -1 }).limit(1000).select('-reserve_price -sales_count -referenceURL');
};

//retrieve related products
module.exports.searchRelatedProducts = function (subcategory, location, callback) {

  //parse the string to array object
  location = JSON.parse(location);

  //if user not login or not defined location speficiation OR required All locations
  if (location == null || location == undefined || contains.call(location, 'All') || location.length == 0) {
    var query = { $and: [{ subcategory: subcategory }, { quantity: { $gt: 0 } }, { status: "published" }, { verified: true }] };
  } else {
    //if specific location(s) required
    var query = {
      $or: [{ $and: [{ subcategory: subcategory }, { quantity: { $gt: 0 } }, { status: "published" }, { location: { $in: location } }, { verified: true }] },
      { $and: [{ subcategory: subcategory }, { quantity: { $gt: 0 } }, { status: "published" }, { deliveryMethod: 1 }, { verified: true }] }]
    };
  };

  Product.find(query, callback).sort({ lastEditDate: -1, relevance: -1 }).limit(30).select('-reserve_price -sales_count -referenceURL');
};


//return top 20 best offer products given product availability
module.exports.searchOfferProduct = function (location, callback) {
  //parse the string to array object
  location = JSON.parse(location)

  //if user not login or not defined location speficiation OR required All locations
  if (location == null || location == undefined || contains.call(location, 'All') || location.length == 0) {
    var query = { $and: [{ quantity: { $gt: 0 } }, { status: "published" }, { verified: true }] };
  } else {
    //if specific location(s) required
    var query = {
      $or: [{ $and: [{ quantity: { $gt: 0 } }, { status: "published" }, { location: { $in: location } }, { verified: true }] },
      { $and: [{ quantity: { $gt: 0 } }, { status: "published" }, { deliveryMethod: 1 }, { verified: true }] }]
    };
  };

  Product.find(query, callback).sort({ lastEditDate: -1, relevance: -1 }).limit(30).select('-reserve_price -sales_count -referenceURL');
};


//return top 20 most viewed products given product availability
module.exports.searchMostViewProduct = function (location, callback) {
  //parse the string to array object
  location = JSON.parse(location)

  //if user not login or not defined location speficiation OR required All locations
  if (location == null || location == undefined || contains.call(location, 'All') || location.length == 0) {
    var query = { $and: [{ quantity: { $gt: 0 } }, { status: "published" }, { verified: true }] };
  } else {
    //if specific location(s) required
    var query = {
      $or: [{ $and: [{ quantity: { $gt: 0 } }, { status: "published" }, { location: { $in: location } }, { verified: true }] },
      { $and: [{ quantity: { $gt: 0 } }, { status: "published" }, { deliveryMethod: 1 }, { verified: true }] }]
    };
  };

  Product.find(query, callback).sort({ view_count: -1, lastEditDate: -1 }).limit(30).select('-reserve_price -sales_count -referenceURL');
};


//search recommended products
module.exports.searchRecommendedProducts = function (key, location, callback) {
  //parse the string to array object
  location = JSON.parse(location)

  //if user not login or not defined location speficiation OR required All locations
  if (location == null || location == undefined || contains.call(location, 'All') || location.length == 0) {
    var query = { $and: [{ quantity: { $gt: 0 } }, { status: "published" }, { verified: true }], $text: { $search: key } };
  } else {
    //if specific location(s) required
    var query = {
      $or: [{ $and: [{ quantity: { $gt: 0 } }, { status: "published" }, { location: { $in: location } }, { verified: true }] },
      { $and: [{ quantity: { $gt: 0 } }, { status: "published" }, { deliveryMethod: 1 }, { verified: true }] }], $text: { $search: key }
    };
  };

  //indexed search fulltext search query
  Product.find(query, { score: { $meta: "textScore" } }, callback).sort({ lastEditDate: -1, score: { $meta: "textScore" } }).limit(30).select('-reserve_price -sales_count -referenceURL')
};


//search product by KeyWord ("SEARCH ENGINE")
module.exports.searchProductByKeyword = function (key, location, callback) {
  //parse the string to array object
  location = JSON.parse(location)

  //if user not login or not defined location speficiation OR required All locations
  if (location == null || location == undefined || contains.call(location, 'All') || location.length == 0) {
    var query = { $and: [{ quantity: { $gt: 0 } }, { status: "published" }, { verified: true }], $text: { $search: key } };
  } else {
    //if specific location(s) required
    var query = {
      $or: [{ $and: [{ quantity: { $gt: 0 } }, { status: "published" }, { location: { $in: location } }, { verified: true }] },
      { $and: [{ quantity: { $gt: 0 } }, { status: "published" }, { deliveryMethod: 1 }, { verified: true }] }], $text: { $search: key }
    };
  };

  //indexed search fulltext search query
  Product.find(query, { score: { $meta: "textScore" } }, callback).sort({ score: { $meta: "textScore" } }).limit(100).select('-reserve_price -sales_count -referenceURL')
};


module.exports.getAdProducts = function (id, callback) {
  const query = { $and: [{ subcategory: id }, { quantity: { $gt: 0 } }, { status: "published" }, { verified: true }] };
  Product.find(query, callback).sort({ view_count: -1, lastEditDate: -1 }).limit(30).select('-reserve_price -sales_count -referenceURL');
};


//get product info for pricingEngine
module.exports.getByID = function (id, callback) {
  const query = { _id: id };
  Product.findOne(query, callback);
};

//get products of a seller for userview
module.exports.getProductBySellerIDx = function (id, callback) {
  const query = { $and: [{ sellerID: id }, { quantity: { $gt: 0 } }, { status: "published" }, { verified: true }] };
  Product.find(query, callback).select('-reserve_price -sales_count -referenceURL');
};



var contains = function (needle) {
  // Per spec, the way to identify NaN is that it is not equal to itself
  var findNaN = needle !== needle;
  var indexOf;

  if (!findNaN && typeof Array.prototype.indexOf === 'function') {
    indexOf = Array.prototype.indexOf;
  } else {
    indexOf = function (needle) {
      var i = -1, index = -1;

      for (i = 0; i < this.length; i++) {
        var item = this[i];

        if ((findNaN && item !== item) || item === needle) {
          index = i;
          break;
        }
      }

      return index;
    };
  }

  return indexOf.call(this, needle) > -1;
};