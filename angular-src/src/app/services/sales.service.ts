import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable()
export class SalesService {

  authToken: any;

  constructor(private http: HttpClient) { }

  //pricing
  evaluateBid(bid) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/pricing', bid, { headers: headers });
  };

  //verify previous bid
  checkPreviousBid(verify) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/bids/verify', verify, { headers: headers });
  };

  //get offer
  getValidOffer(id) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/offers/get/' + id, {}, { headers: headers });
  };

  //accept offer
  acceptOffer(id) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/offers/useraccept/' + id, {}, { headers: headers });
  };

  //accept reject
  rejectOffer(id) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/offers/userreject/' + id, {}, { headers: headers });
  };





  //invalid offer
  invalidOffer(id) {
    return this.http.put(environment.serverUrl + 'api/offers/valid/' + id, {});
  };

  //accept reject
  getOffersByUserID(id) {
    return this.http.get(environment.serverUrl + 'api/offers/user/' + id, {});
  };

  //delete product by _id
  deleteOffer(id) {
    return this.http.delete(environment.serverUrl + 'api/offers/delete/' + id);
  };

  //staging ORDERS
  recordStagingOrder(order) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/stagingorders/add', order, { headers: headers });
  };

  //get offer
  getStagingOrder(id) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.get(environment.serverUrl + 'api/stagingorders/get/' + id, { headers: headers });
  };


  //PAYPAL
  paypalPay(order?) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/payment/paypal/pay', order, { headers: headers });
  };

  //execute paypal payment
  paypalExecute(IDs) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/payment/paypal/execute', IDs, { headers: headers });
  };


  //stripe
  stripePay(order) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/payment/stripe/execute', order, { headers: headers });
  };

  //coinbase
  coinbasePay(order) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/coinbase/create', order, { headers: headers });
  };

  //add payment record
  recordPayment(payment) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/payments/add', payment, { headers: headers });
  };

  //add order
  recordOrder(order) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/orders/add', order, { headers: headers });
  };

  recordCryptoOrder(order) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/orders/cryptoorder', order, { headers: headers });
  };

  //get order by userID
  getOrderByUserID() {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/orders/getuserorders/', {}, { headers: headers });
  };

  //get order by userID
  getOrderBySellerID() {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/orders/getsellerorders/', {}, { headers: headers });
  };

  //get order for seller
  getOrder(offerID) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/orders/seller/' + offerID, {}, { headers: headers });
  };

  //get order for user
  getOrderEx(offerID) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/orders/user/' + offerID, {}, { headers: headers });
  };


  //get user/seller email by id -> POTENTIALLY TO BE DELETED
  getEmailByID(id) {
    return this.http.get(environment.serverUrl + 'api/users/getemail/' + id);
  };


  //record fulfilment for meeting delivery
  fulfilment(payload) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/fulfilments/add', payload, { headers: headers });
  };

  //record fulfilment for post delivery
  fulfilmentEx(payload) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/fulfilments/addEx', payload, { headers: headers });
  };

  //get fulfilments for seller finance
  getFulfilments(date) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/fulfilments/seller', date, { headers: headers });
  };

  //review seller
  reviewSeller(review) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/reviews/add', review, { headers: headers });
  };

  checkReview(id) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/reviews/check', id, { headers: headers });
  };

  //get review info
  getReviewStats(sellerID) {
    return this.http.get(environment.serverUrl + 'api/reviews/info/' + sellerID);
  };

  //refund
  refund(payload) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/refunds/add', payload, { headers: headers });
  };

  //claim
  claim(payload) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/claims/add', payload, { headers: headers });
  };

  //load token
  loadToken() {
    const token = localStorage.getItem('iy-tok-user');
    this.authToken = token;
  };

}
