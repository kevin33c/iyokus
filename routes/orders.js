const express = require('express');
const router = express.Router();
const passport = require('passport');
const nodemailer = require('./nodemailer');
const config = require('../config/keys');

//bring in order data model
const Order = require('../models/order');
//bring in User data model
const User = require('../models/user');
//bring in Product data model
const Product = require('../models/product');
//staging order
const StagingOrder = require('../models/stagingOrder');
//payment
const Payment = require('../models/payment');
//error Log
const ErrorLog = require('../models/errorLog');

router.post('/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;
  const offerID = req.body.offerID;

  if (a != 'Unauthorized') {

    StagingOrder.getStagingOrderByID(offerID, (err, stagingOrder) => {

      if (err) {
        return res.json({ success: false, msg: 'No staging order found' });
      }

      if (!stagingOrder) {
        return res.json({ success: false, msg: 'No staging order found' });

      } else {

        //get payment info
        Payment.getPayment(offerID, (err, payment) => {
          if (err) {

            res.json({ success: false, msg: 'Failed to change order status to dispatched' });

          } else if (!payment) {

            res.json({ success: false, msg: 'No payment found' });

          } else {

            const subtotal = stagingOrder.price.toFixed(2) * stagingOrder.quantity;
            const transactionFee = payment.fee;
            const iyokusFee = (subtotal * Number(config.iyokusFee)).toFixed(2);
            const feeVAT = ((iyokusFee * (1 + 0)) - iyokusFee).toFixed(2); //VAT == 0%
            const transactionVAT = ((transactionFee * (1 + 0)) - transactionFee).toFixed(2); //VAT == 0%
            const sellerPayout = (stagingOrder.totalPrice - transactionFee - transactionVAT - iyokusFee - feeVAT).toFixed(2);

            let newOrder = new Order({
              offerID: offerID,
              userID: stagingOrder.userID,
              sellerID: stagingOrder.sellerID,
              productID: stagingOrder.productID,
              deliveryMethod: stagingOrder.deliveryMethod,
              ProductType: stagingOrder.ProductType,
              name: stagingOrder.name,
              country: stagingOrder.country,
              postCode: stagingOrder.postCode,
              address1: stagingOrder.address1,
              address2: stagingOrder.address2,
              city: stagingOrder.city,
              region: stagingOrder.region,
              phone: stagingOrder.phone,
              productName: stagingOrder.productName,
              image_Main: stagingOrder.image_Main,
              currency: stagingOrder.currency,
              price: stagingOrder.price,
              quantity: stagingOrder.quantity,
              deliveryFee: stagingOrder.deliveryFee.toFixed(2),
              transactionFee: transactionFee,
              transactionVAT: transactionVAT,
              iyokusFee: iyokusFee,
              feeVAT: feeVAT,
              totalPrice: stagingOrder.totalPrice.toFixed(2),
              sellerPayout: sellerPayout,
              isInternational: stagingOrder.isInternational,
              referenceURL: stagingOrder.referenceURL,
              variant1: stagingOrder.variant1,
              variant2: stagingOrder.variant2,
              verificationCode: Math.floor(100000 + Math.random() * 900000), //random 6 digits verification code
              paymentStatus: 'Confirmed'
            });

            Order.addOrder(newOrder, (err, order) => {
              if (err) {
                //check if duplicate key error
                if (err.code == '11000') {
                  //if error because of duplicate key then return the existing entry information
                  Order.getOrderByOfferID(newOrder.offerID, (err, order) => {
                    if (!order) {

                      return res.json({ success: false, msg: 'No order found' });

                    } else {
                      //return verification code
                      return res.json({ success: true, msg: 'Order recorded', code: order.verificationCode });
                    }
                  })

                } else {
                  return res.json({ success: false, msg: 'Unspecified error occurred' });
                }

              } else {
                //defined ids requered to retrieve emails
                var ids = [newOrder.userID, newOrder.sellerID];

                //get emails from IDs
                User.getEmailByID(ids, (err, emails) => {
                  //if (err) {throw err};
                  if (!emails) {

                    return res.json({ success: false, msg: 'Failed to send confirmation emails' });

                  } else {
                    //get seller & user emails
                    var sellerX = emails.filter(function (el) {
                      return el.type == 'seller' ||
                        el.type == 'business';
                    });

                    var sellerEmail = sellerX[0].email

                    var userX = emails.filter(function (el) {
                      return el.type == 'user';
                    });

                    var userEmail = userX[0].email

                    //send confirmation email to the buyer
                    nodemailer.orderConfirmation(userEmail, newOrder);
                    //send request emailt to the seller
                    nodemailer.requestConfirmation(sellerEmail, userEmail, newOrder);
                    //decrease inventory count AND increase sales count
                    Product.decreaseInventoryByID(newOrder.productID, newOrder.quantity, (err, product) => { });

                    //return verification code
                    return res.json({ success: true, msg: 'Order recorded', code: newOrder.verificationCode });
                  }
                })
              }
            })
          }
        })
      }
    });

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };

});



