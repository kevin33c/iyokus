const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');
const nodemailer = require('./nodemailer');
const utilRecording = require('../models/utilRecording')

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


//bring in User data model
const User = require('../models/user');

//Register
router.post('/register', (req, res, next) => {

  if (req.body.type === 'user') {

    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      type: req.body.type,
      location: req.body.location
    });

  } else if (req.body.type === 'seller' || req.body.type === 'business') {

    if (req.body.firstname && req.body.lastname && req.body.mobile) {

      var newUser = new User({
        name: req.body.name,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        type: req.body.type,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile,
        location: req.body.location,
        //random 4 digit mobile verification code
        mobileVerificationCode: Math.floor(1000 + Math.random() * 9000)
      });

    } else {
      return res.json({ success: false, msg: 'Registration failed: mising information' });
    }
  }


  User.addUser(newUser, (err, user) => {
    if (err) {
      return res.json({ success: false, msg: 'Failed to register user' });
    } else {

      const token = jwt.sign({ data: user }, config.secret, {
        expiresIn: "24h" //24 hour before expiring
      });

      //MOBILE VERIFICATION
      if (req.body.type === 'seller' || req.body.type === 'business') {

        //add expiredate
        var t = new Date();
        t.setSeconds(t.getSeconds() + 7200); //expire in 2 hours or 7200 s

        //set up util recording
        var newUtilRecording = new utilRecording({
          id: user._id,
          reason: 100,
          expireDate: t,
        });

        //add util recording
        utilRecording.addUtilRecording(newUtilRecording, (err, msg) => { });

        var content = 'Your Iyokus verification code: ' + newUser.mobileVerificationCode;

        var xhr = new XMLHttpRequest(),
          body = JSON.stringify({
            "content": content,
            "to": [newUser.mobile]
          });

        xhr.open("POST", 'https://platform.clickatell.com/messages', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", config.clickatellKey);

        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            console.log('success');
          }
        };
        xhr.send(body);

      };

      //send email verification email to the buyer
      nodemailer.emailVerification(newUser.email, token);

      //send user sign up notification to Admin
      nodemailer.newUserNotification(newUser);

      return res.json({ success: true, msg: 'User registered', tempToken: token }); //NEED TO CHANGE TO NOT SENDING BACK TOKEN
    }
  });

});

//Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const type = req.body.type;

  User.getUserByEmailAndType(email, type, (err, user) => {
    //if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: 'User not found' });
    };

    //CHECK IF USER APPROVED
    if (user.approved) {
      //CHECK IF USER VERIFIED
      if (user.verified) {

        User.comparePassword(password, user.password, (err, isMatch) => {
          //if (err) throw err;
          if (isMatch) {
            //if is seller then also check whether mobile is verified
            if ((type.includes('seller') || type.includes('business')) && !user.mobileVerified) {
              const token = jwt.sign({ data: user }, config.secret, {
                expiresIn: "2h" //2 hour before expiring
              });

              return res.json({ mobile: false, msg: 'Mobile phone not verified', tempToken: token });
            }

            const token = jwt.sign({ data: user }, config.secret, {
              expiresIn: "100d" //30 days
            });

            res.json({
              success: true,
              token: 'JWT ' + token,
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                type: user.type,
                location: user.location,
              }
            })
          } else {
            return res.json({ success: false, msg: 'Incorrect email or password' });
          }
        });

      } else {
        return res.json({ success: false, msg: 'Email not verified' });
      }
    } else {
      return res.json({ success: false, msg: 'User blocked' });
    }
  });
});


//get temp token by email
router.post('/temptoken', (req, res, next) => {
  const email = req.body.email;
  const type = req.body.type;
  const purpose = req.body.purpose;

  User.getUserByEmailAndType(email, type, (err, user) => {
    //if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: 'User not found' });
    } else {
      const token = jwt.sign({ data: user }, config.secret, {
        expiresIn: "2h" //115 mins before expiring
      });

      if (purpose == 'email') {
        //send email verification email to the buyer
        nodemailer.emailVerification(email, token);
      };

      if (purpose == 'password') {
        //send password change email to the buyer
        nodemailer.resetPW(email, token);
      };


      return res.json({ success: true, msg: 'Email sent' });
    }
  });
});


//reverify email
router.post('/mobilereverification', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const id = req.body.id;
  const mobile = req.body.mobile;
  const reason = 100;
  const a = req.user;

  if (a != 'Unauthorized') {

    utilRecording.verifyRecord(id, reason, (err, recording) => {

      if (err) {
        return res.json({ success: false, msg: 'Unexpected Error' });
      };

      if (!recording) {

        //update mobile phone
        User.editMobileByID(id, mobile, (err, user) => { });

        //add expiredate
        var t = new Date();
        t.setSeconds(t.getSeconds() + 7200); //expire in 2 hours or 7200 s

        //set up util recording
        var newUtilRecording = new utilRecording({
          id: id,
          reason: 100,
          expireDate: t,
        });

        //add util recording
        utilRecording.addUtilRecording(newUtilRecording, (err, msg) => { });

        //no previous valid recording found, procced to resend SMS
        var xhr = new XMLHttpRequest(),
          body = JSON.stringify({
            "content": a.mobileVerificationCode,
            "to": [mobile]
          });

        xhr.open("POST", 'https://platform.clickatell.com/messages', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", config.clickatellKey);

        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            //console.log('success');
          }
        };
        xhr.send(body);

        return res.json({ success: true, msg: 'SMS resent' });

      } else {

        //valid recording found, try again in
        return res.json({ success: false, data: recording });
      }

    });

  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };

});


