const express = require('express');
const router = express.Router();
const passport = require('passport');
const nodemailer = require('./nodemailer');
const config = require('../config/keys');

//bring in User data model
const Order = require('../models/order');
//bring in Product data model
const Product = require('../models/product');
//bring in fulfilment data model
const Fulfilment = require('../models/fulfilment');
//bring in archiveOffer
const archiveOffer = require('../models/archiveOffer');
//bring in User data model
const User = require('../models/user');



router.post('/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;
  const sellerID = req.user._id

  if (a != 'Unauthorized' && a.approved && a.verified && a.mobileVerified) {

    //get offerID from frontEnd
    const offerID = req.body.offerID
    const paymentCode = req.body.paymentCode

    //get order information
    Order.getOrderByOfferID(offerID, (err, order) => {

      if (err) {
        res.json({ success: false, msg: 'Error' });
        return;
      }

      if (!order) {

        return res.json({ success: false, msg: 'No order found' });

      } else {
        //return verification code
        const thisOrder = order;

        //check if verification code match
        if (paymentCode == thisOrder.verificationCode) {

          //get archiveOffer information
          archiveOffer.getArchiveOfferByID(offerID, (err, offer) => {

            if (!offer) {
              var thisOffer = {
                bid: 999999,
                bid_quantity: 999999,
                value: 99999,
              };

            } else {

              var thisOffer = offer;

            };


            //get product information
            Product.getProductByProductID(thisOrder.productID, sellerID, (err, product) => {
              if (!product) {

                return res.json({ success: true, msg: 'No product information available' });

              } else {
                //return verification code
                var thisProduct = product;

                let newFulfilment = new Fulfilment({
                  //************IDs*************/
                  offerID: thisOrder.offerID,
                  userID: thisOrder.userID,
                  sellerID: thisOrder.sellerID,
                  productID: thisOrder.productID,
                  //************Product Information*************/
                  deliveryMethod: thisOrder.deliveryMethod,
                  location: thisProduct.location,
                  productName: thisProduct.name,
                  image_Main: thisProduct.image_Main,
                  type: thisProduct.type,
                  condition: thisProduct.condition,
                  brand: thisProduct.brand,
                  category: thisProduct.category,
                  subcategory: thisProduct.subcategory,
                  gender: thisProduct.gender,
                  //************Pricing Information*************/
                  currency: thisProduct.currency,
                  listed_price: thisProduct.listed_price,
                  reserve_price: thisProduct.reserve_price,
                  bid: thisOffer.bid,
                  bid_quantity: thisOffer.bid_quantity,
                  price: thisOrder.price,
                  quantity: thisOrder.quantity,
                  //************FEES Information*************/
                  deliveryFee: thisOrder.deliveryFee,
                  transactionFee: thisOrder.transactionFee,
                  transactionVAT: thisOrder.transactionVAT,
                  iyokusFee: thisOrder.iyokusFee,
                  feeVAT: thisOrder.feeVAT,
                  totalPrice: thisOrder.totalPrice,
                  sellerPayout: thisOrder.sellerPayout,
                  //************FEES Information*************/
                  orderDate: thisOrder.date,
                });


                Fulfilment.addFulfilment(newFulfilment, (err, fulfilment) => {
                  if (err) {

                    if (err.code == 11000) {

                      return res.json({ success: true, msg: 'Fulfilment already recorded' });

                    } else {

                      return res.json({ success: false, msg: err.message });

                    }

                  } else {

                    //defined ids requered to retrieve emails
                    var ids = [thisOrder.userID, thisOrder.sellerID];

                    User.getEmailByID(ids, (err, emails) => {
                      //if (err) {throw err};
                      if (!emails) {

                        return res.json({ success: false, msg: 'Failed to send confirmation emails' });

                      } else {

                        //complete order
                        Order.changeOrderStatusToComplete(thisOrder.offerID, (err, order) => { });

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
                        nodemailer.fulfilmentUser(userEmail, newFulfilment);
                        //send fulfilment email to the seller
                        nodemailer.fulfilmentSeller(sellerEmail, newFulfilment);
                        //send invoice email to the seller
                        nodemailer.fulfilmentInvoiceSeller(sellerEmail, newFulfilment);

                        //return verification code
                        return res.json({ success: true, msg: 'Fulfilment recorded' });
                      };
                    });


                  };
                });

              }
            })
          })

        } else {

          return res.json({ success: false, msg: 'Payment code does not match' });

        }
      }
    })

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };
});



