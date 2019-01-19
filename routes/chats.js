const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');
const passport = require('passport');
const nodemailer = require('./nodemailer');
const utilRecording = require('../models/utilRecording')

//= =======================================
// get all conversation by user
//= =======================================

router.get('/conversation', passport.authenticate('jwt', { session: false }), function (req, res) {

  if (req.user != 'Unauthorized') {

    // Only return one message from each conversation to display as snippet
    Conversation.find({ participants: req.user._id })
      .select('offerID userRead sellerRead -_id')
      .sort('-updatedAt')
      .exec((err, conversations) => {
        if (err) {
          return res.send({ error: err });
          //return next(err);
        }

        // Set up empty array to hold conversations + most recent message
        const fullConversations = [];
        conversations.forEach((conversation) => {
          Message.find({ conversationId: conversation.offerID })
            .sort('-createdAt')
            .limit(1)
            .populate({
              path: 'author',
              select: 'name'
            })
            .exec((err, message) => {
              if (err) {
                //console.log(err)
                return res.send({ error: err });
                //return next(err);
              }

              //var messageX = message[0]
              //messageX['userRead'] = conversation.userRead
              //messageX['sellerRead'] = conversation.sellerRead

              var messageX = {
                _id: message[0]._id,
                conversationId: message[0].conversationId,
                body: message[0].body,
                author: message[0].author,
                createdAt: message[0].createdAt,
                updatedAt: message[0].updatedAt,
                userRead: conversation.userRead,
                sellerRead: conversation.sellerRead,
              };
              //console.log(message)

              //console.log(message)
              fullConversations.push(messageX);

              //console.log(fullConversations)

              if (fullConversations.length === conversations.length) {
                return res.status(200).json({ conversations: fullConversations });
              }
            });
        });
      });

  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };
});


//= =======================================
// create conversation with message
//= =======================================

router.post('/new/:recipient', passport.authenticate('jwt', { session: false }), function (req, res) {

  const a = req.user;
  const offerID = req.body.offerID;

  if (req.user != 'Unauthorized') {


    if (!req.params.recipient) {
      return res.status(422).send({ success: false, error: 'Please choose a valid recipient for your message.' });
      //return next();
    }

    if (!req.body.composedMessage) {
      return res.status(422).send({ success: false, error: 'Please enter a message.' });
      //return next();
    }

    if (!req.body.offerID) {
      return res.status(422).send({ success: false, error: 'OfferID missing.' });
      //return next();
    }


    const conversation = new Conversation({
      participants: [req.user._id, req.params.recipient],
      offerID: req.body.offerID,
    });

    conversation.save((err, newConversation) => {
      if (err) {
        return res.send({ success: false, error: err.errmsg });
        //return next(err);
      }

      const message = new Message({
        conversationId: newConversation.offerID,
        body: req.body.composedMessage,
        author: req.user._id
      });


      message.save((err, newMessage) => {
        if (err) {
          return res.send({ success: false, error: err.errmsg });
        }

        //send email notification
        var ids = [req.params.recipient];

        //get emails from IDs
        User.getEmailByID(ids, (err, emails) => {
          if (!emails) {

            return res.json({ success: false, msg: 'Failed to send confirmation emails' });

          } else {

            var userX = emails.filter(function (el) {
              return el.type == 'user';
            });

            var userEmail = userX[0].email

            //send confirmation email to the buyer
            nodemailer.newMessageNotification(a, offerID, userEmail);


            //add expiredate
            var t = new Date();
            t.setSeconds(t.getSeconds() + 3600); //expire in 1 hours or 3600 s

            //set up util recording
            var newUtilRecording = new utilRecording({
              id: req.params.recipient,
              reason: 200,
              expireDate: t,
            });

            //add util recording
            utilRecording.addUtilRecording(newUtilRecording, (err, msg) => { });

          }
        })

        return res.status(200).json({ success: true, message: 'Conversation started!', conversationId: conversation._id });

      });
    });

  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };
});


