const express = require('express');
const router = express.Router();
const passport = require('passport');
//bring in User data model
const Address = require('../models/address');


//view address by userID
router.get('/:_id', passport.authenticate('jwt', { session: false }), function (req, res) {
  const a = req.user;

  if (a != 'Unauthorized' && a.approved && a.verified) {

    var id = req.params._id;
    Address.getAddressByUserID(id, (err, address) => {

      if (address.length < 1) {
        return res.json({ success: false, msg: 'No address found' });
      } else {
        res.json(address);
      }
    });

  } else {
    res.json({ success: false, msg: 'Unauthorized' });
  };
});


//add
router.post('/add', (req, res, next) => {

  let newAddress = new Address({
    userID: req.body.userID,
    type: req.body.type,
    fullname: req.body.fullname,
    phone: req.body.phone,
    country: req.body.country,
    postCode: req.body.postCode,
    address1: req.body.address1,
    address2: req.body.address2,
    city: req.body.city,
    region: req.body.region
  });

  Address.addAddress(newAddress, (err, address) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to add address' });
      //throw err;
    } else {
      res.json({ success: true, msg: 'Address added' });
    }
  });
});


//delete addess by _id
router.delete('/delete/:_id', function (req, res) {
  var id = req.params._id;
  Address.deleteAddressByID(id, (err) => {
    if (err) {
      return res.json({ success: false, msg: 'failed to deleted address' });
      //throw err;
    } else {
      return res.json({ success: true, msg: 'Address deleted' });
    }
  })
});


//edit
router.put('/edit/:_id', (req, res) => {

  const id = req.params._id;

  let newAddress = new Address({
    fullname: req.body.fullname,
    phone: req.body.phone,
    country: req.body.country,
    postCode: req.body.postCode,
    address1: req.body.address1,
    address2: req.body.address2,
    city: req.body.city,
    region: req.body.region
  });

  Address.editAddressByID(id, newAddress, (err, address) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to edit address' });
      //throw err;
    } else {
      res.json({ success: true, msg: 'Address edited' });
    }
  });

});


//set as default
router.put('/default/:_id', (req, res) => {

  const id = req.params._id;

  Address.defaultAddressByID(id, (err, address) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to set address as default' });
      //throw err;
    } else {
      res.json({ success: true, msg: 'Address set as default' });
    }
  });

});

module.exports = router;