//verify mobile information
router.post('/mobileverification', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  a = req.user;
  const verificationCode = req.body.verificationCode;

  if (a != 'Unauthorized' && a.mobileVerificationCode == verificationCode) {

    id = a._id;

    User.verifyUserMobileByID(id, (err, user) => {
      if (err) {
        return res.json({ success: false, msg: 'Failed to verify mobile' });
      } else {
        return res.json({ success: true, msg: 'Mobile verified' });

        //ADD SEND SELLER WELCOMING EMAIL
      }
    });
  } else {
    return res.json({ success: false, msg: 'Failed to verify mobile' });
  };
});

//Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({ user: req.user });
});


//get seller info
router.get('/sellerinfo/:_id', (req, res, next) => {
  const id = req.params._id;

  User.getUserById(id, (err, user) => {
    if (err) {
      return res.json({ success: false, msg: 'Failed to get seller info' });
      throw err;
    } else {
      return res.json(
        {
          success: true,
          name: user.name,
          location: user.location,
          date: user.date,
          type: user.type
        });
    }
  });

});


//Change password
router.put('/edit/password', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;

  if (a != 'Unauthorized') {
    //res.json({ user: req.user });
    password = req.body.password;
    id = a._id;

    User.editPasswordByID(id, password, (err, user) => {
      if (err) {

        return res.json({ success: false, msg: 'Failed to edit user password' });

      } else {

        //send confirmation email to the buyer
        nodemailer.profileChangeConfirmation(a.email, a.type);

        return res.json({ success: true, msg: 'User password edited', type: a.type });

      }
    });
  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };
});


//Change email
router.put('/edit/email', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;

  if (a != 'Unauthorized') {
    //res.json({ user: req.user });
    email = req.body.email;
    id = a._id;

    User.editEmailByID(id, email, (err, user) => {
      if (err) {

        return res.json({ success: false, msg: 'Failed to edit user email' });

      } else {

        //send confirmation email to the buyer
        nodemailer.profileChangeConfirmation(a.email, a.type);

        return res.json({ success: true, msg: 'User email edited' });
      }

    });
  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };
});


//Change name
router.put('/edit/name', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;

  if (a != 'Unauthorized') {
    //res.json({ user: req.user });
    name = req.body.name;
    id = a._id;

    User.editNameByID(id, name, (err, user) => {
      if (err) {

        return res.json({ success: false, msg: 'Failed to edit user name' });

      } else {

        //send confirmation email to the buyer
        nodemailer.profileChangeConfirmation(a.email, a.type);

        return res.json({ success: true, msg: 'User name edited' });
      }
    });
  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };
});


//Change location
router.put('/edit/location', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  a = req.user;
  if (a != 'Unauthorized') {
    //res.json({ user: req.user });
    location = req.body.location;
    id = a._id;

    User.editLocationByID(id, location, (err, user) => {
      if (err) {
        return res.json({ success: false, msg: 'Failed to edit location' });
      } else {
        return res.json({ success: true, msg: 'Location edited' });
      }
    });
  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };
});


//verify email account
router.put('/verify', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const a = req.user;

  if (a != 'Unauthorized') {

    id = a._id;

    User.verifyUserByID(id, (err, user) => {
      if (err) {

        return res.json({ success: false, msg: 'Failed to verify user' });

      } else {

        if (a.type == 'user' && !a.onboarded) {

          //send email onboarding email to the buyer
          nodemailer.OnboardingBuyer(a.email);

          //change onboarding status
          User.onboardUserByID(id, (err, user) => { })

        } else if ((a.type == 'seller' || a.type == 'business') && !a.onboarded) {

          //send email onboarding email to the seller
          nodemailer.OnboardingSeller(a.email);

          //change onboarding status
          User.onboardUserByID(id, (err, user) => { })

        }

        return res.json({ success: true, msg: 'User verified', type: a.type });

      }
    });

  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };
});



//get user emails
router.get('/getemail/:_id', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  a = req.user;

  if (a != 'Unauthorized') {

    const id = req.params._id;

    User.getEmailByID(id, (err, email) => {
      if (err) {
        return res.json({ success: false, msg: 'Failed to get email' });
        //throw err;
      } else {
        return res.json({ success: true, data: email[0].email });
      }
    });

  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };
});


//disactivate user account account
router.put('/disactivate', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  a = req.user;
  if (a != 'Unauthorized') {
    id = a._id;
    User.disactivateUser(id, (err, user) => {
      if (err) {

        return res.json({ success: false, msg: 'Failed to disactivate user' });

      } else {

        //send user disactivation request email
        nodemailer.disactivateUser(a);

        return res.json({ success: true, msg: 'User disactivated', type: a.type });
      }
    });

  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };
});

module.exports = router;