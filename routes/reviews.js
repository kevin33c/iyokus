const express = require('express');
const router = express.Router();
const passport = require('passport');

//bring in Review data model
const Review = require('../models/review');
//bring in Order data model
const Order = require('../models/order');

/*
router.post('/addtemp', (req, res, next) => {

  let newReview = new Review({
    sellerID: req.body.sellerID,
    userID: req.body.userID,
    offerID: req.body.offerID,
    stars: req.body.stars,
    comment: req.body.comment,
  });

  Review.addReview(newReview, (err, address) => {
    if (err) {
      res.json({ success: false, msg: 'Error at adding review' });
      //throw err;
    } else {
      res.json({ success: true, msg: 'Review added' });
    }
  });

});
*/


//add
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;
  const offerID = req.body.offerID

  //check if authorized
  if (a != 'Unauthorized' && a.approved && a.verified) {

    //check if review already completed
    Review.getReviewByOfferID(offerID, (err, review) => {

      //errors exception
      if (err) {
        return res.json({ success: false, msg: err.message });
      };

      //if not review then add
      if (!review) {

        Order.getOrderByOfferID(offerID, (err, order) => {
          if (!order) {

            return res.json({ success: false, msg: 'Order not found' });

          } else {
            const sellerID = order.sellerID

            let newReview = new Review({
              sellerID: sellerID,
              userID: a._id,
              offerID: req.body.offerID,
              stars: req.body.stars,
              comment: req.body.comment,
            });

            Review.addReview(newReview, (err, address) => {
              if (err) {
                res.json({ success: false, msg: 'Error at adding review' });
                //throw err;
              } else {
                res.json({ success: true, msg: 'Review added' });
              }
            });

          }
        })

        //if review already exist then return message
      } else {
        res.json({ success: false, msg: 'Review of this order already exists' });
      }
    });

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };

});


//add
router.post('/check', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;
  const offerID = req.body.offerID

  //check if authorized
  if (a != 'Unauthorized' && a.approved && a.verified) {

    //check if review already completed
    Review.getReviewByOfferID(offerID, (err, review) => {

      //errors exception
      if (err) {
        return res.json({ success: false, msg: err.message });
      };

      if (!review) {

        res.json({ success: false, msg: 'Review Do not Exists' });

      } else {

        res.json({ success: true, msg: 'Review Exists' });

      }
    });

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };

});

router.get('/info/:_id', (req, res, next) => {

  const sellerID = req.params._id;

  Review.getReviewsBySellerID(sellerID, (err, reviews) => {

    if (err) {
      return res.json({ success: false, msg: err.message });
    };

    if (!reviews) {

      return res.json({ success: false, msg: 'No review found' });

    } else {
      //calculate stats
      var stats = getStat(reviews);

      if (stats === false) {

        return res.json({ success: false, msg: 'No review found' });

      } else {

        return res.json({ success: true, data: stats });

      };
    };
  });

});



function getStat(reviews) {

  // dividing by 0 will return Infinity
  // arr must contain at least 1 element to use reduce
  if (reviews.length) {
    var sum = 0;
    var avg = 0;

    for (var i = 0, l = reviews.length; i < l; i++) {
      var obj = reviews[i].stars;
      sum = sum + Number(obj);
    };

    avg = sum / reviews.length;

    var info = {
      average: roundNumber(avg, 0),
      count: reviews.length
    };

    return info;

  } else {

    return false;

  };
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