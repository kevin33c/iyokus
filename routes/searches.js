const express = require('express');
const router = express.Router();

//bring in User data model
const Search = require('../models/search');

//if already exist then replace count else add
router.post('/add', (req, res, next) => {

  Search.updateSearchCount(req.body.keyword.toLowerCase(), req.body.count, (err, Search) => {
    if (err) {
      res.json({ success: false});
      //throw err;
    } else {
      res.json({ success: true});
    }
  });
});



//get by instring keyword
router.get('/get', function (req, res) {
  var a = req.query;
  var key = a.key;
  Search.getSearchByKey(key, (err, Searches) => {
    //if (err) {throw err};
    if (err) {
      return res.json({ success: false, msg: 'No Search found' });
    } else {
      res.json(Searches);
    }
  })
});

module.exports = router;