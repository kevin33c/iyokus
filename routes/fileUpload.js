const express = require('express');
const router = express.Router();
const multer = require('multer');
const aws = require('aws-sdk');
const config = require('../config/keys');
const uuidv4 = require('uuid/v4');
const passport = require('passport');
const s3Storage = require('multer-sharp-s3');

aws.config.update({
  secretAccessKey: config.s3SecretAccessKey,
  accessKeyId: config.s3AccessKeyId,
  region: config.s3Region
});

var s3 = new aws.S3();

var upload2 = multer({
  storage: s3Storage({
    s3,
    Bucket: 'woolime',
    ACL: 'public-read',
    resize: {
      width: 1500,
      height: 1500
    },
    Key: function (req, file, cb) {
      cb(null, 'img' + '/' + uuidv4() + '_' + file.originalname);
    },
    max: true
  })
}).single('productImage');


router.post('/add', passport.authenticate('jwt', { session: false }), function (req, res, err) {
  const a = req.user;
  if (a != 'Unauthorized') {    
    upload2(req, res, (err) => {
      if (err) {
        res.json({ error: 'error encoutered' });
      } else {
        res.json({ location: req.file.Location });
      }
    })
  } else {
    res.json({ error: 'Unauthorized' });
  }
});


module.exports = router;
