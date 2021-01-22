import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user){
    if(user.name == undefined || 
      user.email == undefined ||
      user.password == undefined){
      return false;
    } else {
      return true;
    }
  }

  validateEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  passwordMatch(password, password2){
    if(password != password2){
      return false;
    } else {
      return true;
    }
  };

  emailMatch(email, email2) {
    if (email != email2) {
      return false;
    } else {
      return true;
    }
  };ƒ

  priceDifference(reserve, price){
    return (reserve - price )/price;
  }
}

