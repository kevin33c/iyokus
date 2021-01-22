import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable()
export class UserService {
  authToken: any;

  constructor(private http: HttpClient) { }

  //add address
  uploadAddress(address) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/addresses/add', address, { headers: headers });
  };

  //get address by userID
  getAddressView(userID) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.get(environment.serverUrl + 'api/addresses/' + userID, { headers: headers });
  };

  //delete address by _id
  deleteAddress(id) {
    return this.http.delete(environment.serverUrl + 'api/addresses/delete/' + id);
  };

  //edit address by _id
  editAddress(address) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.put(environment.serverUrl + 'api/addresses/edit/' + address._id, address, { headers: headers });
  };


  //edit address by _id
  defaultAddress(id) {
    return this.http.put(environment.serverUrl + 'api/addresses/default/' + id, {});
  };


  //contact Us
  contactUs(msg) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/contact/contactus', msg, { headers: headers });
  };

  //business sign up request email
  businessSignUp(msg) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/contact/business', msg, { headers: headers });
  };

  //load token
  loadToken() {
    const token = localStorage.getItem('iy-tok-user');
    this.authToken = token;
  };

}