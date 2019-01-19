const express = require('express');
const router = express.Router();
const passport = require('passport');


//bring in User data model
const Favourite = require('../models/favourite');

//view address by userID
router.get('/:_id', passport.authenticate('jwt', { session: false }), function (req, res) {

  const id = req.params.id;
  const a = req.user;

  //check if authorized
  if (a != 'Unauthorized' && a.approved && a.verified) {

    Favourite.getFavouriteByUserID(a._id, (err, favourite) => {
      //if (err) {throw err};
      if (!favourite) {
        return res.json({ success: false, msg: 'No favourite found' });
      } else {
        res.json(favourite);
      }
    });

  } else {
    res.json({ success: false, msg: 'No autorizado' });
  };
});


//add product
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  const a = req.user;

  //check if authorized
  if (a != 'Unauthorized' && a.approved && a.verified) {

    let newFavourite = new Favourite({
      userID: req.body.userID,
      productID: req.body.productID,
      sellerID: req.body.sellerID,
      name: req.body.name,
      brand: req.body.brand,
      image_Main: req.body.image_Main
    });

    Favourite.addFavourite(newFavourite, (err, favourite) => {
      if (err) {
        res.json({ success: false, msg: 'Failed to add favourite' });
        //throw err;
      } else {
        res.json({ success: true, msg: 'Favourite added' });
      }
    });

  } else {
    res.json({ success: false, msg: 'No autorizado' });
  };
});


//delete addess by _id
router.post('/delete/:_id', passport.authenticate('jwt', { session: false }), function (req, res) {
  var productID = req.params._id;
  var userID = req.body.userID;
  const a = req.user;

  //check if authorized
  if (a != 'Unauthorized' && a.approved && a.verified) {

    Favourite.deleteFavouriteByID(userID, productID, (err) => {
      if (err) {
        return res.json({ success: false, msg: 'failed to deleted favourite' });
        //throw err;
      } else {
        return res.json({ success: true, msg: 'Favourite deleted' });
      }
    });
    
  } else {
    res.json({ success: false, msg: 'No autorizado' });
  };
});







module.exports = router;