import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
declare var RazorpayCheckout: any;
declare var PgCordovaWrapper: any;
@Component({
  selector: 'app-addcash',
  templateUrl: './addcash.page.html',
  styleUrls: ['./addcash.page.scss'],
})
export class AddcashPage implements OnInit {
  amount:any;
  currency: string = 'INR';
  email: any;
  mobile: any;
  name: any;
  user_id:any;
  txn_id:any;
  cash_amount:any;
  select_pay:any;
  cf_appId: any;
  order_id: string = '';
  cf_token: any;
  grand_total: any;
  online_grand_total: any;
  @ViewChild('input') myInput ;
  constructor(public utilserv:UtilityService,private apiserv:ApiService,private router:Router,
    private loadingCtrl:LoadingController,private iab: InAppBrowser,) { 
    this.user_id=localStorage.getItem('user_id');
  }

  ngOnInit() {
    this.getProfile();
  }

  ionViewWillEnter () {
    setTimeout(() => {
      this.myInput.setFocus();
    },150);

  }

  cashAmount(value){
    this.amount=value;
  }

  getProfile() {
    this.apiserv.Profile(this.user_id).subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      this.name = response['name'];
      this.mobile = response['mobile'];
      this.email = response['email'];
    })
  }

  radioGroupChange(event) {
    this.select_pay=event;
    console.log(this.select_pay);
  }

  addCash(amount) {
    var pattern = /^[0-9]*$/;
    if (pattern.test(amount) == false) {
      this.utilserv.presentAlert('Enter valid amount');
      return;
    }
   else if (this.select_pay == "" || this.select_pay == undefined) {
      this.utilserv.presentAlert('Select Any Payment Menthod');
      return;
    }
    else if(this.select_pay=='Razorpay'){
      this.doRazorPay(amount);
    }
    else if(this.select_pay=='Paytm'){
      this.doPaytm(amount);
    }
    else if(this.select_pay=='Cashfree'){
      this.cashfreepay(amount);
    }
   
  }

  doRazorPay(amount){
    if (this.utilserv.setting_data.razorpay_key_id == "" || this.utilserv.setting_data.razorpay_key_id == undefined) {
      this.utilserv.presentAlert('Payment Gateway Not Avaiable. It Will be available soon!');
      return;
    }
    this.cash_amount=amount;
    let that = this;
    var options = {
      description: 'Rovor',
      image: null,
      currency: that.currency, // your 3 letter currency code
      key: that.utilserv.setting_data.razorpay_key_id, // your Key Id from Razorpay dashboard
      // order_id: this.razorpayOrderId,
      amount: that.cash_amount * 100, // Payment amount in smallest denomiation e.g. cents for USD
      name: 'Rovor App',
      prefill: {
        email: that.email,
        contact: that.mobile,
        name: that.name
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
      that.do_online_payment_success();
    };

    var cancelCallback = function (error) {
      //  alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }

  async do_online_payment_success() {
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
    this.apiserv.confirmAddCash(this.user_id, this.cash_amount, this.txn_id).subscribe(data => {
      // alert(JSON.stringify(data));
      loading.dismiss();
      var response = data['response'][0];
      if (response['status'] == "Valid") {
        this.router.navigate(['mywallet']);
      }

    },(err)=>{
      loading.dismiss();
    })
  }

  async doPaytm(amount){
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
    var inappbrowser = that.iab.create("https://rovor.co.in/webservices/paytm-initiate-add-cash?amount=" + 
    amount + "&user_id=" + that.user_id, '_blank', { location: 'no', zoom: 'yes', hideurlbar: 'yes' });
    var success_url = 'https://rovor.co.in/webservices/paytm-ac-response';
    var failure_url = '';
    // alert(inappbrowser);
    inappbrowser.on('loadstop').subscribe(event => {
      loading.dismiss();
      // alert(JSON.stringify(event));
      var responseUrl = event.url;
      // .split('?')[0];
      var url = new URL(responseUrl);
      var retryAllowed = url.searchParams.get("retryAllowed");
      if (responseUrl == success_url) {
        inappbrowser.close();
      } else if (retryAllowed == 'false') {
        inappbrowser.close();
        that.utilserv.presentToast('Payment Failure', 'danger');      
      }
    });
  }

  cashfreepay(cash_amount) {
    this.apiserv.initiateAddcash(cash_amount, this.user_id).subscribe(data => {
      // alert(JSON.stringify(data));
      var response = data['response'][0];
      console.log(response);
      if (response['status'] == "Valid") {
        this.order_id = response['order_id'].toString();
        console.log(this.order_id);
        this.grand_total = response['amount'];
        this.cf_token = response['cftoken'];
        this.cf_appId = response['cashfree_key_id'];
        this.docashfreeOnlinepayment(this.grand_total, this.order_id, this.cf_token, this.cf_appId);
      }
    })
  }


  docashfreeOnlinepayment(online_grand_total, order_id, cf_token, cf_appId) {
    let that = this;
    that.online_grand_total = online_grand_total;
    that.order_id = order_id;
    that.cf_token = cf_token;
    that.cf_appId = cf_appId;
    let params = {
      'appId': that.cf_appId, //app-id here
      'orderId': that.order_id,
      'orderAmount': that.grand_total,
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
        //   that.router.navigate(['paymentfailure',{order_id:paymentOrderId}]);
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
    this.apiserv.confirmAddcashFree(order_id, this.user_id, txn_id).subscribe(data => {
      loading.dismiss();
      var response = data['response'][0];
      console.log(response);
      //   alert(JSON.stringify(response));
      if (response['status'] == "Valid") {
        this.router.navigate(['mywallet']);
      }

    },(err)=>{
      loading.dismiss();
    })

  }

  

}
