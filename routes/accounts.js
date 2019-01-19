const express = require('express');
const router = express.Router();
const passport = require('passport');

//bring in account data model
const Account = require('../models/account');
//bring in user data model
const User = require('../models/user');


router.post('/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;

  if (a != 'Unauthorized' && a.approved && a.verified && a.mobileVerified) {

    let newAccount = new Account({
      sellerID: a._id,
      //id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthDay: req.body.birthDay,
      country: req.body.country,
      postCode: req.body.postCode,
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      region: req.body.region,
      bankName: req.body.bankName,
      iban: req.body.iban,
    });

    Account.addAccount(newAccount, (err, account) => {
      if (err) {
        return res.json({ success: false, msg: 'Failed to record account' });
      } else {

        User.editPaymentInfo(a._id, (err, user) => {
          if (err) {
            //console.log(err)
            return res.json({ success: false, msg: 'Failed to record account' });
          };
        });

        return res.json({ success: true, msg: 'Account recorded' });
      }
    });

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };

});


router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;

  if (a != 'Unauthorized' && a.approved && a.verified && a.mobileVerified) {

    Account.getAccountBySellerID(req.user.id, (err, account) => {
      if (err) {

        return res.json({ success: false, msg: 'Failed to record account' });
      } else {

        return res.json({ success: true, data: account });
      }
    });

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };

});






module.exports = router;