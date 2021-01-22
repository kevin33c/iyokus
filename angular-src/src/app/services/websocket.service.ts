import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import * as io from 'socket.io-client';
import { ObserveOnOperator } from 'rxjs/operators/observeOn';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'


@Injectable()

export class WebsocketService {

  private socket = io(environment.serverUrl);
  authToken: any;

  constructor(
    private http: HttpClient
  ) { }

  join(conversationId) {
    this.socket.emit('enter conversation', conversationId);
  }

  sendMessage(conversationId) {
    this.socket.emit('new message', conversationId)
  }

  newMessageReceived() {
    const observable = new Observable<{ conversationId: String }>(observer => {
      this.socket.on('refresh messages', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  };


  //get all conversations for an user
  getConversations() {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.get(environment.serverUrl + 'api/chats/conversation', { headers: headers });
  };

  //create conversation
  createConversation(id, msg) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/chats/new/' + id, msg, { headers: headers });
  };


  //get conversation
  getConversation(id) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.get(environment.serverUrl + 'api/chats/conversation/' + id, { headers: headers });
  };

  //add to conversation
  addToConversation(id, msg) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/chats/message/' + id, msg, { headers: headers });
  };


  //check if conversation exists
  checkConversation(id) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.get(environment.serverUrl + 'api/chats/checkconversation/' + id, { headers: headers });
  };

  //check if conversation exists
  checkUnreadConversation() {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.get(environment.serverUrl + 'api/chats/checkunread', { headers: headers });
  };

  //load token
  loadToken() {
    const token = localStorage.getItem('iy-tok-user');
    this.authToken = token;
  };
}
