const express = require('express');
const router = express.Router();

//bring in user data model
const InvoiceLog = require('../models/invoiceLog');


//add product
router.post('/add', (req, res, next) => {
  
  let newInvoiceLog = new InvoiceLog({
    invoiceID: req.body.invoiceID,
    offerID: req.body.offerID,
  });

  InvoiceLog.addInvoice(newInvoiceLog, (err, log) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to add invoice' });
    } else {
      res.json({ success: true, msg: 'Invoice added' });
    }
  });

});


module.exports = router;