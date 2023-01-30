import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';
declare var RazorpayCheckout: any;
declare var PgCordovaWrapper: any;
@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.page.html',
  styleUrls: ['./orderdetail.page.scss'],
})
export class OrderdetailPage implements OnInit {
  public order_id;
  order_date: any;
  delivery_date: any;
  delivery_time: any;
  payment_option: any;
  payment_status: any;
  delivery_charges: any;
  grand_total: any;
  items: any = [];
  shipping: any;
  sub_total: any;
  discount: any;
  gst: any;
  status: any;
  total: any;
  address: any;
  buildingname: any;
  city: any;
  email: any;
  flat_no: any;
  landmark: any;
  location: any;
  mobile: any;
  mame: any;
  street: any;
  order_log:any;
  is_cancel_available:any;
  gst_per:any;
  rating_status:any;
  rating:any;
  rating_review:any;
  online_amount:any;
  wallet_amount:any;
  delivery_tip:any;
  fail_payment:any;
  failed_sid:any;
  name:any;
  order_email:any;
  order_mobile:any;
  online_order_id:any;
  online_grand_total:any;
  currency: string = 'INR';
  txn_id = '';
  cf_token: any;
  cf_appId: any;
  order_token: any;
  online_pay_amount: any;
  payment_via:any;
  is_tracking_available:any;
  constructor(private apiserv: ApiService,private changeDet:ChangeDetectorRef,
    public utilserv: UtilityService,private loadingCtrl:LoadingController,
    private activeroute: ActivatedRoute,private router:Router,private alertCtrl:AlertController) {
    this.order_id = this.activeroute.snapshot.params['order_id'];
  }

  ngOnInit() {
    // this.vieworderdetail();
  }

  ionViewWillEnter(){
    this.vieworderdetail();
    if(localStorage.getItem('user_id')){
      this.utilserv.getWallet();
    }
  }

  trackOrder(){
    this.router.navigate(['trackorder',{'order_id':this.order_id}]);
  }

  async vieworderdetail() {
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
    this.apiserv.vieworder(this.order_id).subscribe(data => {
      console.log(data);
      loading.dismiss();
      var response = data['response'][0];
      this.items = response['items'];
      console.log(this.items);
      this.order_id = response['order_id'];
      this.order_date = response['order_date'];
      this.delivery_date = response['delivery_date'];
      this.delivery_time = response['delivery_time'];
      this.shipping = response['delivery_charges'];
      this.is_cancel_available=response['is_cancel_available'];
      this.sub_total = response['sub_total'];
      this.delivery_charges = response['delivery_charges'];
      this.delivery_tip = response['tip'];
      this.status = response['status'];
      this.payment_option = response['payment_option'];
      this.payment_status = response['payment_status'];
      this.discount = response['coupon_amount'];
      this.gst_per = response['tax_percentage'];
      this.gst = response['tax_amount'];
      this.grand_total = response['grand_total'];
      this.address = response['address'];
      this.order_log=response['order_log'];
      this.rating_status=response['is_rating_enable'];
      this.rating=response['rating'];
      this.rating_review=response['review'];
      this.wallet_amount=response['wallet_amount'];
      this.online_amount=response['online_amount'];
      this.fail_payment=response['is_payonline_tryagain_available'];
      this.failed_sid=response['sid'];
      this.payment_via=response['payment_via'];
      this.is_tracking_available=response['is_tracking_available'].toLowerCase();
      console.log(this.is_tracking_available);
      this.changeDet.detectChanges();
      // this.buildingname = this.address['building_name'];


    },(err)=>{
      loading.dismiss();
    })
  }

