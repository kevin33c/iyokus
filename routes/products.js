const express = require('express');
const router = express.Router();
const passport = require('passport');

//bring in Product data model
const Product = require('../models/product');
const archiveProduct = require('../models/archiveProduct');

//get products for seller view
router.post('/', passport.authenticate('jwt', { session: false }), function (req, res) {

  const a = req.user;

  if (a != 'Unauthorized' && a.approved && a.verified && a.mobileVerified) {

    const sellerID = a._id;

    if (req.body.status === "All") {
      var status = ["published", "inactive", undefined]
    } else {
      var status = req.body.status
    }

    Product.getProductBySellerID(sellerID, status, (err, product) => {

      if (product.length < 1) {
        return res.json({ success: true, found: false, msg: 'No product found' });
      } else {
        res.json(product);
      };

    })
  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };
});

//add product
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;

  if (a != 'Unauthorized' && a.approved && a.verified && a.mobileVerified) {

    var country = 'GB';

    let newProduct = new Product({
      productID: req.body.productID,
      sellerID: req.body.sellerID,
      name: req.body.name,
      type: req.body.type,
      condition: req.body.condition,
      brand: req.body.brand,
      category: req.body.category,
      subcategory: req.body.subcategory,
      gender: req.body.gender,
      description: req.body.description,
      listed_price: req.body.listed_price,
      reserve_price: req.body.reserve_price,
      quantity: req.body.quantity,
      tags: req.body.tags,
      locked_period: req.body.locked_period,
      currency: req.body.currency,
      country: country,
      location: req.body.location,
      deliveryMethod: req.body.deliveryMethod,
      deliveryCost: req.body.deliveryCost,
      return_policy: req.body.return_policy,
      image_Main: req.body.image_Main,
      image_1: req.body.image_1,
      image_2: req.body.image_2,
      image_3: req.body.image_3,
      relevance: (req.body.listed_price - req.body.reserve_price) / req.body.listed_price
    });

    Product.addProduct(newProduct, (err, product) => {
      if (err) {
        return res.json({ success: false, msg: 'Failed to add product' });
        //throw err;
      } else {

        let newArchiveProduct = new archiveProduct({
          productID: product._id,
          sellerID: req.body.sellerID,
          name: req.body.name,
          type: req.body.type,
          condition: req.body.condition,
          brand: req.body.brand,
          category: req.body.category,
          subcategory: req.body.subcategory,
          gender: req.body.gender,
          description: req.body.description,
          listed_price: req.body.listed_price,
          reserve_price: req.body.reserve_price,
          quantity: req.body.quantity,
          tags: req.body.tags,
          locked_period: req.body.locked_period,
          currency: req.body.currency,
          country: country,
          location: req.body.location,
          deliveryMethod: req.body.deliveryMethod,
          deliveryCost: req.body.deliveryCost,
          return_policy: req.body.return_policy,
          image_Main: req.body.image_Main,
          image_1: req.body.image_1,
          image_2: req.body.image_2,
          image_3: req.body.image_3,
          relevance: (req.body.listed_price - req.body.reserve_price) / req.body.listed_price,
          reason: 'new',
        });

        //archive product
        archiveProduct.addArchiveProduct(newArchiveProduct, (err, archiveProduct) => { });

        return res.json({ success: true, msg: 'Product added' });
      }
    });
  } else {

    return res.json({ success: false, msg: 'Unauthorized' });

  }

});


//get one single product information
router.get('/get/:_id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const a = req.user;
  const productID = req.params._id;

  if (a != 'Unauthorized' && a.approved && a.verified && a.mobileVerified) {
    sellerID = a._id;

    Product.getProductByProductID(productID, sellerID, (err, product) => {
      if (err) {
        res.json({ success: false, msg: 'No product found' });
      } else {
        res.json(product);
      }
    });
  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  }
});


