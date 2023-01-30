import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { CouponlistComponent } from '../modals/couponlist/couponlist.component';
import { FilterComponent } from '../modals/filter/filter.component';
import { SubscriptionmodalComponent } from '../modals/subscriptionmodal/subscriptionmodal.component';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-revieworder',
  templateUrl: './revieworder.page.html',
  styleUrls: ['./revieworder.page.scss'],
})
export class RevieworderPage implements OnInit {
  public coupon_code: string = null;
  public isCouponApplied: boolean = false;
  coupon_container = false;
  public sid;
  public user_id;
  cartitemslist: any;
  subtotal: any;
  total: any;
  shipping: any;
  discount: any;
  tip:any;
  gst: any;
  message: any;
  status: any;
  min_amount: any;
  cart_count: any;
  earliest:any;
  no_icon:any;
  no_message:any;
  coupon_invalid:boolean=false;
  review_item:any;
  wallet:boolean=false;
  grandtotal:any;
  wallet_check:boolean=false;
  bal_check:boolean=false;
  avail_bal:any;
  tip_amount:any;
  subscription:any;
  sub_show:any='false';
  tip_list:any=[];
  coupon_message:any;
  need_to_pay:any;
  wallet_used_amount:any;
  constructor(private apiserv: ApiService,
    public utilserv: UtilityService,
    private loadingCtrl: LoadingController,
    private route: Router,
    private navctrl: NavController,private modalctrl:ModalController) {
    this.sid = localStorage.getItem('sid');
    this.user_id = localStorage.getItem('user_id');
  }
  ngOnInit() {

  }

  ionViewWillEnter() {
    this.cartcount();
    this.cartdetail();
    this.getEarliestDelivery();
    // this.wallet_check=false;
    this.wallet=false;
    this.bal_check=false;
    if(this.utilserv.setting_data.tips=='Yes'){
      this.getTipList();
    }
    if(this.utilserv.setting_data.subscription=='Yes'){
      this.getSubscription();
    }
  }

  async iconClick(value){
    if(this.tip_amount==value){
      this.tip_amount='';
      let loading = await this.loadingCtrl.create({
        
        showBackdrop:false,
             
        cssClass:'sacustom-cls',     
               
        message:`
             
        <div class="custom-spinner-container">
               
        <img class="loading" width="40px" height="40px" 
        src="assets/images/cmoon.gif" />
             
        </div>`
           
        });
        loading.present();
        this.apiserv.removeTip(this.sid).subscribe(data => {
          loading.dismiss();
          var response = data['response'][0];
          if (response['status'] == 'Valid') {
            // this.utilserv.presentAlert(response['message']);
            this.cartdetail();
          }
          else{
            this.utilserv.presentAlert(response['message']);
            this.cartdetail();
          }
        },(err)=>{
          loading.dismiss();
          this.utilserv.presentAlert("Network Error");
        })
    }else{
      this.tip_amount=value;
      let loading = await this.loadingCtrl.create({
        
        showBackdrop:false,
             
        cssClass:'sacustom-cls',     
               
        message:`
             
        <div class="custom-spinner-container">
               
        <img class="loading" width="40px" height="40px" 
        src="assets/images/cmoon.gif" />
             
        </div>`
           
        });
        loading.present();
        this.apiserv.updateTip(this.sid,this.tip_amount).subscribe(data => {
          loading.dismiss();
          var response = data['response'][0];
          if (response['status'] == 'Valid') {
            this.cartdetail();
          }
          else{
            this.utilserv.presentAlert(response['message']);
            this.cartdetail();
          }
        },(err)=>{
          loading.dismiss();
          this.utilserv.presentAlert("Network Error");
        })
    }
    
  }