  addReview(id){
    this.router.navigate(['addreview',{order_id:id}]);
  }

  
  async cancelOrder() {
    
    const exitApp_confirm_alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Do you really want to cancel the order?',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {
            this.apiserv.cancelOrder(this.order_id).subscribe(data => {
              var response = data['response'][0];
              console.log(response);
              if (response['status'] == 'Valid') {
                this.router.navigate(['myorders']);
        
              } else {
                // this.ongoingmessage = response['message'];
        
              }
            })
          }
        }, {
          text: 'Cancel',
          handler: () => {
            console.log('Confirm Okay');
            this.alertCtrl.dismiss();
          }
        }
      ]
    });
    await exitApp_confirm_alert.present();
    
  }

  async doOnline(){
    let that = this;
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
    this.apiserv.payOnlineTryAgain(this.failed_sid).subscribe(data => {
      var response = data['response'][0];
      loading.dismiss();
      if (response['status'] == 'Valid') {
        this.name=response['name'];
        this.order_email=response['email'];
        this.order_mobile=response['mobile'];
        this.online_grand_total=response['grand_total'];
        this.online_order_id=response['order_id'];
        this.doOnlinepayment(this.name,this.order_email,this.order_mobile,this.online_grand_total,this.online_order_id);
      } else {
        loading.dismiss();
        this.utilserv.presentAlert(response['message']);
      }
    },(err)=>{
      loading.dismiss();
    })
  }

  doOnlinepayment(name,email,mobile,grand_total,order_id) {
    let that = this;
    var options = {
      description: 'Rovor',
      image: null,
      currency: that.currency, // your 3 letter currency code
      key: that.utilserv.setting_data.razorpay_key_id, // your Key Id from Razorpay dashboard
      // order_id: this.razorpayOrderId,
      amount: grand_total * 100, // Payment amount in smallest denomiation e.g. cents for USD
      name: 'Rovor App',
      prefill: {
        email:email,
        contact: mobile,
        name: name
      },
      theme: {
        color: this.utilserv.color_data.header_colour
      },
      modal: {
        ondismiss: function () {
        }
      }
    };

    var successCallback = function (payment_id) {
      // alert('payment_id: ' + payment_id);
      that.txn_id = payment_id;
      // orderId = success.razorpay_order_id
      that.do_online_payment_success(order_id);
    };

    var cancelCallback = function (error) {
      // alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }

  async do_online_payment_success(order_id) {
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
    this.apiserv.confirminitiateonline(this.failed_sid, order_id, this.txn_id).subscribe(data => {
      loading.dismiss();
      var response = data['response'][0];
      if (response['status'] == "Valid") {
        setTimeout(() => {
          this.vieworderdetail();
        }, 10); 
        // this.router.navigate(['paymentsuccess',{order_id:response['order_id']}]);
      }

    },(err)=>{
      loading.dismiss();
    })
  }

  async cashfreepay() {
    let that = this;
    let loading = await this.loadingCtrl.create({

      showBackdrop: false,

      cssClass: 'sacustom-cls',

      message: `
           
      <div class="custom-spinner-container">
             
      <img class="loading" width="40px" height="40px" 
      src="assets/images/cmoon.gif" />
           
      </div>`

    });
    loading.present();
    this.apiserv.cashfreepayOnlineTryAgain(this.failed_sid).subscribe(data => {
      var response = data['response'][0];
      loading.dismiss();
      console.log(response);
      if (response['status'] == 'Valid') {
        that.name = response['name'];
        that.email = response['email'];
        that.mobile = response['mobile'];
        that.grand_total = response['grand_total'];
        that.online_order_id = response['order_id'];
        that.cf_token = response['cf_token'];
        that.cf_appId = response['cashfree_key_id'];
        that.docashfreeOnlinepayment(that.name, that.mobile, that.email, that.grand_total, that.online_order_id, that.cf_token, that.cf_appId);
        //  this.doOnlinepayment(this.name,this.email,this.mobile,this.grand_total,this.online_order_id);
      } else {
        loading.dismiss();
        this.utilserv.presentAlert(response['message']);
      }
    }, (err) => {
      loading.dismiss();
    })
  }


  docashfreeOnlinepayment(name, mobile, email, online_grand_total, order_id, cf_token, cf_appId) {
    let that = this;
    that.name = name;
    that.mobile = mobile;
    that.email = email;
    that.online_grand_total = online_grand_total;
    that.order_id = order_id;
    that.cf_token = cf_token;
    that.cf_appId = cf_appId;

    let params = {
      'appId': that.cf_appId, //app-id here
      'orderId': that.order_id,
      'orderAmount': that.online_grand_total,
      'orderCurrency': 'INR',
      'orderNote': 'Cashfree',
      'customerName': that.name,
      'customerPhone': that.mobile,
      'customerEmail': that.email,
      'notifyUrl': 'https://www.colourmoon.com/',
      'stage': this.utilserv.setting_data.cashfree_environment,
      'tokenData': that.cf_token //cftoken here
    };

    PgCordovaWrapper.startPaymentWEB(params,
      function (success) {
        // alert(JSON.stringify(success));
        var res = JSON.parse(success);
        console.log(JSON.parse(success));
        if (res.txStatus == 'SUCCESS') {
          var paymentOrderId = res.orderId;
          var transaction_id = res.referenceId;
          that.cashfree_do_online_payment_success(paymentOrderId, transaction_id);
        }
      },
      function (error) {
        //  alert(JSON.stringify(error));
        console.log('exception : ' + error.message);
      });
  }


  async cashfree_do_online_payment_success(order_id, txn_id) {
    let loading = await this.loadingCtrl.create({
      showBackdrop: false,
      cssClass: 'sacustom-cls',
      message: `           
      <div class="custom-spinner-container">             
      <img class="loading" width="40px" height="40px" 
      src="assets/images/cmoon.gif" />           
      </div>`
    });
    loading.present();
    this.apiserv.confircashfreeminitiateonline(this.failed_sid, order_id, txn_id).subscribe(data => {
      loading.dismiss();
      var response = data['response'][0];
      //   alert(JSON.stringify(response));
      if (response['status'] == "Valid") {
        this.utilserv.reset_sid();
        this.router.navigate(['paymentsuccess', { order_id: response['order_id'] }]);
      }

    },(err)=>{
      console.log("Network Error");
      loading.dismiss();
    })

  }
}

