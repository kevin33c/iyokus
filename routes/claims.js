const express = require('express');
const router = express.Router();
const passport = require('passport');
const nodemailer = require('./nodemailer');

//bring in claum data model
const Claim = require('../models/claim');

router.post('/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;
  const offerID = req.body.offerID

  //check if authorized
  if (a != 'Unauthorized' && a.approved && a.verified) {

    let newClaim = new Claim({
      sellerID: req.body.sellerID,
      userID: a._id,
      offerID: offerID,
      reason: req.body.reason,
      comment: req.body.comment,
    });

    Claim.addClaim(newClaim, (err, address) => {
      if (err) {
        return res.json({ success: false, msg: 'Claim could not be added' });
      } else {

        nodemailer.raiseClaim(newClaim, a);

        return res.json({ success: true, msg: 'Claim added' });
      }
    });


  } else {
    res.json({ success: false, msg: 'No autorizado' });
  };
});


module.exports = router;