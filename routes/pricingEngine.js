const express = require('express');
const router = express.Router();
//bring in data models
const Product = require('../models/product');
const Bid = require('../models/bid');
const archiveBid = require('../models/archiveBid');
const Offer = require('../models/offer');
const archiveOffer = require('../models/archiveOffer');

const passport = require('passport');
const uuidv4 = require('uuid/v4');


router.post('/', passport.authenticate('jwt', { session: false }), function (req, res) {

  var a = req.user;


  if (a != 'Unauthorized' && a.approved && a.verified) {

    const user = a;
    const userID = user._id;
    const productID = req.body.productID;

    //CHECK IF BID EXISTS
    Bid.verifyPreviousBid(userID, productID, (err, bid) => {
      if (bid) {

        //bid exists
        return res.json({ success: false, msg: 'Previous and valid bid already exists' });

      } else {

        //get product information
        Product.getByID(productID, (err, product) => {
          //error due to no product found
          if (!product) {

            return res.json({ success: true, msg: 'No product found' });

          } else {
            //product information found

            const bid = Number(req.body.bid).toFixed(2);
            const bid_quantity = req.body.bid_quantity;

            //generate bid/offer uuid
            const uuid = uuidv4();

            //create bid entry
            let newBid = new Bid({
              uuID: uuid,
              userID: userID,
              sellerID: product.sellerID,
              productID: product._id,
              listed_price: product.listed_price,
              quantity_available: product.quantity,
              bid: bid,
              bid_quantity: bid_quantity,
              expireDate: addDays(new Date(), calculateExpireDays(product.locked_period))
            });

            //create archive bid entry
            let newArchiveBid = new archiveBid({
              uuID: uuid,
              userID: userID,
              sellerID: product.sellerID,
              productID: product._id,
              listed_price: product.listed_price,
              quantity_available: product.quantity,
              bid: bid,
              bid_quantity: bid_quantity,
              expireDate: addDays(new Date(), calculateExpireDays(product.locked_period))
            });

            //archive bid entry
            archiveBid.addArchiveBid(newArchiveBid);

            //add bid
            Bid.addBid(newBid, (err) => {
              if (err) {

                return res.json({ success: false, msg: 'Failed to record bid' });

              } else {

                //set up bid info for pricing engine
                bidPack = {
                  bid_quantity: Number(bid_quantity),
                  bid: Number(bid),
                  reserve_price: Number(product.reserve_price),
                  listed_price: Number(product.listed_price)
                };

                //evaluate bid
                var output = evaluateBid(bidPack);

                //create offer entry
                let newOffer = new Offer({
                  uuID: uuid,
                  userID: userID,
                  sellerID: product.sellerID,
                  productID: product._id,
                  listed_price: product.listed_price,
                  bid: bid,
                  bid_quantity: bid_quantity,
                  value: output.value,
                  offer_quantity: output.offer_quantity,
                  name: product.name,
                  image_Main: product.image_Main,
                  status: output.status,
                  expireDate: addDays(new Date(), 1)
                });

                //create archive offer entry
                let newArchiveOffer = new archiveOffer({
                  uuID: uuid,
                  userID: userID,
                  sellerID: product.sellerID,
                  productID: product._id,
                  listed_price: product.listed_price,
                  bid: bid,
                  bid_quantity: bid_quantity,
                  value: output.value,
                  offer_quantity: output.offer_quantity,
                  name: product.name,
                  image_Main: product.image_Main,
                  status: output.status,
                  expireDate: addDays(new Date(), 1)
                });

                //archive Offer entry
                archiveOffer.addArchiveOffer(newArchiveOffer);

                //add offer entry
                Offer.addOffer(newOffer, (err) => {

                  if (err) {
                    //delete bid
                    Bid.deleteBidByUuid(uuid);
                    //delete archiveBid
                    archiveBid.deleteArchiveBidByUuid(uuid);

                    res.json({ success: false, msg: 'Failed to record offer' });

                  } else {
                    //return json with data and uuid to find offer entry
                    return res.json({ success: true, data: output, id: uuid });
                  }
                });
              };
            });
          };
        });
      };
    });

  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };
});


//calculate bid difference over reserve_price
function evaluateBid(bid) {

  var totalListedValue = bid.bid_quantity * bid.listed_price;
  var totalReserveValue = bid.bid_quantity * bid.reserve_price;
  var totalBidValue = bid.bid_quantity * bid.bid;


  if (totalBidValue >= totalReserveValue) {
    //if bid higher than reserve price
    if (evaluateSurplus(totalListedValue, totalReserveValue, totalBidValue) >= 0.5) {
      //console.log("Accept");
      const a = {
        status: "System Accept",
        value: bid.bid,
        offer_quantity: bid.bid_quantity
      };
      return a
    } else {
      //if we captured less than 50% of the total surplus then 80% chance to accept else counter and risk reject
      var d = Math.random();
      if (d < 0.9) {
        // 90% chance of being here
        const a = {
          status: "System Accept",
          value: bid.bid,
          offer_quantity: bid.bid_quantity
        };
        return a
      } else {
        // 10% chance of being here
        var value = counterValues(bid);
        const a = {
          status: "Counter",
          value: Number(value).toFixed(2),
          offer_quantity: bid.bid_quantity
        };
        return a
      };
    };

  } else {
    //if bid lower then reserve price
    if (evaluateDeficit(totalReserveValue, totalBidValue) < 0.3) {

      const a = {
        status: "System Reject",
        value: bid.bid,
        offer_quantity: bid.bid_quantity
      };
      return a

    } else {
      var value = counterValues(bid);
      const a = {
        status: "Counter",
        value: Number(value).toFixed(2),
        offer_quantity: bid.bid_quantity
      };
      return a
    }

  };
};


//evalute the surplus captured of the max surplus
function evaluateSurplus(l, r, b) {
  const max_surplus = l - r;
  const surplus = b - r;
  const a = surplus / max_surplus;
  return a
};

//evaluate the level of deficit; hence the seriousness of the bid
function evaluateDeficit(r, b) {
  const a = b / r;
  return a
};

function counterValues(bid) {

  var d = Math.random();

  if (d < 0.4) {
    // 40% chance of being here
    var a = Math.max(bid.reserve_price, bid.bid) + (bid.listed_price - bid.reserve_price) * 0.10
    return Number(a).toFixed(2);
  } else if (d < 0.7) {
    // 30% chance of being here
    var a = Math.max(bid.reserve_price, bid.bid) + (bid.listed_price - bid.reserve_price) * 0.20
    return Number(a).toFixed(2);
  } else if (d < 0.9) {
    // 20% chance of being here
    var a = Math.max(bid.reserve_price, bid.bid) + (bid.listed_price - bid.reserve_price) * 0.3
    return Number(a).toFixed(2);
  } else {
    // 10% chance of being here
    var a = Math.max(bid.reserve_price, bid.bid) + (bid.listed_price - bid.reserve_price) * 0.5
    return Number(a).toFixed(2);
  }
};


function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

function calculateExpireDays(multiplier) {
  var days = multiplier; //change to adaptable
  return days
};


function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};


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