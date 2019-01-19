const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
const ConversationSchema = new Schema({
  participants: {
    type: [Schema.Types.ObjectId],
    ref: 'User'
  },
  offerID: {
    type: String,
    unique: true
  },
  /*
  read: {
    type: Boolean,
    default: false
  },
  */
  userRead: {
    type: Boolean,
    default: false
  },
  sellerRead: {
    type: Boolean,
    default: true
  },
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

const Conversation = module.exports = mongoose.model('Conversation', ConversationSchema);




module.exports.checkUnreadConversation = function (id, type, callback) {
  if (type == 'user') {

    var query = { $and: [{ userRead: false }, { participants: id }] };

  } else {

    var query = { $and: [{ sellerRead: false }, { participants: id }] };

  }

  Conversation.find(query, callback);
};


module.exports.readUserConversation = function (id, callback) {
  const query = { offerID: id };
  const update = {
    $set: {
      "userRead": true,
    }
  };
  Conversation.updateOne(query, update, callback);
};


module.exports.unreadUserConversation = function (id, callback) {
  const query = { offerID: id };
  const update = {
    $set: {
      "userRead": false,
    }
  };
  Conversation.updateOne(query, update, callback);
};


module.exports.readSellerConversation = function (id, callback) {
  const query = { offerID: id };
  const update = {
    $set: {
      "sellerRead": true,
    }
  };
  Conversation.updateOne(query, update, callback);
};


module.exports.unreadSellerConversation = function (id, callback) {
  const query = { offerID: id };
  const update = {
    $set: {
      "sellerRead": false,
    }
  };
  Conversation.updateOne(query, update, callback);
};