//delete product
router.delete('/delete/:_id', passport.authenticate('jwt', { session: false }), function (req, res) {
  const a = req.user;
  if (a != 'Unauthorized' && a.approved && a.verified && a.mobileVerified) {
    var id = req.params._id;
    Product.deleteProductByProductID(id, (err) => {
      if (err) {
        //throw err;
        return res.json({ success: false, msg: 'Failed to delete product' });
      } else {
        return res.json({ success: true, msg: 'Product deleted' });
      }
    })
  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  }
});


//edit product
router.put('/edit/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const a = req.user;

  if (a != 'Unauthorized' && a.approved && a.verified && a.mobileVerified) {

    const id = req.params._id;

    let newProduct = new Product({
      name: req.body.name,
      type: req.body.type,
      condition: req.body.condition,
      brand: req.body.brand,
      category: req.body.category,
      subcategory: req.body.subcategory,
      gender: req.body.gender,
      description: req.body.description,
      listed_price: req.body.listed_price,
      reserve_price: req.body.reserve_price,
      quantity: req.body.quantity,
      tags: req.body.tags,
      locked_period: req.body.locked_period,
      currency: req.body.currency,
      location: req.body.location,
      deliveryMethod: req.body.deliveryMethod,
      deliveryCost: req.body.deliveryCost,
      return_policy: req.body.return_policy,
      image_Main: req.body.image_Main,
      image_1: req.body.image_1,
      image_2: req.body.image_2,
      image_3: req.body.image_3,
      relevance: (req.body.listed_price - req.body.reserve_price) / req.body.listed_price
    });

    Product.editProductByID(id, newProduct, (err, product) => {
      if (err) {
        return res.json({ success: false, msg: 'Failed to edit product' });
        //throw err;
      } else {

        let newArchiveProduct = new archiveProduct({
          productID: id,
          sellerID: a._id,
          name: req.body.name,
          type: req.body.type,
          condition: req.body.condition,
          brand: req.body.brand,
          category: req.body.category,
          subcategory: req.body.subcategory,
          gender: req.body.gender,
          description: req.body.description,
          listed_price: req.body.listed_price,
          reserve_price: req.body.reserve_price,
          quantity: req.body.quantity,
          tags: req.body.tags,
          locked_period: req.body.locked_period,
          currency: req.body.currency,
          location: req.body.location,
          deliveryMethod: req.body.deliveryMethod,
          deliveryCost: req.body.deliveryCost,
          return_policy: req.body.return_policy,
          image_Main: req.body.image_Main,
          image_1: req.body.image_1,
          image_2: req.body.image_2,
          image_3: req.body.image_3,
          relevance: (req.body.listed_price - req.body.reserve_price) / req.body.listed_price,
          reason: 'update',
        });

        //archive product
        archiveProduct.addArchiveProduct(newArchiveProduct, (err, archiveProduct) => { });

        return res.json({ success: true, msg: 'Product edited' });
      }
    });
  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  }
});

//publish product
router.put('/publish/:_id', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;

  if (a != 'Unauthorized' && a.approved && a.verified && a.mobileVerified) {

    const id = req.params._id;

    Product.publishProductByID(id, (err, product) => {
      if (err) {
        res.json({ success: false, msg: 'Failed to publish product' });
        //throw err;
      } else {
        res.json({ success: true, msg: 'Product published' });
      }
    });
  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  }
});



//take down product
router.put('/down/:_id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const a = req.user;

  if (a != 'Unauthorized' && a.approved && a.verified && a.mobileVerified) {

    const id = req.params._id;
    Product.downProductByID(id, (err, product) => {
      if (err) {
        res.json({ success: false, msg: 'Failed to take down product' });
        //throw err;
      } else {
        res.json({ success: true, msg: 'Product took down' });
      }
    });
  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  }
});


//Search by category function
router.post('/category/:var', function (req, res) {

  var category = req.params.var;
  var location = req.body.location;

  Product.searchProductByCategory(category, location, (err, product) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to get product' });
      //throw err;
    } else {
      res.json(product);
    }
  });
});