router.post('/cryptoorder', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const a = req.user;
  const offerID = req.body.offerID;

  if (a != 'Unauthorized') {

    StagingOrder.getStagingOrderByID(offerID, (err, stagingOrder) => {

      if (err) {
        return res.json({ success: false, msg: 'No staging order found' });
      }

      if (!stagingOrder) {
        return res.json({ success: false, msg: 'No staging order found' });

      } else {
        
        const subtotal = stagingOrder.price.toFixed(2) * stagingOrder.quantity;
        const transactionFee = 0; //NEED TO BE CALCULATED
        const iyokusFee = (subtotal * Number(config.iyokusFee)).toFixed(2);
        const feeVAT = ((iyokusFee * (1 + 0)) - iyokusFee).toFixed(2); //VAT == 0%
        const transactionVAT = ((transactionFee * (1 + 0)) - transactionFee).toFixed(2); //VAT == 0%
        const sellerPayout = (stagingOrder.totalPrice - transactionFee - transactionVAT - iyokusFee - feeVAT).toFixed(2);

        let newOrder = new Order({
          offerID: offerID,
          userID: stagingOrder.userID,
          sellerID: stagingOrder.sellerID,
          productID: stagingOrder.productID,
          deliveryMethod: stagingOrder.deliveryMethod,
          ProductType: stagingOrder.ProductType,
          name: stagingOrder.name,
          country: stagingOrder.country,
          postCode: stagingOrder.postCode,
          address1: stagingOrder.address1,
          address2: stagingOrder.address2,
          city: stagingOrder.city,
          region: stagingOrder.region,
          phone: stagingOrder.phone,
          productName: stagingOrder.productName,
          image_Main: stagingOrder.image_Main,
          currency: stagingOrder.currency,
          price: stagingOrder.price,
          quantity: stagingOrder.quantity,
          deliveryFee: stagingOrder.deliveryFee.toFixed(2),
          transactionFee: transactionFee,
          transactionVAT: transactionVAT,
          iyokusFee: iyokusFee,
          feeVAT: feeVAT,
          totalPrice: stagingOrder.totalPrice.toFixed(2),
          sellerPayout: sellerPayout,
          isInternational: stagingOrder.isInternational,
          referenceURL: stagingOrder.referenceURL,
          variant1: stagingOrder.variant1,
          variant2: stagingOrder.variant2,
          verificationCode: Math.floor(100000 + Math.random() * 900000), //random 6 digits verification code
          paymentStatus: 'Confirmed'
        });

        Order.addOrder(newOrder, (err, order) => {
          if (err) {
            //check if duplicate key error
            if (err.code == '11000') {
              //if error because of duplicate key then return the existing entry information
              Order.getOrderByOfferID(newOrder.offerID, (err, order) => {
                if (!order) {

                  return res.json({ success: false, msg: 'No order found' });

                } else {
                  //return verification code
                  return res.json({ success: true, msg: 'Order recorded', code: order.verificationCode });
                }
              })

            } else {
              return res.json({ success: false, msg: 'Unspecified error occurred' });
            }

          } else {
            //defined ids requered to retrieve emails
            var ids = [newOrder.userID, newOrder.sellerID];

            //get emails from IDs
            User.getEmailByID(ids, (err, emails) => {
              //if (err) {throw err};
              if (!emails) {

                return res.json({ success: false, msg: 'Failed to send confirmation emails' });

              } else {
                //get seller & user emails
                var sellerX = emails.filter(function (el) {
                  return el.type == 'seller' ||
                    el.type == 'business';
                });

                var sellerEmail = sellerX[0].email

                var userX = emails.filter(function (el) {
                  return el.type == 'user';
                });

                var userEmail = userX[0].email

                //send confirmation email to the buyer
                nodemailer.orderConfirmation(userEmail, newOrder);
                //send request emailt to the seller
                nodemailer.requestConfirmation(sellerEmail, userEmail, newOrder);
                //decrease inventory count AND increase sales count
                Product.decreaseInventoryByID(newOrder.productID, newOrder.quantity, (err, product) => { });

                //return verification code
                return res.json({ success: true, msg: 'Order recorded', code: newOrder.verificationCode });
              }
            })
          }
        })
      }
    })

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };

});


//get order information by offerID and sellerID
router.post('/seller/:_id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  a = req.user;
  if (a != 'Unauthorized') {
    const offerID = req.params._id;
    const sellerID = a._id
    Order.getOrderByOfferIDandSellerID(offerID, sellerID, (err, order) => {
      if (err) {
        res.json({ success: false, msg: 'Failed to change order status to dispatched' });
        //throw err;
      } else {
        res.json({ success: true, data: order });
      }

    })
  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };
});


//get order information by offerID and userID
router.post('/user/:_id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  a = req.user;
  if (a != 'Unauthorized') {
    const offerID = req.params._id;
    const userID = a._id
    Order.getOrderByOfferIDandUserID(offerID, userID, (err, order) => {
      if (err) {
        res.json({ success: false, msg: 'Failed to change order status to dispatched' });
        //throw err;
      } else {
        res.json({ success: true, data: order });
      }

    })
  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };
});




//get order information by user id
router.post('/getuserorders/', passport.authenticate('jwt', { session: false }), function (req, res) {
  a = req.user;
  if (a != 'Unauthorized') {
    id = a._id;
    Order.getOrdersByUserID(id, (err, orders) => {
      //if (err) {throw err};
      if (!orders) {
        return res.json({ success: false, msg: 'No order found' });
      } else {
        res.json(orders);
      }
    })
  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };
});


//get order information by seller id
router.post('/getsellerorders/', passport.authenticate('jwt', { session: false }), function (req, res) {
  a = req.user;
  if (a != 'Unauthorized') {
    id = a._id;
    Order.getOrdersBySellerID(id, (err, orders) => {
      //if (err) {throw err};
      if (!orders) {
        return res.json({ success: false, msg: 'No order found' });
      } else {
        res.json(orders);
      }
    })
  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };
});



function roundNumber(num, scale) {
  if (!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale) + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if (+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
};


module.exports = router;