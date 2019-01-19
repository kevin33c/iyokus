const express = require('express');
const router = express.Router();
const passport = require('passport');

//bring in offer data model
const Offer = require('../models/offer');
const archiveOffer = require('../models/archiveOffer');

//get offer information
router.post('/get/:_id', passport.authenticate('jwt', { session: false }), function (req, res) {

  const a = req.user;

  if (a != 'Unauthorized' && a.approved && a.verified) {

    var id = req.params._id;

    Offer.getOfferByID(id, (err, offer) => {
      //if (err) {throw err};
      if (!offer) {
        return res.json({ success: false, msg: 'No offer found' });
      } else {
        res.json(offer);
      }
    });

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };
});


//get offer information by user
router.get('/user/:_id', function (req, res) {
  var id = req.params._id;
  Offer.getOfferByUserID(id, (err, offer) => {
    //if (err) {throw err};
    if (!offer) {
      return res.json({ success: false, msg: 'No offer found' });
    } else {
      res.json(offer);
    }
  })
});


//get offer information by seller
router.get('/seller/:_id', function (req, res, next) {
  var id = req.params._id;
  Offer.getOfferBySellerID(id, (err, offer) => {
    //if (err) {throw err};
    if (!offer) {
      return res.json({ success: false, msg: 'No offer found' });
    } else {
      res.json(offer);
    }
  })
});

//change offer validity
router.put('/valid/:_id', (req, res) => {
  const id = req.params._id;

  archiveOffer.invalidArchiveOfferByID(id, (err, offer) => {
    if (err) {
      //res.json({ success: false, msg: 'Failed to invalid offer' });
      //throw err;
    } else {
      //res.json({ success: true, msg: 'Product invalided' });
    }
  });

  Offer.invalidOfferByID(id, (err, offer) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to invalid offer' });
      //throw err;
    } else {
      res.json({ success: true, msg: 'Product invalided' });
    }
  });
});

//accept valid offer
router.post('/useraccept/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const a = req.user;

  if (a != 'Unauthorized' && a.approved && a.verified) {

    const id = req.params._id;

    //update archive offer to accept
    archiveOffer.acceptArchiveOfferByID(id);

    //update offer to accept
    Offer.acceptOfferByID(id, (err, offer) => {
      if (err) {
        res.json({ success: false, msg: 'Failed to accept offer' });
      } else {
        res.json({ success: true, msg: 'Product accepted' });
      }
    });

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };

});

//reject valid offer
router.post('/userreject/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  const a = req.user;

  if (a != 'Unauthorized' && a.approved && a.verified) {

    const id = req.params._id;

    //update archive offer to reject
    archiveOffer.rejectArchiveOfferByID(id);

    //update offer to reject
    Offer.rejectOfferByID(id, (err, offer) => {
      if (err) {
        res.json({ success: false, msg: 'Failed to reject offer' });
        //throw err;
      } else {
        res.json({ success: true, msg: 'Product rejected' });
      }
    });

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };
});


//delete offer once completed
router.delete('/delete/:_id', function (req, res) {
  var id = req.params._id;
  Offer.deleteOfferByID(id, (err) => {
    if (err) {
      //throw err;
      return res.json({ success: false, msg: 'Failed to delete offer' });
    } else {
      return res.json({ success: true, msg: 'Offer deleted' });
    }
  })
});

module.exports = router;