const express = require('express');
const router = express.Router();
const passport = require('passport');

//bring in User data model
const StagingOrder = require('../models/stagingOrder');


router.post('/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;

  if (a != 'Unauthorized' && a.approved && a.verified) {

    let newStagingOrder = new StagingOrder({
      offerID: req.body.offerID,
      userID: req.body.userID,
      sellerID: req.body.sellerID,
      productID: req.body.productID,
      deliveryMethod: req.body.deliveryMethod,
      ProductType: req.body.ProductType,
      name: req.body.name,
      country: req.body.country,
      postCode: req.body.postCode,
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      region: req.body.region,
      phone: req.body.phone,
      productName: req.body.productName,
      image_Main: req.body.image_Main,
      currency: req.body.currency,
      price: Number(req.body.price).toFixed(2),
      quantity: req.body.quantity,
      deliveryFee: Number(req.body.deliveryFee).toFixed(2),
      totalPrice: Number(req.body.totalPrice).toFixed(2),
      variant1: req.body.variant1,
      variant2: req.body.variant2,
      
      isInternational: req.body.isInternational,
      /*
      isReferenced: req.body.isReferenced,
      referenceURL: req.body.referenceURL,
      referenceID: req.body.referenceID,
      */
    });

    StagingOrder.addStagingOrder(newStagingOrder, (err, order) => {
      if (err) {
        res.json({ success: false, msg: 'Failed to record staging order' });
        //throw err;
      } else {
        res.json({ success: true, msg: 'Staging order recorded' });
      }
    });

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };
  
});


//get order information
router.get('/get/:_id', passport.authenticate('jwt', { session: false }), function (req, res) {
  const a = req.user;

  if (a != 'Unauthorized' && a.approved && a.verified) {

    var id = req.params._id;

    StagingOrder.getStagingOrderByID(id, (err, order) => {
      if (!order) {
        return res.json({ success: false, msg: 'No staging order found' });
      } else {
        res.json(order);
      }
    });

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };
});


module.exports = router;