const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//user schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    default: '-',
    required: true
  },
  lastname: {
    type: String,
    default: '-',
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['user', 'seller', 'business'],
    required: true
  },
  mobile: {
    type: String,
    default: '-',
    required: true
  },
  mobileVerificationCode: {
    type: String,
  },
  mobileVerified: {
    type: Boolean,
    default: false
  },
  location: {
    type: [String],
    default: 'All'
  },
  verified: {
    type: Boolean,
    default: true //NO longer need email verification
  },
  approved: {
    type: Boolean,
    default: true
  },
  paymentInfoAvailable: {
    type: Boolean,
    default: false
  },
  onboarded: {
    type: Boolean,
    default: false
  },
  newsLetter: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  lastEditDate: {
    type: Date,
    default: Date.now
  },
  processed: {
    type: Boolean,
    default: false
  },
  processedBy: {
    type: String
  },
  processedAt: {
    type: Date
  }
}).index({ email: 1, type: 1 }, { unique: true });


const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback).select('-password');
};

module.exports.getUserByEmailAndType = function (email, type, callback) {
  const query = { $and: [{ email: email }, { type: type }] };
  User.findOne(query, callback);
};


module.exports.addUser = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    })
  })
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  })
};


module.exports.editPaymentInfo = function (id, callback) {
  const query = { _id: id };
  const update = {
    $set: {
      "paymentInfoAvailable": true,
      "lastEditDate": Date()
    }
  };
  User.updateOne(query, update, callback);
};


module.exports.editNameByID = function (id, name, callback) {
  const query = { _id: id };
  const update = {
    $set: {
      "name": name,
      "lastEditDate": Date()
    }
  };
  User.updateOne(query, update, callback);
};


module.exports.editEmailByID = function (id, email, callback) {
  const query = { _id: id };
  const update = {
    $set: {
      "email": email,
      "lastEditDate": Date()
    }
  };
  User.updateOne(query, update, callback);
};


module.exports.editMobileByID = function (id, mobile, callback) {
  const query = { _id: id };
  const update = {
    $set: {
      "mobile": mobile,
      "lastEditDate": Date()
    }
  };
  User.updateOne(query, update, callback);
};


module.exports.editLocationByID = function (id, location, callback) {
  const query = { _id: id };
  const update = {
    $set: {
      "location": location,
      "lastEditDate": Date()
    }
  };
  User.updateOne(query, update, callback);
};


module.exports.editPasswordByID = function (id, password, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      password = hash;

      const query = { _id: id };
      const update = {
        $set: {
          "password": password,
          "lastEditDate": Date()
        }
      };
      User.updateOne(query, update, callback);
    })
  });
};


module.exports.verifyUserByID = function (id, callback) {
  const query = { _id: id };
  const update = {
    $set: {
      "verified": true,
      "lastEditDate": Date()
    }
  };
  User.updateOne(query, update, callback);
};


module.exports.verifyUserMobileByID = function (id, callback) {
  const query = { _id: id };
  const update = {
    $set: {
      "mobileVerified": true,
      "lastEditDate": Date()
    }
  };
  User.updateOne(query, update, callback);
};


module.exports.onboardUserByID = function (id, callback) {
  const query = { _id: id };
  const update = {
    $set: {
      "onboarded": true,
      "lastEditDate": Date()
    }
  };
  User.updateOne(query, update, callback);
};



module.exports.getEmailByID = function (id, callback) {
  const query = { _id: id }
  User.find(query, callback).select('email type -_id');
};


module.exports.disactivateUser = function (id, callback) {
  const query = { _id: id };
  const update = {
    $set: {
      "approved": false,
      "lastEditDate": Date()
    }
  };
  User.updateOne(query, update, callback);
};