const express = require('express');
const router = express.Router();
const nodemailer = require('./nodemailer');


router.post('/contactus', (req, res, next) => {

  var msg = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phonenumber: req.body.phonenumber,
    message: req.body.message,
  };

  nodemailer.contactUs(msg);

  return res.json({ success: true, msg: 'email sent' });

});


router.post('/business', (req, res, next) => {

  var msg = {
    businessName: req.body.businessName,
    businessEmail: req.body.businessEmail,
    composedMessage: req.body.composedMessage,
  };

  nodemailer.businessSignUp(msg);

  return res.json({ success: true, msg: 'email sent' });

});



module.exports = router;