//= =======================================
// get conversation
//= =======================================
router.get('/conversation/:offerID', passport.authenticate('jwt', { session: false }), function (req, res) {

  if (req.user != 'Unauthorized') {

    Message.find({ conversationId: req.params.offerID })
      .select('createdAt body author conversationId')
      .sort('createdAt') //order by oldest first -> change to -createdAt if otherwise
      .populate({
        path: 'author',
        select: 'name type'
      })
      .exec((err, messages) => {
        if (err) {
          return res.send({ error: err });
          //return next(err);
        }

        if (req.user.type == 'user') {

          Conversation.readUserConversation(req.params.offerID, (err, conversation) => {
            if (err) {
              return res.send({ success: false, error: err });
            }
          })

        } else {

          Conversation.readSellerConversation(req.params.offerID, (err, conversation) => {
            if (err) {
              return res.send({ success: false, error: err });
            }
          })

        };

        return res.status(200).json({ success: true, conversation: messages });
      });

  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };

});


//= =======================================
// add to conversation
//= =======================================
router.post('/message/:conversationId', passport.authenticate('jwt', { session: false }), function (req, res) {

  const a = req.user;

  if (req.user != 'Unauthorized') {

    const reason = 200;
    const counterPartyID = req.body.counterPartyID;
    const offerID = req.params.conversationId;


    utilRecording.verifyRecord(counterPartyID, reason, (err, recording) => {

      if (err) {
        return res.json({ success: false, msg: 'Unexpected Error' });
      };

      if (!recording) {
        //send email notification
        var ids = [counterPartyID];

        //get emails from IDs
        User.getEmailByID(ids, (err, emails) => {
          if (!emails) {

            return res.json({ success: false, msg: 'Failed to send confirmation emails' });

          } else {

            var userEmail = emails[0].email

            //send confirmation email to the buyer
            nodemailer.newMessageNotification(a, offerID, userEmail);


            //add expiredate
            var t = new Date();
            t.setSeconds(t.getSeconds() + 3600); //expire in 1 hours or 3600 s

            //set up util recording
            var newUtilRecording = new utilRecording({
              id: counterPartyID,
              reason: 200,
              expireDate: t,
            });

            //add util recording
            utilRecording.addUtilRecording(newUtilRecording, (err, msg) => {});

          }
        })
      }
    });


    const reply = new Message({
      conversationId: req.params.conversationId,
      body: req.body.composedMessage,
      author: req.user._id
    });

    reply.save((err, sentReply) => {
      if (err) {
        return res.send({ success: false, error: err });
        //return next(err);
      }

      if (req.user.type == 'user') {

        Conversation.unreadSellerConversation(req.params.conversationId, (err, conversation) => {
          if (err) {
            return res.send({ success: false, error: err });
          }
        })

      } else {

        Conversation.unreadUserConversation(req.params.conversationId, (err, conversation) => {
          if (err) {
            return res.send({ success: false, error: err });
          }
        })

      };

      return res.status(200).json({ success: true, message: 'Reply successfully sent!' });
    });

  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };

});


//= =======================================
// check if open conversation exists
//= =======================================
router.get('/checkconversation/:offerID', passport.authenticate('jwt', { session: false }), function (req, res) {

  if (req.user != 'Unauthorized') {

    Conversation.find({ offerID: req.params.offerID })
      .select('offerID')
      .exec((err, conversation) => {
        if (err) {
          return res.send({ error: err });
          //return next(err);
        };

        if (conversation.length > 0) {
          return res.json({ success: true });
        } else {
          return res.json({ success: false });
        };

      });

  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };

});

//= =======================================
// check if unread conversation exists
//= =======================================
router.get('/checkunread', passport.authenticate('jwt', { session: false }), function (req, res) {

  if (req.user != 'Unauthorized') {

    Conversation.checkUnreadConversation(req.user._id, req.user.type, (err, conversation) => {
      if (err) {
        return res.json({ success: false, msg: err });
      };

      if (conversation) {

        return res.json({ success: true, found: true, count: conversation.length });

      } else {

        return res.json({ success: true, found: false });

      };

    })

  } else {
    return res.json({ success: false, msg: 'Unauthorized' });
  };

});




module.exports = router;