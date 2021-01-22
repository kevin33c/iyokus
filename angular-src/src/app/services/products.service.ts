import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable()
export class ProductsService {
  authToken: any;
  location: any;

  constructor(
    private http: HttpClient
  ) { }

  fileUpload(file) {
    const uploadData = new FormData();
    uploadData.append('productImage', file);

    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/fileupload/add', uploadData, { headers: headers });
  }

  //add/update search
  addSearch(search) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/searches/add', search, { headers: headers });
  };

  //search by category and subcategory
  getSearches(key) {
    return this.http.get(environment.serverUrl + 'api/searches/get?key=' + key);
  };


  //get product by sellerID
  getProductsView(status) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/products', status, { headers: headers });
  };

  //upload product to seller account by sellerID
  uploadProduct(product) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/products/add', product, { headers: headers });
  };

  //delete product by _id
  getProductToDelete(id) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.delete(environment.serverUrl + 'api/products/delete/' + id, { headers: headers });
  };

  //get ONE product for edit
  getProduct(id) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.get(environment.serverUrl + 'api/products/get/' + id, { headers: headers });
  };

  //edit product by _id
  editProduct(product) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.put(environment.serverUrl + 'api/products/edit/' + product._id, product, { headers: headers });
  };

  //publish product by _id
  publishProduct(id) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.put(environment.serverUrl + 'api/products/publish/' + id, {}, { headers: headers });
  };

  //take down product by _id
  takeDownProduct(id) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.put(environment.serverUrl + 'api/products/down/' + id, {}, { headers: headers });
  };

  //search by category
  searchByCategory(query) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    var location = this.loadLocation();
    return this.http.post(environment.serverUrl + 'api/products/category/' + query, location, { headers: headers });
  };

  //search subcategory
  searchBySubcategory(query) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    var location = this.loadLocation();
    return this.http.post(environment.serverUrl + 'api/products/subcategory/' + query, location, { headers: headers });
  };

  //search gender
  searchByGender(search) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/products/gender', search, { headers: headers });
  };

  //search subcategory
  searchRelatedProducts(query) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    var location = this.loadLocation();
    return this.http.post(environment.serverUrl + 'api/products/related/' + query, location, { headers: headers });
  };

  //view individual product
  searchPublishedProduct(query) {
    return this.http.get(environment.serverUrl + 'api/products/view/' + query);
  };

  //view individual product
  searchPublishedProductEx(query) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.get(environment.serverUrl + 'api/products/viewex/' + query, { headers: headers });
  };

  //search by key word
  searchProductByKeyword(query) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    var location = this.loadLocation();
    return this.http.post(environment.serverUrl + 'api/products/searchex?' + query, location, { headers: headers });
  };

  //get best offer products
  getBestOffers() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    var location = this.loadLocation();
    return this.http.post(environment.serverUrl + 'api/products/productoffers', location, { headers: headers });
  };

  //get most viewed products
  getMostViewed() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    var location = this.loadLocation();
    return this.http.post(environment.serverUrl + 'api/products/productmostviewed', location, { headers: headers });
  };


  //get ad products by subcategory
  getAdProducts(id) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/products/adproducts', id, { headers: headers });
  };

  //get most viewed products
  getProductbySeller(id) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.get(environment.serverUrl + 'api/products/seller/' + id, { headers: headers });
  };

  //search recommended products
  searchRecommendedProducts(key) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    var location = this.loadLocation();
    return this.http.post(environment.serverUrl + 'api/products/recommended?key=' + key, location, { headers: headers });
  };

  //increase product view count by _id
  increaseViewCount(productView) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.serverUrl + 'api/products/count', productView, { headers: headers });
  };

  //add product as favourite
  addProductAsFavourite(product) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/favourites/add', product, { headers: headers });
  };

  getFavouritesByID(id) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.get(environment.serverUrl + 'api/favourites/' + id, { headers: headers });
  };

  //add product as favourite
  deleteFavourite(productID, userID) {
    let headers = new HttpHeaders();
    this.loadToken();
    headers = headers.set('Authorization', this.authToken);
    return this.http.post(environment.serverUrl + 'api/favourites/delete/' + productID, userID, { headers: headers });
  };

  //load token
  loadToken() {
    const token = localStorage.getItem('iy-tok-user');
    this.authToken = token;
  };

  //load token
  loadLocation() {
    this.location = localStorage.getItem('locations');
    var location = {
      location: this.location
    };
    return location
  };
}