  getSubscription(){
    this.apiserv.getSubscription(this.user_id).subscribe(data => {
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.sub_show='true';
      }
      else{
        this.sub_show='false';
      }
    },(err)=>{
      this.utilserv.presentAlert("Network Error");
    })
  }

  async subscribemodal() {
    const modal = await this.modalctrl.create({
      component: SubscriptionmodalComponent,
      cssClass: 'custom-filter-modal'
    });
    let that = this;
    modal.onDidDismiss().then(function (res) {
      that.subscription = res.data.sort_type
      //  that.sort_first = true;
      // this.products=[];

    })
    modal.present();
  }

  cartcount() {
    this.apiserv.cartcountdata(this.sid).subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.cart_count = response['count'];
      }
    })
  }
  async cartdetail() {
     let loading = await this.loadingCtrl.create({
      
      showBackdrop:false,
           
      cssClass:'sacustom-cls',     
             
      message:`
           
      <div class="custom-spinner-container">
             
      <img class="loading" width="40px" height="40px" 
      src="assets/images/cmoon.gif" />
           
      </div>`
         
      });
      loading.present();
    this.apiserv.cartview(this.sid,this.user_id).subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      this.status = response['status'];
      if(response['icon']){
        this.no_icon=response['icon'];
      }
      if(response['message']){
        this.no_message=response['message'];
      }
      loading.dismiss();
      if (response['status'] == 'Valid') {
        this.review_item=response;
        console.log(this.review_item);
        this.cartitemslist = response['items'];
        this.subtotal = response['sub_total'];
        this.grandtotal=response['grand_total'];
        this.shipping = response['shipping'];
        this.gst = response['gst'];
        this.discount = response['discount'];
        this.tip = response['tip'];
        this.coupon_code=response['discount_coupon_code'];
        this.need_to_pay=response['need_to_pay'];
        this.wallet_used_amount=response["wallet_used_amount"];
        if(response['wallet_used_amount']>0){
          this.wallet_check=true;
        }else{
          this.wallet_check=false;
        }
        // if(this.wallet_check==false){
        //   this.total = response['grand_total'];
        // }
        // else{
        //   if(parseInt(this.grandtotal)>=parseInt(this.utilserv.walletAmount)){
        //     this.total=parseInt(this.grandtotal)-parseInt(this.utilserv.walletAmount);
        //     if(this.total!=0){
        //       this.wallet=true;
        //       this.bal_check=false;
        //     }
        //     else{
        //       this.wallet=false;
        //       this.bal_check=false;
        //     }
        //   }
        //   else if(parseInt(this.utilserv.walletAmount)>parseInt(this.grandtotal)){
        //     var wallet_bal=parseInt(this.utilserv.walletAmount)-parseInt(this.grandtotal);
        //     this.avail_bal=wallet_bal;
        //     this.bal_check=true;
        //     this.total=0;
        //     this.wallet=false;
        //     console.log(wallet_bal);
        //   }
        // }
        if(response['discount_coupon_code']){
          this.isCouponApplied = true;
          this.coupon_message='';
        }
        if(response['tip']){
          this.tip_amount=response['tip'];
        }
      } else if (response['status'] == 'Invalid') {
        this.message = response['message'];
      }
    },(err)=>{
      loading.dismiss();
      this.coupon_code='';
    })
  }
  

  updatecart_qty(cart_id, qty) {
    this.apiserv.updatequantity(this.sid, cart_id, qty,this.user_id).subscribe(server_response => {
      var data = server_response['response'][0];
      if (data['status'] == 'Valid') {
        this.wallet=false;
        this.wallet_check=false;
      }
      else{
        this.utilserv.presentAlert(data['message']);
      }
      this.cartdetail();
      this.cartcount();
    })
  }

  remove_cart_item(cart_id) {
    let that = this;
    this.apiserv.removeitemfromcart(this.sid, cart_id).subscribe(response => {
      var data = response['response'][0];
      if (data['status'] == 'Valid') {
        // that.utilserv.presentToast(data['message'], 'success');
        that.wallet=false;
        that.wallet_check=false;
        that.coupon_invalid=true;
        that.coupon_message='';
        that.isCouponApplied = false;
        that.cartdetail();
        that.cartcount();
      }
    })
  }

  increase(cart_id) {
    console.log(cart_id);
    this.cartitemslist.forEach(ob => {
      if (ob.id == cart_id) {
        ob.quantity = parseInt(ob.quantity) + 1;
        this.updatecart_qty(cart_id, ob.quantity);
        // if(parseInt(ob.quantity)<parseInt(ob.cart_limit)){
        //   ob.quantity = parseInt(ob.quantity) + 1;
        //   //update cart
        //   this.updatecart_qty(cart_id, ob.quantity);
        //   this.cartdetail();
        //   //this.Get_cart_Count();
        // }
        // else{
        //   this.utilserv.presentAlert("You are able to add this product upto "+ob.cart_limit+" only!");
        // }
       
      }
    })
  }

  decrease(cart_id) {
    this.cartitemslist.forEach((ob, index, object) => {
      console.log(ob);
      console.log(index);
      console.log(object);
      if (ob.id == cart_id) {
        if (ob.quantity >= 1) {
          ob.quantity = parseInt(ob.quantity) - 1;
          this.updatecart_qty(cart_id, ob.quantity);
          // this.cartdetail();
          //this.Get_cart_Count();
        }
        if (ob.quantity < 1) {
          object.splice(index, 1);
          // delete
          this.remove_cart_item(cart_id);
          // this.cartdetail();
          //this.Get_cart_Count();
        }
      }
    })
  }
  Show_coupons() {
    this.coupon_container = !this.coupon_container;
  }


  // minorder() {
  //   this.apiserv.minorderAmount().subscribe(data => {
  //     console.log(data);
  //     var response = data['response']['data'];
  //     console.log(response);
  //     this.min_amount = response['min_amount'];
  //     console.log(this.min_amount);

  //   })
  // }

  confirm_order() {
    // if (this.min_amount >= this.total) {
    //   this.utilserv.presentToast('Minimim order should be ' + this.min_amount, 'danger');
    // }

    if (this.user_id == '' || this.user_id == undefined || this.user_id == null) {
      // this.utilserv.presentToast('Please Login', 'danger');
      this.route.navigate(['login']);
      // setTimeout(() => {
      //   this.navctrl.navigateForward('/login');
      // }, 1000);
      // return;
    } else {
      localStorage.setItem('total_amount', this.need_to_pay);
      this.route.navigate(['deliveryaddress', { totalamount: this.need_to_pay,walletCheck: this.wallet_check}]);
    }
  }


  async Apply_coupon() {
    if (this.coupon_code == "" || this.coupon_code == undefined) {
      this.utilserv.presentAlert('Select Coupon Code');
      return;
    }
    else{
      let loading = await this.loadingCtrl.create({
      
        showBackdrop:false,
             
        cssClass:'sacustom-cls',     
               
        message:`
             
        <div class="custom-spinner-container">
               
        <img class="loading" width="40px" height="40px" 
        src="assets/images/cmoon.gif" />
             
        </div>`
           
        });
        loading.present();
      this.apiserv.applyCoupon(this.coupon_code, this.sid,this.user_id).subscribe(server_response => {
        loading.dismiss();
        var response = server_response['response'][0];
        if (response['status'] == 'Valid') {
          this.wallet=false;
          this.wallet_check=false;
          this.coupon_invalid=false;
          this.coupon_message='';
          this.isCouponApplied = true;
          this.cartdetail();
        } else {
          this.coupon_invalid=true;
          this.coupon_message=response['message'];
          // this.isCouponApplied = false;
          // this.utilserv.presentAlert(response['message']);
  
        }
      },(err)=>{
        loading.dismiss();
      })
    }
    
  }

  removeCoupon(){
    this.apiserv.removeCoupon(this.sid).subscribe(data => {
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.coupon_invalid=true;
        this.coupon_message='';
        this.isCouponApplied = false;
        this.cartdetail();
       
      }
    })
  }

  onChangeTime(){
    this.coupon_invalid = false;
  }

  Apply_btn(code) {
    this.coupon_code = code;
    this.Apply_coupon();
  }

  viewProduct(pid) {
    this.route.navigate(['/productview/' + pid,{walletCheck: this.wallet_check}]);
  }

  async getEarliestDelivery() {
    this.apiserv.getEarliestDelivery().subscribe(data => {
      var response = data['response'][0];
      //   this.dismissLoading();

      if (response['status'] == 'Valid') {
        this.earliest = response;
        console.log(this.earliest);
      }
    })
  }

  moreSlots(){
    this.route.navigate(['deliveryslots', { totalamount: this.need_to_pay,address:"not_select" ,walletCheck: this.wallet_check}]);
  }

  async addWallet(event){
    this.wallet_check=event.detail.checked;
    console.log(this.wallet_check);
    if(this.wallet_check==true){
      // if(parseInt(this.grandtotal)>=parseInt(this.utilserv.walletAmount)){
      //   this.total=parseInt(this.grandtotal)-parseInt(this.utilserv.walletAmount);
      //   if(this.total!=0){
      //     this.wallet=true;
      //     this.bal_check=false;
      //   }
      //   else{
      //     this.wallet=false;
      //     this.bal_check=false;
      //   }
      // }
      // else if(parseInt(this.utilserv.walletAmount)>parseInt(this.grandtotal)){
      //   var wallet_bal=parseInt(this.utilserv.walletAmount)-parseInt(this.grandtotal);
      //   this.avail_bal=wallet_bal;
      //   this.bal_check=true;
      //   this.total=0;
      //   this.wallet=false;
      //   console.log(wallet_bal);
      // }
      let loading = await this.loadingCtrl.create({
      
        showBackdrop:false,
             
        cssClass:'sacustom-cls',     
               
        message:`
             
        <div class="custom-spinner-container">
               
        <img class="loading" width="40px" height="40px" 
        src="assets/images/cmoon.gif" />
             
        </div>`
           
        });
        loading.present();
      this.apiserv.useWallet(this.sid,this.user_id).subscribe(data => {
        loading.dismiss();
        var response = data['response'][0];
        if (response['status'] == 'Valid') {
        }
        this.cartdetail();
        this.getEarliestDelivery();
      },(err)=>{
        loading.dismiss();
      })
     
    }
    else{
      // this.total=this.grandtotal;
      // this.bal_check=false;
      // this.wallet=false;
      let loading = await this.loadingCtrl.create({
      
        showBackdrop:false,
             
        cssClass:'sacustom-cls',     
               
        message:`
             
        <div class="custom-spinner-container">
               
        <img class="loading" width="40px" height="40px" 
        src="assets/images/cmoon.gif" />
             
        </div>`
           
        });
        loading.present();
      this.apiserv.removeWallet(this.sid).subscribe(data => {
        loading.dismiss();
        var response = data['response'][0];
        if (response['status'] == 'Valid') {
          this.earliest = response;
          console.log(this.earliest);
        }
        this.cartdetail();
        this.getEarliestDelivery();
      },(err)=>{
        loading.dismiss();
      })
    }
  }

  async couponModal() {
    const modal = await this.modalctrl.create({
      component: CouponlistComponent,
      cssClass: 'custom-filter-modal',
      componentProps: {
        'selected_coupon': this.coupon_code,
      }
    });
    let that = this;
    modal.onDidDismiss().then(function (res) {
      console.log(res.data);
      if(res.data.action=='close'){
        that.coupon_code = res.data.selected_coupon;
        that.Apply_coupon();
      }
      //  that.sort_first = true;
      // this.products=[];

    })
    modal.present();
  }

  async getTipList(){
    let loading = await this.loadingCtrl.create({
      
      showBackdrop:false,
           
      cssClass:'sacustom-cls',     
             
      message:`
           
      <div class="custom-spinner-container">
             
      <img class="loading" width="40px" height="40px" 
      src="assets/images/cmoon.gif" />
           
      </div>`
         
      });
      loading.present();
    this.apiserv.getTipList().subscribe(server_response => {
      loading.dismiss();
      var response = server_response['response'][0];
      if (response['status'] == 'Valid') {
        this.tip_list=response['tip_amounts'];
      } else {
        this.tip_list=[];
      }
    },(err)=>{
      loading.dismiss();
    })
  }

}


