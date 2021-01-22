import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tokenNotExpired } from 'angular2-jwt';
import { environment } from '../../environments/environment'

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  userType: any;
  constructor(
    private http: HttpClient
  ) { }

  registerUser(user) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/users/register', user, { headers: headers });
  };

  authenticateUser(user) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/users/authenticate', user, { headers: headers });
  };

  //get profile
  getProfile() {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.get(environment.serverUrl + 'api/users/profile', { headers: headers });
  };

  //get profile
  getProfileWithToken(token) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', token);
    return this.http.get(environment.serverUrl + 'api/users/profile', { headers: headers });
  };

  getSellerProfile(id) {
    return this.http.get(environment.serverUrl + 'api/users/sellerinfo/' + id);
  };

  //get temp token by ID
  getTempToken(user) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/users/temptoken', user, { headers: headers });
  };


  //edit name
  editName(name) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.put(environment.serverUrl + 'api/users/edit/name', name, { headers: headers });
  };

  //edit location
  editLocation(location) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.put(environment.serverUrl + 'api/users/edit/location', location, { headers: headers });
  };

  //edit email
  editEmail(email) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.put(environment.serverUrl + 'api/users/edit/email', email, { headers: headers });
  };

  //email
  getEmail(id) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.get(environment.serverUrl + 'api/users/getemail/' + id, { headers: headers });
  };

  //edit password
  editPassword(password, token?) {
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', token);
    } else {
      this.loadToken();
      headers = headers.set('Authorization', this.authToken);
    }
    return this.http.put(environment.serverUrl + 'api/users/edit/password', password, { headers: headers });
  };

  //add payment information
  addPayment(payment) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/accounts/add', payment, { headers: headers });
  };

  //add payment information
  getPayment() {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.get(environment.serverUrl + 'api/accounts', { headers: headers });
  };

  //disactivate users
  disactivateUser() {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.put(environment.serverUrl + 'api/users/disactivate', {}, { headers: headers });
  };


  //same data in local storage
  storeUserData(token, user) {
    localStorage.setItem('iy-tok-user', token);
    //localStorage.setItem('locations', JSON.stringify(user.location));

    if (user.type === "user") {
      localStorage.setItem('ix_ufd_u', "1100x11xift");
    } else if (user.type === "seller" || user.type === "business") {
      localStorage.setItem('ix_ufd_u', "1100s12sift");
    };

  };

  //load token
  loadToken() {
    const token = localStorage.getItem('iy-tok-user');
    this.authToken = token;
  };


  //check if token is expired
  loggedIn() {
    return tokenNotExpired('iy-tok-user');
  };


  userRole() {
    this.userType = localStorage.getItem('ix_ufd_u');

    if (this.userType != null) {
      if (this.userType === "1100x11xift") {
        return "user"
      } else if (this.userType === "1100s12sift") {
        return "seller"
      }
    } else {
      return false;
    }
  };

  logout() {
    this.authToken = null;
    this.user = null;
    //localStorage.clear();
    localStorage.removeItem('locations');
    localStorage.removeItem('iy-tok-user');
    localStorage.removeItem('ix_ufd_u');
    localStorage.removeItem('search_Main');
    localStorage.removeItem('search_Sub');
    localStorage.removeItem('search_key');
  };

  //verify user
  verifyUser(token) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', token);
    return this.http.put(environment.serverUrl + 'api/users/verify', {}, { headers: headers });
  };

  //verify mobile
  verifyMobile(token, verificationCode) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', token);
    return this.http.post(environment.serverUrl + 'api/users/mobileverification', verificationCode, { headers: headers });
  };


  //re-request mobile verification code
  requestMobileVerificationCode(info, token) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', token);
    return this.http.post(environment.serverUrl + 'api/users/mobilereverification', info, { headers: headers });
  };

}
