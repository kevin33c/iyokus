const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const MessageSchema = new Schema({
  conversationId: {
    type: String, //Schema.Types.ObjectId,
    required: true,
    ref: 'Conversation'
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

const Message = module.exports = mongoose.model('Message', MessageSchema);