const express = require('express');
const router = express.Router();
const passport = require('passport');
const nodemailer = require('./nodemailer');
//bring in Refund data model
const Refund = require('../models/refund');
//bring in Order data model
const Order = require('../models/order');
//bring in fulfilment data model
const Fulfilment = require('../models/fulfilment');
//bring in User data model
const User = require('../models/user');

//add
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;
  const userID = req.user._id
  const offerID = req.body.offerID

  if (a != 'Unauthorized' && a.approved && a.verified) {
    //get order information
    Order.getOrderByOfferID(offerID, (err, order) => {
      if (err) {
        res.json({ success: false, msg: 'Error' });
        return;
      }
      if (!order) {
        return res.json({ success: false, msg: 'No order found' });
      } else {

        const thisOrder = order;
        const reason = req.body.reason;

        let newRefund = new Refund({
          //************IDs*************/
          sellerID: thisOrder.sellerID,
          userID: userID,
          offerID: offerID,
          reason: reason,
          quantity: thisOrder.quantity,
          orderDate: thisOrder.date,
          deliveryFee: thisOrder.deliveryFee,
          transactionFee: thisOrder.transactionFee,
          transactionVAT: thisOrder.transactionVAT,
          iyokusFee: thisOrder.iyokusFee,
          feeVAT: thisOrder.feeVAT,
          totalPrice: thisOrder.totalPrice,
          sellerPayout: thisOrder.sellerPayout,
        })

        Refund.addRefund(newRefund, (err, Refund) => {
          if (err) {
            if (err.code == 11000) {
              return res.json({ success: true, msg: 'Refund already recorded' });
            } else {
              return res.json({ success: false, msg: err.message });
            }

          } else {

            //change fulfilmentStatus to 0 
            if (thisOrder.deliveryFee > 0) {
              var payoutToSeller = false;
            } else {
              var payoutToSeller = true;
            }

            Fulfilment.changeFulfilmentStatusToRefunded(offerID, thisOrder.deliveryFee, payoutToSeller, (err, fulfilment) => { })
            //change orderStatus to 3
            Order.changeOrderStatusToRefunded(offerID, thisOrder.deliveryFee, (err, order) => { })

            //defined ids requered to retrieve emails
            var ids = [thisOrder.userID, thisOrder.sellerID];

            User.getEmailByID(ids, (err, emails) => {
              //if (err) {throw err};
              if (!emails) {

                return res.json({ success: false, msg: 'Failed to send refund emails' });

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

                //send refund email to the buyer
                nodemailer.refundUser(userEmail, thisOrder, reason);
                //send refund emailt to the seller
                nodemailer.refundSeller(sellerEmail, thisOrder, reason);
                //send refund invoice to the seller
                nodemailer.refundInvoiceSeller(sellerEmail, thisOrder);


                return res.json({ success: true, msg: 'Refund request recorded' });
              };
            });
          }
        })
      }
    })

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  }

});


function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}





module.exports = router;