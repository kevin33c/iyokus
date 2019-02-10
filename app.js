const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const socketEvents = require('./socketEvents');
const mongoose = require('mongoose');

const config = require('./config/keys');
//initial app
const app = express();
//assign port
const port = process.env.PORT || 3000;



//= =======================================
// force SSL when in production
//= =======================================
if (process.env.NODE_ENV === 'production') {
  const forceSSL = function () {
    return function (req, res, next) {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(
          ['https://', req.get('Host'), req.url].join('')
        );
      }
      next();
    }
  };
  
  app.use(forceSSL());
}

//= =======================================
// connect to Mongodb
//= =======================================
mongoose.connect(config.mongoConnectionString);
//test connection
mongoose.connection.on('connected', () => {
  console.log('connected to Mongodb...');
});
mongoose.connection.on('error', (err) => {
  console.log('database error:' + err);
});

//= =======================================
// connect to port
//= =======================================
//set port
let server;
server = app.listen(port, () => {
  console.log('Server started on port ' + port);
});

//= =======================================
// enable cors to port
//= =======================================
app.use(cors());

//= =======================================
// Enable CORS from client-side
//= =======================================
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.domain);
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

//= =======================================
// Enable body-parser
//= =======================================
app.use(bodyparser.json());



//= =======================================
// set static folder (angular)
//= =======================================
app.use(express.static(path.join(__dirname, 'dist')));


//= =======================================
// Socket io
//= =======================================
const io = require('socket.io').listen(server);
socketEvents(io);



//= =======================================
// enable passport
//= =======================================
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


//= =======================================
// enable routes
//= =======================================
//users routes setup
const users = require('./routes/users');
//products routes setup
const products = require('./routes/products');
//bids routes setup
const bids = require('./routes/bids');
//addresses routes setup
const addresses = require('./routes/addresses');
//favourites routes setup
const favourites = require('./routes/favourites');
//offers routes setup
const offers = require('./routes/offers');
//staging stagingorders routes setup
const stagingOrders = require('./routes/StagingOrders');
//paypal routes
const paypal = require('./routes/paypal');
//stripe routes
const stripe = require('./routes/stripe');
//staging orders routes setup
const orders = require('./routes/orders');
//fulfilment routes setup
const fulfilments = require('./routes/fulfilments');
//reviews routes setup
const reviews = require('./routes/reviews');
//chats routes setup
const chats = require('./routes/chats');
//search engine
const searches = require('./routes/searches');
//pricing engine
const pricing = require('./routes/pricingEngine');
//uploadfile
const fileUpload = require('./routes/fileUpload');
//contact
const contact = require('./routes/contact');
//accounts
const accounts = require('./routes/accounts');
//refunds
const refunds = require('./routes/refunds');
//claims
const claims = require('./routes/claims');
//invoice
const invoices = require('./routes/invoiceLogs');



//= =======================================
// set up routes
//= =======================================
//enable users routes TO BE PROTECTED
app.use('/api/users', users);
//enable products routes
app.use('/api/products', products);
//enable staging orders routes TO BE PROTECTED
app.use('/api/stagingorders', stagingOrders);
//enable orders routes TO BE PROTECTED
app.use('/api/orders', orders);
//enable bids routes TO BE PROTECTED
app.use('/api/bids', bids);
//enable addresses routes TO BE PROTECTED
app.use('/api/addresses', addresses);
//enable favourites routes TO BE PROTECTED
app.use('/api/favourites', favourites);
//enable offers routes TO BE PROTECTED
app.use('/api/offers', offers);
//searches
app.use('/api/searches', searches);
//pricing
app.use('/api/pricing', pricing);
//fulfilments
app.use('/api/fulfilments', fulfilments);
//review
app.use('/api/reviews', reviews);
//chats
app.use('/api/chats', chats);
//PAYMENT
//paypal
app.use('/api/payment/paypal', paypal);
//stripe
app.use('/api/payment/stripe', stripe);
//UTIL
//AWS S3 file upload
app.use('/api/fileupload', fileUpload);
//contact
app.use('/api/contact', contact);
//accounts
app.use('/api/accounts', accounts);
//refunds
app.use('/api/refunds', refunds);
//claims
app.use('/api/claims', claims);
//invoices
app.use('/api/invoices', invoices);


//= =======================================
// set up Index Route
//= =======================================
app.get('/', (req, res) => {
  res.send('invaild endpoint');
});

//= =======================================
// Load site map for google
//= =======================================
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

//= =======================================
// formulario de desistimiento
//= =======================================
/*
app.get('/files/formulario_de_desistimiento.docx', (req, res) => {
  res.sendFile(path.join(__dirname, 'formulario_de_desistimiento.docx'));
});
*/

//= =======================================
// get Dist (angular)
//= =======================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});