const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../config/keys');

const PaymentCrypto = require('../models/paymentCrypto');

//= =======================================
// set http headers and domain
//= =======================================
const APIDomain = config.coinBaseApiDomain;
const headers = {
  'Accept': 'application/json',
  'X-CC-Api-Key': config.coinBaseApiKey,
  'X-CC-Version': '2018-03-22'
}

//= =======================================
// create payment
//= =======================================
router.post('/create', (req, res, next) => {

  var name = req.body.name;
  var description = req.body.description;
  var productID = req.body.productID;
  var amount = req.body.amount;
  var offerID = req.body.offerID;
  var userID = req.body.userID;
  var successRedirect = config.domain + req.body.successRedirect;
  var failRedirect = config.domain + `/product/${productID}`; //change to return to product page

  var charge = {
    "name": name,
    "description": description,
    "local_price": {
      "amount": amount,
      "currency": "GBP"
    },
    "pricing_type": "fixed_price",
    "metadata": {
      "customer_id": userID,
      "customer_name": offerID
    },
    "redirect_url": successRedirect,
    "cancel_url": failRedirect,
  }

  const options = {
    headers: headers,
    url: APIDomain + `/charges`,
    body: charge,
    json: true
  };

  request.post(options, function (err, response, body) {
    //case of server or system error
    if (err) {
      return res.json({ success: false, msg: err });
    }

    //case of unexpected error
    if (body.error) {
      return res.json({ success: false, msg: body });
    }

    //return data
    return res.json({ success: true, payload: body.data.hosted_url });

  });

});


//= =======================================
// get Coinbase payment
//= =======================================
router.get('/payment/:_id', (req, res, next) => {
  const id = req.params._id;

  const options = {
    headers: headers,
    url: APIDomain + `/charges/${id}`,
    //body: charge,
    json: true
  };

  request.get(options, function (err, response, body) {
    //case of server or system error
    if (err) {
      return res.json({ success: false, msg: err });
    }

    //case of unexpected error
    if (body.error) {
      return res.json({ success: false, msg: body });
    }

    //return data
    return res.json({ success: true, payload: body });

  });

})


module.exports = router;