//Search by subcategory function
router.post('/subcategory/:var', function (req, res) {

  var subcategory = req.params.var;
  var location = req.body.location;

  Product.searchProductBySubcategory(subcategory, location, (err, product) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to get product' });
      //throw err;
    } else {
      res.json(product);
    }
  });
});

//Search by subcategory function
router.post('/related/:var', function (req, res) {

  var subcategory = req.params.var;
  var location = req.body.location;

  Product.searchRelatedProducts(subcategory, location, (err, product) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to get product' });
      //throw err;
    } else {
      res.json(product);
    }
  });
});

//Search by gender function
router.post('/gender', function (req, res) {

  if (req.body.category == 300 || req.body.category == 400) {

    var search = {
      category: req.body.category,
      gender: req.body.gender
    }

    Product.searchProductByGender(search, req.body.location, (err, product) => {
      if (err) {
        res.json({ success: false, msg: 'Failed to get product' });
        //throw err;
      } else {
        res.json(product);
      }
    })
  } else {
    res.json({ success: false, msg: 'Not valid search' });
  };
});


//View individual PUBLISHED product
router.get('/view/:id', function (req, res) {
  const id = req.params.id;

  Product.getPublishedProductByID(id, (err, product) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to load product' });
      //throw err;
    } else {
      res.json(product);
    }
  });
});


//View individual product regardless of statis
router.get('/viewex/:id', passport.authenticate('jwt', { session: false }), function (req, res) {

  const id = req.params.id;
  const a = req.user;

  //check if authorized
  if (a != 'Unauthorized' && a.approved && a.verified) {

    Product.getPublishedProductExByID(id, (err, product) => {
      if (err) {
        res.json({ success: false, msg: 'Failed to load product' });
        //throw err;
      } else {
        res.json(product);
      }
    });

  } else {
    res.json({ success: false, msg: 'No autorizado' });
  };
});


//search engine view
router.post('/searchex', function (req, res) {
  var a = req.query;
  var key = a.key;
  var location = req.body.location;

  Product.searchProductByKeyword(key, location, (err, product) => {

    if (product.length > 0) {
      res.json(product);
    } else {
      res.json({ msg: 'No product found' });
    };

  });
});


//get product offer list
router.post('/productoffers', function (req, res) {

  var location = req.body.location;

  Product.searchOfferProduct(location, (err, product) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to find product' });
      //throw err;
    };
    if (product.length > 0) {
      res.json(product);
    } else {
      res.json({ msg: 'No product found' });
    };
  });
});

//get product most viewed list
router.post('/productmostviewed', function (req, res) {

  var location = req.body.location;

  Product.searchMostViewProduct(location, (err, product) => {

    if (err) {
      res.json({ success: false, msg: 'Failed to find product' });
      //throw err;
    };

    if (product.length > 0) {
      res.json(product);
    } else {
      res.json({ msg: 'No product found' });
    };
  });
});


//Recommended product STRATEGY
router.post('/recommended', function (req, res) {
  var a = req.query;
  var key = a.key;
  var location = req.body.location;

  Product.searchRecommendedProducts(key, location, (err, product) => {

    if (err) {
      res.json({ success: false, msg: 'Failed to find product' });
    };

    if (product.length > 0) {
      //return recommended products
      res.json(product);

    } else {

      //return dummy searches
      Product.searchMostViewProduct(location, (err, product) => {

        if (err) {
          res.json({ success: false, msg: 'Failed to find product' });
        };

        if (product.length > 0) {
          res.json(product);
        } else {
          res.json({ msg: 'No product found' });
        };
      });
    };
  });
});


//increase view count
router.put('/count/:_id', (req, res, next) => {
  const id = req.params._id;
  Product.increaseViewCountByID(id, (err, product) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to increase view count' });
      //throw err;
    } else {
      res.json({ success: true, msg: 'View count increased' });
    }
  });
});


//get products of a seller for userview
router.get('/seller/:_id', (req, res, next) => {
  const id = req.params._id;
  Product.getProductBySellerIDx(id, (err, products) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to get products' });
      //throw err;
    } else {
      res.json({ success: true, data: products });
    }
  });
});


module.exports = router;