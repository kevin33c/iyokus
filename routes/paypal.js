const express = require('express');
const router = express.Router();
const config = require('../config/keys');
const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': config.paypalPublicKey,
  'client_secret': config.paypalSecretKey
});

/*
if(process.env.NODE_ENV === 'production'){
  var domain = 'https://www.iyokus.es'
} else {
  var domain = 'http://localhost:4200'
}
*/

var domain = config.domain

router.post('/pay', (req, res) => {

  const productName = req.body.productName;
  const totalPrice = req.body.totalPrice;
  const offerID = req.body.offerID;
  const productID = req.body.productID;

  const create_payment_json = {

    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": domain + '/purchase/confirmation/?total=' + totalPrice + '&offid=' + offerID,
      "cancel_url": domain + '/product?p_id=' + productID
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": productName,
          "sku": productID,
          "price": totalPrice,
          "currency": "EUR",
          "quantity": 1 //always 1 to facilitate payment (else it calculate price * quantity must be equal to total below)
        }]
      },
      "amount": {
        "currency": "EUR",
        "total": totalPrice
      },
      "description": offerID
    }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      res.json({ success: false, msg: error });
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.json({ success: true, link: payment.links[i].href });
        }
      }
    }
  });

});


router.post('/execute', (req, res) => {
  const total = req.body.total;
  const payerId = req.body.PayerID;
  const paymentId = req.body.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency": "EUR",
        "total": total
      }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
      res.json({ success: true, msg: error });
    } else {
      const meta = JSON.stringify(payment)
      //console.log(meta);
      res.json({ success: true, meta: meta });
    }
  });
});


module.exports = router;