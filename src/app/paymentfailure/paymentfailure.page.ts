import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';
declare var RazorpayCheckout: any;
declare var PgCordovaWrapper: any;
@Component({
  selector: 'app-paymentfailure',
  templateUrl: './paymentfailure.page.html',
  styleUrls: ['./paymentfailure.page.scss'],
})
export class PaymentfailurePage implements OnInit {
  order_id:any;
  name:any;
  email:any;
  mobile:any;
  grand_total:any;
  online_order_id:any;
  currency: string = 'INR';
  txn_id = '';
  failed_sid:any;
  online_grand_total: any;
  cf_token: any;
  cf_appId: any;
  order_token: any;
  online_pay_amount: any;
  selected_method:any;
  constructor(public utilserv:UtilityService,private router:Router,private activeroute:ActivatedRoute,
    private apiserv:ApiService,private loadingCtrl:LoadingController) {
    this.order_id=this.activeroute.snapshot.paramMap.get('order_id');
    this.selected_method=this.activeroute.snapshot.paramMap.get('selected_method');
   }

  ngOnInit() {
    // this.failed_sid=localStorage.getItem('failed_sid');
  }
  ionViewWillEnter() {
    this.failed_sid = localStorage.getItem('failed_sid');
  }

  goHome(){
    this.router.navigate(['home']);
  }

  goOrderDetail(){
    this.router.navigate(['orderdetail/'+this.order_id]);
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
        this.email=response['email'];
        this.mobile=response['mobile'];
        this.grand_total=response['grand_total'];
        this.online_order_id=response['order_id'];
        this.doOnlinepayment(this.name,this.email,this.mobile,this.grand_total,this.online_order_id);
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
        this.router.navigate(['paymentsuccess',{order_id:response['order_id']}]);
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
      // alert(JSON.stringify(response));
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
      'orderNote': 'Cashfree Payment',
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