router.post('/addEx', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;
  const sellerID = req.user._id

  if (a != 'Unauthorized' && a.approved && a.verified && a.mobileVerified) {

    //get offerID from frontEnd
    const offerID = req.body.offerID;
    const delCompany = req.body.delCompany;
    const delRef = req.body.delRef;

    //get order information
    Order.dispatchOrder(offerID, delCompany, delRef, (err, order) => {

      if (err) {
        return res.json({ success: false, msg: 'Error' });
      }

      if (!order) {

        return res.json({ success: false, msg: 'No order found' });

      } else {

        //return verification code
        const thisOrder = order;

        //get archiveOffer information
        archiveOffer.getArchiveOfferByID(offerID, (err, offer) => {

          if (!offer) {
            var thisOffer = {
              bid: 999999,
              bid_quantity: 999999,
              value: 99999,
            };

          } else {

            var thisOffer = offer;

          };


          //get product information
          Product.getProductByProductID(thisOrder.productID, sellerID, (err, product) => {
            if (!product) {

              return res.json({ success: false, msg: 'No product information available' });

            } else {
              //return verification code
              var thisProduct = product;

              let newFulfilment = new Fulfilment({
                //************IDs*************/
                offerID: thisOrder.offerID,
                userID: thisOrder.userID,
                sellerID: thisOrder.sellerID,
                productID: thisOrder.productID,
                //************Product Information*************/
                deliveryMethod: thisOrder.deliveryMethod,
                location: thisProduct.location,
                productName: thisProduct.name,
                image_Main: thisProduct.image_Main,
                type: thisProduct.type,
                condition: thisProduct.condition,
                brand: thisProduct.brand,
                category: thisProduct.category,
                subcategory: thisProduct.subcategory,
                gender: thisProduct.gender,
                //************Pricing Information*************/
                currency: thisProduct.currency,
                listed_price: thisProduct.listed_price,
                reserve_price: thisProduct.reserve_price,
                bid: thisOffer.bid,
                bid_quantity: thisOffer.bid_quantity,
                price: thisOrder.price,
                quantity: thisOrder.quantity,
                //************FEES Information*************/
                deliveryFee: thisOrder.deliveryFee,
                transactionFee: thisOrder.transactionFee,
                transactionVAT: thisOrder.transactionVAT,
                iyokusFee: thisOrder.iyokusFee,
                feeVAT: thisOrder.feeVAT,
                totalPrice: thisOrder.totalPrice,
                sellerPayout: thisOrder.sellerPayout,
                //************FEES Information*************/
                orderDate: thisOrder.date,
              });


              Fulfilment.addFulfilment(newFulfilment, (err, fulfilment) => {
                if (err) {

                  if (err.code == 11000) {

                    return res.json({ success: true, msg: 'Fulfilment already recorded' });

                  } else {

                    return res.json({ success: false, msg: err.message });

                  }

                } else {

                  //defined ids requered to retrieve emails
                  var ids = [thisOrder.userID, thisOrder.sellerID];

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

                      //send dispatch email to the buyer
                      nodemailer.dispatchConfirmation(userEmail, thisOrder);
                      //send fulfilment email to the seller
                      nodemailer.fulfilmentSeller(sellerEmail, thisOrder);
                      //send invoice email to the seller
                      nodemailer.fulfilmentInvoiceSeller(sellerEmail, thisOrder);

                      return res.json({ success: true, msg: 'Fulfilment recorded' });
                    };
                  });
                };
              });
            }
          })
        })
      }
    })

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };
});


//get fulfilment information for seller finance
router.post('/seller', passport.authenticate('jwt', { session: false }), function (req, res) {

  const a = req.user;

  if (a != 'Unauthorized' && a.approved && a.verified) {

    var id = req.user._id;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;

    Fulfilment.getFulfilmentsBySellerID(id, fromDate, toDate, (err, fulfilment) => {
      //if (err) {throw err};
      if (!fulfilment) {
        return res.json({ success: false, msg: 'No fulfilment found' });
      } else {
        return res.json({ success: true, data: fulfilment });
      }
    });

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };
});








module.exports = router;