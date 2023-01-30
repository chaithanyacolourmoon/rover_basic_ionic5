import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  base_url = "https://rovor.co.in/webservices/";
  //base_url = "https://rovor.co.in/webservices/";
  public headers = new HttpHeaders();

  constructor(public httpClient: HttpClient,
    public envserv: EnvService) {
    this.headers.set('Content-Type', 'application/json');
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }

  getLanguages(){
    return this.httpClient.get(this.base_url + 'languages');
  }

  getLanguagesTitles(language_id){
    let postData = new FormData();
    postData.append('language_id', language_id);
    return this.httpClient.post(this.base_url + 'language-titles', postData, { headers: this.headers });
  }

  getSettings(){
    return this.httpClient.get(this.base_url + 'settings');
  }

  getRefund(){
    return this.httpClient.get(this.base_url + 'refund-policy');
  }

  getCancel(){
    return this.httpClient.get(this.base_url + 'cancel-policy');
  }

  getcities() {
    return this.httpClient.get(this.base_url + 'cities');
  }

  getEarliestDelivery() {
    return this.httpClient.get(this.base_url + 'earliest-delivery');
  }

  getlocations(city_id) {
    let postData = new FormData();
    postData.append('city_id', city_id);
    return this.httpClient.post(this.base_url + 'locations', postData, { headers: this.headers });
  }

  getPincodes(city_id) {
    let postData = new FormData();
    postData.append('city_id', city_id);
    return this.httpClient.post(this.base_url + 'pincodes', postData, { headers: this.headers });
  }

  getareas(pincode_id) {
    let postData = new FormData();
    postData.append('pincode_id', pincode_id);
    return this.httpClient.post(this.base_url + 'pincode-areas', postData, { headers: this.headers });
  }

  getsubareas(area_id) {
    let postData = new FormData();
    postData.append('area_id', area_id);
    return this.httpClient.post(this.base_url + 'pincode-sub-areas', postData, { headers: this.headers });
  }
  categoriesList() {
    return this.httpClient.get(this.base_url + 'categories');
  }

  doregister(name, mobile, email, password,email_subscription,device_id,referral_code) {
    let postData = new FormData();
    postData.append('name', name);
    postData.append('mobile', mobile);
    postData.append('email', email);
    postData.append('password', password);
    postData.append('email_subscription', email_subscription);
    postData.append('device_id', device_id);
    postData.append('platform_type', 'android');
    postData.append('referral_code', referral_code);
    return this.httpClient.post(this.base_url + 'register', postData, { headers: this.headers });
  }

  dootp(token, otp) {
    let postData = new FormData();
    postData.append('token', token);
    postData.append('otp', otp);
    return this.httpClient.post(this.base_url + 'verify-register-otp', postData, { headers: this.headers });
  }

  addReview(user_id,order_id,rating,review) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('order_id', order_id);
    postData.append('rating', rating);
    postData.append('review', review);
    return this.httpClient.post(this.base_url + 'give-rating', postData, { headers: this.headers });
  }

  trackOrder(order_id) {
    let postData = new FormData();
    postData.append('order_id', order_id);
    return this.httpClient.post(this.base_url + 'tracking-details', postData, { headers: this.headers });
  }

  getWalletAmount(user_id) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'wallet', postData, { headers: this.headers });
  }

 
  confirmAddCash(user_id,amount,txn_id) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('amount', amount);
    postData.append('txn_id', txn_id);
    return this.httpClient.post(this.base_url + 'confirm-add-cash', postData, { headers: this.headers });
  }


  resendOtp(token) {
    let postData = new FormData();
    postData.append('token', token);
    return this.httpClient.post(this.base_url + 'resend-register-otp', postData, { headers: this.headers });
  }
  dologin(mobile, password,device_id) {
    let postData = new FormData();
    postData.append('mobile', mobile);
    postData.append('password', password);
    postData.append('device_id', device_id);
    postData.append('platform_type', 'android');
    console.log(JSON.stringify(postData));
    return this.httpClient.post(this.base_url + 'login', postData, { headers: this.headers });
  }

  doforgot_password(monile) {
    let postData = new FormData();
    postData.append('mobile', monile);
    return this.httpClient.post(this.base_url + 'forgot-password', postData, { headers: this.headers });
  }
  dochangepassword(old_password, password, user_id) {
    let postData = new FormData();
    postData.append('old_password', old_password);
    postData.append('password', password);
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'change-password', postData, { headers: this.headers });
  }

  getBrands(sub_category_id) {
    let postData = new FormData();
    postData.append('sub_category_id', sub_category_id);
    return this.httpClient.post(this.base_url + 'filter-brands', postData, { headers: this.headers });
  }

  getprivacyPolicy() {
    return this.httpClient.get(this.base_url + 'privacy-policy');
  }
  getaboutUs() {
    return this.httpClient.get(this.base_url + 'about-us');
  }
  getcontactus() {
    return this.httpClient.get(this.base_url + 'contact-us');
  }

  getfaqs() {
    return this.httpClient.get(this.base_url + 'faqs');
  }

  getterms() {
    return this.httpClient.get(this.base_url + 'terms-and-conditions');
  }

  Profile(user_id) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'profile', postData, { headers: this.headers });
  }
  updateProfile(user_id, name, mobile) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('name', name);
    postData.append('mobile', mobile);
    return this.httpClient.post(this.base_url + 'edit-profile', postData, { headers: this.headers });
  }

  homecategories() {
    return this.httpClient.get(this.base_url + 'categories');
  }

  getAppcolour() {
    return this.httpClient.get(this.base_url + 'app-colours');
  }

  getCategories() {
    return this.httpClient.get(this.base_url + 'categories');
  }

  homebanners(city_id) {
    let postData = new FormData();
    postData.append('city_id', city_id);
    return this.httpClient.post(this.base_url + 'banners', postData, { headers: this.headers });
  }

  subcategoriesList(category_id) {
    let postData = new FormData();
    postData.append('category_id', category_id);
    return this.httpClient.post(this.base_url + 'sub-categories', postData, { headers: this.headers });
  }

  getproducts(category_id, sub_category_id, sid, city_id, start, limit, sort = 'Recent',language_id,user_id,brand) {
    let postData = new FormData();
    postData.append('category_id', category_id);
    postData.append('sub_category_id', sub_category_id);
    postData.append('sid', sid);
    postData.append('city_id', city_id);
    postData.append('start', start);
    postData.append('limit', limit);
    postData.append('language_id', language_id);
    postData.append('user_id', user_id);
    if (sort != 'Recent') {
      postData.append('sort', sort);
    }
    if (brand == undefined) {
      postData.append('brand', '');
    }else{
      postData.append('brand', brand);
    }
   
    return this.httpClient.post(this.base_url + 'products', postData, { headers: this.headers });
  }

  getproductsByTag(sid, city_id, start, limit, tag,sort = 'Recent',language_id,user_id,brand) {
    let postData = new FormData();
    postData.append('sid', sid);
    postData.append('city_id', city_id);
    postData.append('city_id', city_id);
    postData.append('start', start);
    postData.append('limit', limit);
    postData.append('tag', tag);
    postData.append('language_id', language_id);
    postData.append('user_id', user_id);
    if (sort != 'Recent') {
      postData.append('sort', sort);
    }
    if (brand == undefined) {
      postData.append('brand', '');
    }else{
      postData.append('brand', brand);
    }
    return this.httpClient.post(this.base_url + 'products', postData, { headers: this.headers });
  }

  addtocart(product_id, price_id, sid, qty,user_id) {
    let postData = new FormData();
    postData.append('product_id', product_id);
    postData.append('price_id', price_id);
    postData.append('sid', sid);
    postData.append('qty', qty);
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'add-to-cart', postData, { headers: this.headers });
  }

  updatequantity(sid, cart_id, quantity,user_id) {
    let postData = new FormData();
    postData.append('cart_id', cart_id);
    postData.append('quantity', quantity);
    postData.append('sid', sid);
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'update-quantity', postData, { headers: this.headers });
  }

  cartview(sid,user_id) {
    let postData = new FormData();
    postData.append('sid', sid);
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'cart', postData, { headers: this.headers });
  }

  checkSid(sid) {
    let postData = new FormData();
    postData.append('sid', sid);
    return this.httpClient.post(this.base_url + 'check-sid', postData, { headers: this.headers });
  }

  getReferCode(user_id) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'referral-code', postData, { headers: this.headers });
  }

  removeitemfromcart(sid, cart_id) {
    let postData = new FormData();
    postData.append('sid', sid);
    postData.append('cart_id', cart_id);
    return this.httpClient.post(this.base_url + 'delete-item-from-cart', postData, { headers: this.headers });
  }

  updatecart(sid, cart_id, quantity) {
    let postData = new FormData();
    postData.append('sid', sid);
    postData.append('cart_id', cart_id);
    postData.append('quantity', quantity);
    return this.httpClient.post(this.base_url + 'update-cart-item', postData, { headers: this.headers });
  }

  deleteitem(sid, cart_id) {
    let postData = new FormData();
    postData.append('sid', sid);
    postData.append('cart_id', cart_id);
    return this.httpClient.post(this.base_url + 'delete-item-from-cart', postData, { headers: this.headers });
  }

  getsearchproducts(keyword, city_id, start, limit,user_id,sid) {
    let postData = new FormData();
    postData.append('keyword', keyword);
    postData.append('city_id', city_id);
    postData.append('start', start);
    postData.append('limit', limit);
    postData.append('user_id', user_id);
    postData.append('sid', sid);
    return this.httpClient.post(this.base_url + 'search-result', postData, { headers: this.headers });
  }

  getproductview(product_id, sid, city_id,language_id,user_id) {
    let postData = new FormData();
    postData.append('product_id', product_id);
    postData.append('sid', sid);
    postData.append('city_id', city_id);
    postData.append('language_id', language_id);
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'view-product', postData, { headers: this.headers });
  }

  cartcountdata(sid) {
    let postData = new FormData();
    postData.append('sid', sid);
    return this.httpClient.post(this.base_url + 'cart-count', postData, { headers: this.headers });
  }

  hotline(tag, start, limit, city_id,langugae_id,sid,sort = 'Recent',user_id) {
    let postData = new FormData();
    postData.append('tag', tag);
    postData.append('start', start);
    postData.append('limit', limit);
    postData.append('city_id', city_id);
    postData.append('language_id', langugae_id);
    postData.append('sid', sid);
    postData.append('user_id', user_id);
    if (sort != 'Recent') {
      postData.append('sort', sort);
    }
    return this.httpClient.post(this.base_url + 'products', postData, { headers: this.headers });
  }

  addtowishlist(user_id, product_id) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('product_id', product_id);
    return this.httpClient.post(this.base_url + 'add-to-wl', postData, { headers: this.headers });
  }

  userwishlist(user_id, city_id,sid) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('city_id', city_id);
    postData.append('sid', sid);
    return this.httpClient.post(this.base_url + 'wish-list', postData, { headers: this.headers });
  }

  deletefromwishlist(user_id, wishlist_id) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('wishlist_id', wishlist_id);
    return this.httpClient.post(this.base_url + 'delete-item-from-wl', postData, { headers: this.headers });
  }

  cancelOrder(order_id) {
    let postData = new FormData();
    postData.append('order_id', order_id);
    return this.httpClient.post(this.base_url + 'cancel-order', postData, { headers: this.headers });
  }

  getAppads(city_id,type){
    let postData = new FormData();
    postData.append('city_id', city_id);
    postData.append('type', type);
    return this.httpClient.post(this.base_url + 'other-banners', postData, { headers: this.headers });
  }




  addaddressform(user_id, name, address, landmark, city_link, pincode_link, location, contact_no,latitude,longitude,address_type) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('name', name);
    postData.append('address', address);
    postData.append('landmark', landmark);
    // postData.append('city_link', city_link);
    // postData.append('pincode_link', pincode_link);
    postData.append('city', city_link);
    postData.append('pincode', pincode_link);
    postData.append('location', location);
    postData.append('contact_no', contact_no);
    postData.append('latitude', latitude);
    postData.append('longitude', longitude);
    postData.append('address_type', address_type);
    return this.httpClient.post(this.base_url + 'add-address', postData, { headers: this.headers });
  }

  editaddress(user_id, address_id, name, address, city_link, pincode_link, location, contact_no, landmark,latitude,longitude,address_type) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('address_id', address_id);
    postData.append('name', name);
    postData.append('address', address);
    postData.append('city', city_link);
    postData.append('pincode', pincode_link);
    postData.append('location', location);
    postData.append('contact_no', contact_no);
    postData.append('landmark', landmark);
    postData.append('latitude', latitude);
    postData.append('longitude', longitude);
    postData.append('address_type', address_type);
    return this.httpClient.post(this.base_url + 'edit-address', postData, { headers: this.headers });
  }

  get_address(address_id) {
    let postData = new FormData();
    postData.append('address_id', address_id);
    return this.httpClient.post(this.base_url + 'address', postData, { headers: this.headers });
  }


  addressbook(user_id) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'address-book', postData, { headers: this.headers });
  }

  deleteaddress(user_id, address_id) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('address_id', address_id);
    return this.httpClient.post(this.base_url + 'delete-address', postData, { headers: this.headers });
  }

  // deliveryaddressbook(user_id) {
  //   let postData = new FormData();
  //   postData.append('user_id', user_id);
  //   return this.httpClient.post(this.base_url + 'delete-address', postData, { headers: this.headers });
  // }

  deliverytothisaddress(user_id, sid, address_id, city_id) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('sid', sid);
    postData.append('address_id', address_id);
    // postData.append('city', city_id);
    return this.httpClient.post(this.base_url + 'delivery-to-this-address', postData, { headers: this.headers });
  }

  deliveryslots(date,city_id ) {
    let postData = new FormData();
    postData.append('date', date);
    postData.append('city_id', city_id );
    return this.httpClient.post(this.base_url + 'delivery-slots', postData, { headers: this.headers });
  }

  updatedeliveryslots(sid, date, slot) {
    let postData = new FormData();
    postData.append('sid', sid);
    postData.append('date', date);
    postData.append('slot', slot);
    return this.httpClient.post(this.base_url + 'update-delivery-slot', postData, { headers: this.headers });
  }

  confirmorder(sid, user_id, payment_option) {
    let postData = new FormData();
    postData.append('sid', sid);
    postData.append('user_id', user_id);
    postData.append('payment_option', payment_option);
    return this.httpClient.post(this.base_url + 'confirm-order', postData, { headers: this.headers });
  }

  initiatePayOnline(sid, user_id, payment_option) {
    let postData = new FormData();
    postData.append('sid', sid);
    postData.append('user_id', user_id);
    postData.append('payment_option', payment_option);
    return this.httpClient.post(this.base_url + 'initiate-pay-online-order', postData, { headers: this.headers });
  }

  checkRazorpayStatus(failed_sid){
    let postData = new FormData();
    postData.append('failed_sid', failed_sid);
    return this.httpClient.post(this.base_url + 'check-razorpay-payment-status', postData, { headers: this.headers });
  }

  payOnlineTryAgain(failed_sid){
    let postData = new FormData();
    postData.append('failed_sid', failed_sid);
    return this.httpClient.post(this.base_url + 'payonline-try-again', postData, { headers: this.headers });
  }

  UpdateCity(user_id,city_id){
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('city_id', city_id);
    return this.httpClient.post(this.base_url + 'update-user-city', postData, { headers: this.headers });
  }

  confirminitiateonline(sid, order_id, txn_id){
    let postData = new FormData();
    postData.append('sid', sid);
    postData.append('order_id', order_id);
    postData.append('txn_id', txn_id);
    return this.httpClient.post(this.base_url + 'confirm-initiate-pay-online-order', postData, { headers: this.headers });
  }


  confirmpayonline(sid, order_id, txn_id, user_id, payment_option) {
    let postData = new FormData();
    postData.append('sid', sid);
    postData.append('order_id', order_id);
    postData.append('txn_id', txn_id);
    postData.append('user_id', user_id);
    postData.append('payment_option', payment_option);
    return this.httpClient.post(this.base_url + 'confirm-order', postData, { headers: this.headers });
  }

  orderhistory(user_id) {
    let postData = new FormData();
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'order-history', postData, { headers: this.headers });
  }

  vieworder(order_id) {
    let postData = new FormData();
    postData.append('order_id', order_id);
    return this.httpClient.post(this.base_url + 'view-order', postData, { headers: this.headers });
  }

  getCouponList(){
    return this.httpClient.get(this.base_url + 'coupon-list');
  }

  getTipList(){
    return this.httpClient.get(this.base_url + 'tip-amounts');
  }

  updateTip(sid,tip_amount){
    let postData = new FormData();
    postData.append('sid', sid);
    postData.append('tip_amount', tip_amount);
    return this.httpClient.post(this.base_url + 'update-tip', postData, { headers: this.headers });
  }

  removeTip(sid){
    let postData = new FormData();
    postData.append('sid', sid);
    return this.httpClient.post(this.base_url + 'remove-tip', postData, { headers: this.headers });
  }

  applyCoupon(coupon_code, sid,user_id) {
    let postData = new FormData();
    postData.append('coupon_code', coupon_code);
    postData.append('sid', sid);
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'apply-coupon', postData, { headers: this.headers });
  }

  // removeCoupon(sid){
  //   let postData = new FormData();
  //   postData.append('sid', sid);
  //   return this.httpClient.post(this.base_url + 'remove-coupon', postData, { headers: this.headers });
  // }

  removeCoupon(sid){
    // let postData = new FormData();
    // postData.append('sid', sid);
    return this.httpClient.get(this.base_url + 'remove-coupon?sid='+sid, { headers: this.headers });
  }

  updateversion() {
    return this.httpClient.get(this.base_url + 'version');
  }

  checkVersion(version) {
    let postData = new FormData();
    postData.append('version', version);
    postData.append('platform_type', 'android');
    return this.httpClient.post(this.base_url + 'check-version', postData, { headers: this.headers });
  }

  updateToken(user_id,device_id){
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('device_id', device_id);
    postData.append('platform_type', 'android');
    return this.httpClient.post(this.base_url + 'update-device-id', postData, { headers: this.headers });
  }


  getNotificationCount(user_id){
    let postData = new FormData();
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'notification-count', postData, { headers: this.headers });
  }

  getNotification(user_id){
    let postData = new FormData();
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'notifications', postData, { headers: this.headers });
  }

  readNotification(user_id,notification_id){
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('notification_id', notification_id);
    return this.httpClient.post(this.base_url + 'read-notification', postData, { headers: this.headers });
  }

  checkPaytmStatus(sid){
    let postData = new FormData();
    postData.append('sid', sid);
    return this.httpClient.post(this.base_url + 'check-paytm-status', postData, { headers: this.headers });
  }

  initiatecashPayOnline(sid, user_id, payment_option) {
    let postData = new FormData();
    postData.append('sid', sid);
    postData.append('user_id', user_id);
    postData.append('payment_option', payment_option);
    return this.httpClient.post(this.base_url + 'initiate-with-cashfree', postData, { headers: this.headers });
  }

  useWallet(sid,user_id){
    let postData = new FormData();
    postData.append('sid', sid);
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'update-use-wallet', postData, { headers: this.headers });
  }
  removeWallet(sid){
    let postData = new FormData();
    postData.append('sid', sid);
    return this.httpClient.post(this.base_url + 'update-remove-use-wallet', postData, { headers: this.headers });
  }

  confircashfreeminitiateonline(sid, order_id, txn_id){
    let postData = new FormData();
    postData.append('sid', sid);
    postData.append('order_id', order_id);
    postData.append('txn_id', txn_id);
    return this.httpClient.post(this.base_url + 'confirm-cashree-order', postData, { headers: this.headers });
  }

  cashfreepayOnlineTryAgain(failed_sid){
    let postData = new FormData();
    postData.append('failed_sid', failed_sid);
    return this.httpClient.post(this.base_url + 'cashfree-try-again', postData, { headers: this.headers });
  }

  initiateAddcash(amount,user_id){
    let postData = new FormData();
    postData.append('amount', amount);
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'initiate-add-cash-with-cashfree', postData, { headers: this.headers });
  }

  confirmAddcashFree(order_id,user_id,txn_id){   
    let postData = new FormData();
    postData.append('order_id', order_id);
    postData.append('user_id', user_id);
    postData.append('txn_id', txn_id);
    return this.httpClient.post(this.base_url + 'confirm-add-cash-with-cashfree', postData, { headers: this.headers });
  }

  initiateBuySubscriptionCashFree(plan_id,user_id){
    let postData = new FormData();
    postData.append('plan_id', plan_id);
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'cashfree-initiate-buy-subscription', postData, { headers: this.headers });
  }

  confirmBuySubscriptionCashFree(token,txn_id,user_id,paid_amount){
    let postData = new FormData();
    postData.append('token', token);
    postData.append('txn_id', txn_id);
    postData.append('user_id', user_id);
    postData.append('paid_amount', paid_amount);
    return this.httpClient.post(this.base_url + 'cashfree-confirm-buy-subscription', postData, { headers: this.headers });
  }

  //subscription module

  getSubscription(user_id){
    let postData = new FormData();
    postData.append('user_id', user_id);
    return this.httpClient.post(this.base_url + 'current-plan-details', postData, { headers: this.headers });
  }

  getSubscriptionPlans() {
    return this.httpClient.get(this.base_url + 'subscription-plans');
  }

  getSubscriptionFaqs() {
    return this.httpClient.get(this.base_url + 'subscription-faqs');
  }

  getSocialLinks() {
    return this.httpClient.get(this.base_url + 'social-links');
  }

  initiateBuySubscription(user_id,plan_id){
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('plan_id', plan_id);
    return this.httpClient.post(this.base_url + 'initiate-buy-subscription', postData, { headers: this.headers });
  }

  confirmBuySubscription(token,user_id,paid_amount,txn_id){
    let postData = new FormData();
    postData.append('token', token);
    postData.append('user_id', user_id);
    postData.append('paid_amount', paid_amount);
    postData.append('txn_id', txn_id);
    return this.httpClient.post(this.base_url + 'confirm-buy-subscription', postData, { headers: this.headers });
  }

}
