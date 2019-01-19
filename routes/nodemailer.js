const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const config = require('../config/keys');
const domain = config.domain;
//bring in invoice log data model
const InvoiceLog = require('../models/invoiceLog');
const Account = require('../models/account');



//hbs template options
var options = {
  viewEngine: {
    extname: '.html',//hbs
    layoutsDir: 'emailTemplates/',
  },
  viewPath: 'emailTemplates/',
  extName: '.html'
};

//define email transporter
var transporter = nodemailer.createTransport({
  host: 'smtp.mail.eu-west-1.awsapps.com',
  secureConnection: true, // TLS requires secureConnection
  port: 465,
  auth: {
    user: config.noReplyEmailAddress,
    pass: config.noReplyEmailPassword
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

//use hbs as email template
transporter.use('compile', hbs(options));


module.exports.emailVerification = function (receiverEmail, token) {

  const href = domain + '/user/verify/' + token
  const subject = 'Verificar Email'

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: receiverEmail, // list of receivers
    subject: subject, // Subject line
    template: 'emailVerification', //emailVerification
    context: {
      href: href,
      domain: domain,
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};


module.exports.OnboardingBuyer = function (receiverEmail) {

  const subject = 'Bienvenido a Iyokus'

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: receiverEmail, // list of receivers
    subject: subject, // Subject line
    template: 'onboardingUser', //emailVerification
    context: {
      domain: domain,
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};


module.exports.OnboardingSeller = function (receiverEmail) {

  const subject = 'Bienvenido a Iyokus'

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: receiverEmail, // list of receivers
    subject: subject, // Subject line
    template: 'onboardingSeller', //emailVerification
    context: {
      domain: domain,
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};




module.exports.resetPW = function (receiverEmail, token) {

  const href = domain + '/user/changepw/' + token
  const subject = 'Restablecer Contraseña'

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: receiverEmail, // list of receivers
    subject: subject, // Subject line
    template: 'resetPassword',
    context: {
      href: href,
      domain: domain,
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};



module.exports.orderConfirmation = function (userEmail, newOrder) {

  const subject = 'Confirmación del Pedido #' + newOrder.offerID;
  const href = domain + '/user/yourorders';
  const subtotal = newOrder.quantity * newOrder.price.toFixed(2);
  const date = formatDate(newOrder.date);

  const priceBeforeVAT = (subtotal / (1 + 0.21)).toFixed(2);

  if (newOrder.deliveryFee > 0) {
    var delBeforeVAT = (newOrder.deliveryFee / (1 + 0.21)).toFixed(2);
  } else {
    var delBeforeVAT = 0;
  }

  const TotalBeforeVAT = (Number(priceBeforeVAT) + Number(delBeforeVAT)).toFixed(2);
  const VAT = (Number(newOrder.totalPrice) - Number(TotalBeforeVAT)).toFixed(2);

  //check for method of delivery to define template
  if (newOrder.deliveryMethod === 1) {
    var template = 'orderConfirmationPost'
  } else if (newOrder.deliveryMethod === 0) {
    var template = 'orderConfirmationMeeting'
  };

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: userEmail,
    subject: subject,
    template: template,
    context: {
      domain: domain,
      href: href,
      order: newOrder,
      subtotal: subtotal,
      priceBeforeVAT: priceBeforeVAT,
      delBeforeVAT: delBeforeVAT,
      TotalBeforeVAT: TotalBeforeVAT,
      VAT: VAT,
      date: date,
    }

  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};




module.exports.requestConfirmation = function (sellerEmail, userEmail, newOrder) {

  const subject = 'Solicitud de Pedido #' + newOrder.offerID;
  const href = domain + '/business/order/' + newOrder.offerID;
  const subtotal = newOrder.price.toFixed(2) * newOrder.quantity;
  const date = formatDate(newOrder.date);
  const totalVAT = (Number(newOrder.transactionVAT) + Number(newOrder.feeVAT)).toFixed(2);

  //check for method of delivery to define template
  if (newOrder.deliveryMethod === 1) {
    var template = 'orderRequestPost'
  } else if (newOrder.deliveryMethod === 0) {
    var template = 'orderRequestMeeting'
  };


  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: sellerEmail, // list of receivers
    subject: subject, // Subject line
    template: template,
    context: {
      domain: domain,
      href: href,
      order: newOrder,
      subtotal: subtotal,
      totalVAT: totalVAT,
      date: date,

    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};


module.exports.refundUser = function (receiverEmail, order, reason) {

  const href = domain + '/purchase/review/' + order.offerID;
  const subject = 'Reembolso de Pedido #' + order.offerID;
  const subtotal = order.price.toFixed(2) * order.quantity;
  const date = formatDate(order.date);
  const transactionFeeWithVAT = (Number(order.transactionFee) + Number(order.transactionVAT)).toFixed(2);
  const reburseTotal = (Number(order.totalPrice) - Number(order.deliveryFee) - transactionFeeWithVAT).toFixed(2);
  
  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: receiverEmail, // list of receivers
    subject: subject, // Subject line
    template: 'orderRefundUser',
    context: {
      domain: domain,
      href: href,
      order: order,
      reason: reason,
      subtotal: subtotal,
      transactionFeeWithVAT: transactionFeeWithVAT,
      reburseTotal: reburseTotal,
      date: date,
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};


module.exports.refundSeller = function (receiverEmail, order, reason) {


  const href = domain + '/business/order/' + order.offerID;
  const subject = 'Reembolso de Pedido #' + order.offerID;
  const subtotal = order.price.toFixed(2) * order.quantity;
  const totalVAT = (Number(order.transactionVAT) + Number(order.feeVAT)).toFixed(2);
  var remainPayout = (Number(order.sellerPayout) - Number(subtotal) + Number(order.iyokusFee) + Number(order.transactionFee) + Number(totalVAT)).toFixed(2);

  if (remainPayout <= 0) {
    var remainPayout = 0;
  }
  //const total = (Number(order.transactionFee) + Number(order.iyokusFee) + Number(order.feeVAT)).toFixed(2);
  const date = formatDate(order.date);


  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: receiverEmail, // list of receivers
    subject: subject, // Subject line
    template: 'orderRefundSeller',
    context: {
      domain: domain,
      totalVAT: totalVAT,
      subtotal: subtotal,
      href: href,
      order: order,
      remainPayout: remainPayout,
      reason: reason,
      date: date,
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};


module.exports.refundInvoiceSeller = function (receiverEmail, order) {

  InvoiceLog.getLaststInvoice((err, invoice) => {

    const invoiceID = Number(invoice.invoiceID) + 1;
    const year = (new Date()).getFullYear();

    Account.getAccountBySellerID(order.sellerID, (err, account) => {

      const subject = 'Factura Rectificativa Pedido #' + order.offerID;

      const totalVAT = (Number(order.transactionVAT) + Number(order.feeVAT)).toFixed(2);
      const total = (Number(order.transactionFee) + Number(order.iyokusFee) + Number(totalVAT)).toFixed(2);

      const today = formatDate(new Date());
      const sellerDetails = account[0];

      // setup email data with unicode symbols
      let mailOptions = {
        from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
        to: receiverEmail, // list of receivers
        bcc: 'admin@iyokus.com',
        subject: subject, // Subject line
        template: 'orderRefundInvoice',
        context: {
          invoiceID: invoiceID,
          totalVAT: totalVAT,
          total: total,
          account: sellerDetails,
          year: year,
          order: order,
          date: today,
        }
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions);

      //add invoice ID
      let newInvoiceLog = new InvoiceLog({
        invoiceID: invoiceID,
        offerID: order.offerID,
      });

      InvoiceLog.addInvoice(newInvoiceLog);

    });
  });
};



module.exports.fulfilmentUser = function (receiverEmail, fulfilment) {

  const href = domain + '/purchase/review/' + fulfilment.offerID;
  const subject = 'Pedido Completado #' + fulfilment.offerID;
  const subtotal = fulfilment.price.toFixed(2) * fulfilment.quantity;
  const date = formatDate(fulfilment.date);

  const priceBeforeVAT = (subtotal / (1 + 0.21)).toFixed(2);

  if (fulfilment.deliveryFee > 0) {
    var delBeforeVAT = (fulfilment.deliveryFee / (1 + 0.21)).toFixed(2);
  } else {
    var delBeforeVAT = 0;
  }

  const TotalBeforeVAT = (Number(priceBeforeVAT) + Number(delBeforeVAT)).toFixed(2);
  const VAT = (Number(fulfilment.totalPrice) - Number(TotalBeforeVAT)).toFixed(2);


  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: receiverEmail, // list of receivers
    subject: subject, // Subject line
    template: 'orderFulfilmentUser',
    context: {
      domain: domain,
      href: href,
      order: fulfilment,
      subtotal: subtotal,
      priceBeforeVAT: priceBeforeVAT,
      delBeforeVAT: delBeforeVAT,
      TotalBeforeVAT: TotalBeforeVAT,
      VAT: VAT,
      date: date,
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};





module.exports.fulfilmentSeller = function (receiverEmail, fulfilment) {

  const href = domain + '/business/order/' + fulfilment.offerID;
  const subject = 'Pedido Completado #' + fulfilment.offerID;
  const subtotal = fulfilment.price.toFixed(2) * fulfilment.quantity;
  const totalVAT = (Number(fulfilment.transactionVAT) + Number(fulfilment.feeVAT)).toFixed(2);
  const date = formatDate(fulfilment.date);

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: receiverEmail, // list of receivers
    subject: subject, // Subject line
    template: 'orderFulfilmentSeller',
    context: {
      domain: domain,
      totalVAT: totalVAT,
      href: href,
      order: fulfilment,
      subtotal: subtotal,
      date: date,
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};





module.exports.fulfilmentInvoiceSeller = function (receiverEmail, fulfilment) {

  InvoiceLog.getLaststInvoice((err, invoice) => {

    const invoiceID = Number(invoice.invoiceID) + 1;
    const year = (new Date()).getFullYear();

    Account.getAccountBySellerID(fulfilment.sellerID, (err, account) => {

      const subject = 'Factura Pedido #' + fulfilment.offerID;

      const totalVAT = (Number(fulfilment.transactionVAT) + Number(fulfilment.feeVAT)).toFixed(2);
      const total = (Number(fulfilment.transactionFee) + Number(fulfilment.iyokusFee) + Number(totalVAT)).toFixed(2);

      const today = formatDate(new Date());
      const sellerDetails = account[0];

      // setup email data with unicode symbols
      let mailOptions = {
        from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
        to: receiverEmail, // list of receivers
        subject: subject, // Subject line
        bcc: 'admin@iyokus.com',
        template: 'orderFulfilmentInvoice',
        context: {
          invoiceID: invoiceID,
          totalVAT: totalVAT,
          total: total,
          account: sellerDetails,
          year: year,
          order: fulfilment,
          date: today,
        }
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions);

      //add invoice ID
      let newInvoiceLog = new InvoiceLog({
        invoiceID: invoiceID,
        offerID: fulfilment.offerID,
      });

      InvoiceLog.addInvoice(newInvoiceLog);

    });
  });
};



module.exports.dispatchConfirmation = function (userEmail, order) {

  const subject = 'Pedido Enviado #' + order.offerID;
  const href = domain + '/user/yourorders';
  const subtotal = (order.quantity * order.price).toFixed(2);
  const date = formatDate(order.date);

  const priceBeforeVAT = (subtotal / (1 + 0.21)).toFixed(2);

  if (order.deliveryFee > 0) {
    var delBeforeVAT = (order.deliveryFee / (1 + 0.21)).toFixed(2);
  } else {
    var delBeforeVAT = 0;
  }

  const TotalBeforeVAT = (Number(priceBeforeVAT) + Number(delBeforeVAT)).toFixed(2);
  const VAT = (Number(order.totalPrice) - Number(TotalBeforeVAT)).toFixed(2);

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: userEmail,
    subject: subject,
    template: "dispatchedNotification",
    context: {
      domain: domain,
      href: href,
      order: order,
      subtotal: subtotal,
      priceBeforeVAT: priceBeforeVAT,
      delBeforeVAT: delBeforeVAT,
      TotalBeforeVAT: TotalBeforeVAT,
      VAT: VAT,
      date: date
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);

};


module.exports.profileChangeConfirmation = function (email, type) {

  const subject = 'Perfil Actualizado';

  if (type === 'user') {

    var href = domain + '/user/editprofile';

  } else {

    var href = domain + '/business/editprofile';

  };

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: email,
    subject: subject,
    template: "profileChangeNotification",
    context: {
      domain: domain,
      href: href,
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);

};



module.exports.contactUs = function (msg) {

  const subject = 'Contact Us from ' + msg.email
  var t = new Date()

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: 'client@iyokus.com',
    subject: subject, // Subject line
    template: 'contactUs', //emailVerification
    context: {
      msg: msg,
      date: t
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};


module.exports.businessSignUp = function (msg) {

  const subject = 'Business Sign Up Request'
  var t = new Date()

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: 'client@iyokus.com',
    subject: subject, // Subject line
    template: 'businessSignUp', //emailVerification
    context: {
      msg: msg,
      date: t
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};


module.exports.disactivateUser = function (user) {

  const subject = user.type + ' Disactivation Request'
  var t = new Date()

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: 'client@iyokus.com',
    subject: subject, // Subject line
    template: 'disactivateUser',
    context: {
      user: user,
      date: t
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};



module.exports.raiseClaim = function (claim, user) {

  const subject = 'Claim Request for order ' + claim.offerID
  var t = new Date()

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: 'client@iyokus.com',
    subject: subject, // Subject line
    template: 'claimForm',
    context: {
      claim: claim,
      user: user,
      date: t
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};


module.exports.newMessageNotification = function (user, offerID, recipientEmail) {

  const subject = 'Has recibido un mensage nuevo ' + offerID
  const href = domain + '/messenger/' + offerID;
  var t = new Date()

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Noreply" <' + config.noReplyEmailAddress + '>', // sender address
    to: recipientEmail,
    subject: subject, // Subject line
    template: 'chatNotification',
    context: {
      offerID: offerID,
      href: href,
      user: user,
      date: t
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions);
};




function formatDate(date) {
  var monthNames = [
    "Enero", "Febrero", "Marzo",
    "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre",
    "Noviembre", "Diciembre"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
};

/*
function roundNumber(num, scale) {
  if (!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale) + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if (+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
};
*/