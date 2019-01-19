const express = require('express');
const router = express.Router();

//bring in User data model
const Bid = require('../models/bid');

//check for previous bid
router.post('/verify', function (req, res) {
  var userID = req.body.userID;
  var productID = req.body.productID;

  Bid.verifyPreviousBid(userID, productID, (err, bid) => {

    if (bid) {
      res.json({ exists: true, bid });
    } else {
      res.json({ exists: false, msg: 'No bid found' });
    };
  })
});

module.exports = router;