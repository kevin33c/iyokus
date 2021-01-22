import { Injectable } from '@angular/core';

@Injectable()
export class RecommendationService {

  constructor() { }

  //store viewed history
  storeViewedCategory(category, subcategory) {
    localStorage.setItem('search_Main', JSON.stringify(category));
    localStorage.setItem('search_Sub', JSON.stringify(subcategory));
  }

  storeSeached(key) {
    localStorage.setItem('search_key', JSON.stringify(key));
  }

  //load token
  getViewedCategory() {
    var main = JSON.parse(localStorage.getItem('search_Main'));
    return main;
  }

  getViewedSubcategory() {
    var sub = JSON.parse(localStorage.getItem('search_Sub'));
    return sub;
  }

  getSearchedKey() {
    var key = JSON.parse(localStorage.getItem('search_key'));
    return key;
  }
}
