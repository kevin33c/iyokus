const mongoose = require('mongoose');

//bid schema
const SearchSchema = mongoose.Schema({
  keyword:{
    type: String,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Search = module.exports = mongoose.model('Search', SearchSchema);


module.exports.updateSearchCount = function (key, count, callback) {
  const query = { keyword: key };
  const update = {
    $set: {
      "count": count,
      "date": Date()
    }
  };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  Search.updateOne(query, update, options, callback);
};


//select address list by userID
module.exports.getSearchByKey = function (key, callback) {
  const query = { keyword: {$regex: key}};
  Search.find(query, callback).sort({ count: -1 }).limit(6);
};
