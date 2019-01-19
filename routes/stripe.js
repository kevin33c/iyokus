const express = require('express');
const router = express.Router();
const config = require('../config/keys');
var stripe = require('stripe')(config.stripeSecretKey);

//bring in payment data model
const Payment = require('../models/payment');

// Charge Route
router.post('/execute', (req, res) => {

  const amount = req.body.stripeAmount;
  const type = req.body.type;
  const paymentID = req.body.stripeToken;
  const sellerID = req.body.sellerID;
  const userID = req.body.userID;
  const offerID = req.body.offerID;
  const description = req.body.description;
  const productID = req.body.productID;
  const currency = req.body.currency;
  const amountOrginal = req.body.amount;
  const email = req.body.stripeEmail;

  stripe.customers.create({
    email: email,
    source: paymentID
  })
    .then(customer => stripe.charges.create({
      amount,
      description: offerID,
      currency: 'eur',
      customer: customer.id,
      //send stripe receipt to user
      //receipt_email: email,
    }, function (err, charge) {
      if (err) {
        switch (err.type) {
          case 'StripeCardError':
            // A declined card error
            res.send({
              success: false,
              errorMessage: err.message
            });

            break;
          case 'RateLimitError':
            // Too many requests made to the API too quickly
            res.send({
              success: false,
              errorMessage: err.message
            });

            break;
          case 'StripeInvalidRequestError':
            // Invalid parameters were supplied to Stripe's API
            res.send({
              success: false,
              errorMessage: err.message
            });

            break;
          case 'StripeAPIError':
            // An error occurred internally with Stripe's API
            res.send({
              success: false,
              errorMessage: err.message
            });

            break;
          case 'StripeConnectionError':
            // Some kind of error occurred during the HTTPS communication
            res.send({
              success: false,
              errorMessage: err.message
            });

            break;
          case 'StripeAuthenticationError':
            // You probably used an incorrect API key
            res.send({
              success: false,
              errorMessage: err.message
            });

            break;
          default:
            // Handle any other types of unexpected errors
            res.send({
              success: false,
              errorMessage: 'System error'
            });
            break;
        }
      } else {

        stripe.balance.retrieveTransaction(charge.balance_transaction, (err, balanceTransaction) => {
          //record payment in db
          let newPayment = new Payment({
            type: type,
            paymentID: charge.id,
            sellerID: sellerID,
            balance_transaction: charge.balance_transaction,
            last4: charge.source.last4,
            brand: charge.source.brand,
            country: charge.source.country,
            userID: userID,
            offerID: offerID,
            productID: productID,
            currency: currency,
            amount: amountOrginal,
            fee: balanceTransaction.fee / 100,
            cash: amountOrginal - (balanceTransaction.fee / 100)
          });
          //record payment
          Payment.addPayment(newPayment, (err, payment) => { });

          res.json({ success: true, msg: 'Payment recorded' });
        });
      }
    }
    ))
});


//refund

module.exports = router;