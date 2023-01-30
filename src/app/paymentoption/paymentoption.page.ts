import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { PaymentoptionmodalComponent } from '../modals/paymentoptionmodal/paymentoptionmodal.component';
declare var RazorpayCheckout: any;
declare var PgCordovaWrapper: any;
@Component({
  selector: 'app-paymentoption',
  templateUrl: './paymentoption.page.html',
  styleUrls: ['./paymentoption.page.scss'],
})
export class PaymentoptionPage implements OnInit {
  public sid;
  public user_id;
  public payment_option;
  token;
  txn_id = '';
  payment_type: string;
  currency: string = 'INR';
  email: any;
  mobile: any;
  name: any;
  razorpayOrderId: any;
  grand_total: any;
  order_id: any;
  public grandtotal;
  public discountamount;
  public cart_id: any;
  public cart_count;
  select_pay:any;
  wallet_message:boolean=false;
  wallet_check:any;
  fail_order_id:any;
  online_grand_total:any;
  razoppay_order_id:any;
  cf_token: any;
  cf_appId: any;
  order_token: any;
  online_pay_amount: any;
  selected_method:any;
  constructor(private apiserv: ApiService,
    public utilserv: UtilityService,
    private navctrl: NavController,
    private actroute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private router: Router,private alertCtrl:AlertController,
    private iab: InAppBrowser,
    private modalctrl:ModalController) {
    this.sid = localStorage.getItem('sid');
    this.user_id = localStorage.getItem('user_id');
    this.grand_total = this.actroute.snapshot.paramMap.get('totalamount');
    this.wallet_check = this.actroute.snapshot.paramMap.get('walletCheck');
  }


  radioGroupChange(event) {
    this.select_pay=event;
    if(event=="COD"){
      this.payment_type=event;
      this.wallet_message=false;
      this.do_payment_success(); 
    }else if(event=="Razorpay"){
      this.selected_method='Razorpay';
      if(this.wallet_check=='true'){
        this.payment_type="Pay Online"
      }else{
        this.payment_type="Pay Online";
      }
      this.wallet_message=false;
      this.razorPay();
    }else if(event=="Paytm"){
      this.selected_method='Paytm';
      if(this.wallet_check=='true'){
        this.payment_type="Pay Online"
      }else{
        this.payment_type="Pay Online";
      }
      this.wallet_message=false;
      this.paytmPay();
    }else if(event=="Cashfree"){
      this.selected_method='Cashfree';
      if(this.wallet_check=='true'){
        this.payment_type="Pay Online"
      }else{
        this.payment_type="Pay Online";
      }
      this.wallet_message=false;
      this.cashfreepay();
    }
    
  }

  ngOnInit() {
  }

  async initiatePayOnline(){
      
    if(this.utilserv.setting_data.payment_paytm=='Yes' && this.utilserv.setting_data.payment_razorpay=='No' && this.utilserv.setting_data.cashfree == 'No'){
        
       this.paytmPay();
    }
    else if(this.utilserv.setting_data.payment_razorpay=='Yes' && this.utilserv.setting_data.payment_paytm=='No' && this.utilserv.setting_data.cashfree == 'No'){
      this.razorPay();
      
    }
    else if(this.utilserv.setting_data.payment_razorpay=='No' && this.utilserv.setting_data.payment_paytm=='No' && this.utilserv.setting_data.cashfree == 'Yes'){
      this.cashfreepay();
      
    }
    // else if(this.utilserv.setting_data.payment_paytm=='Yes' || this.utilserv.setting_data.payment_razorpay=='Yes' || this.utilserv.setting_data.cashfree == 'Yes'){
    //   const modal = await this.modalctrl.create({
    //     component: PaymentoptionmodalComponent,
    //     cssClass: 'custom-filter-modal',
    //   });
    //   let that = this;
    //   modal.onDidDismiss().then(function (res) {
  
    //   })
    //   modal.present();
    // }
    
 
}

  async razorPay(){
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
    this.apiserv.initiatePayOnline(this.sid, this.user_id, this.payment_type).subscribe(data => {
      var response = data['response'][0];
      loading.dismiss();
      if (response['status'] == 'Valid') {
        that.razoppay_order_id=response['razoppay_order_id']
        that.fail_order_id=response['order_id'];
        that.name=response['name'];
        that.email=response['email'];
        that.mobile=response['mobile'];
        that.online_grand_total=response['pay_online_amount'];
        that.utilserv.reset_sid();
        that.doOnlinepayment(that.name,that.mobile,that.email,that.online_grand_total,that.fail_order_id,that.razoppay_order_id);
      } else {
        loading.dismiss();
        that.utilserv.presentAlert(response['message']);
      }
    },(err)=>{
      loading.dismiss();
    })
  }



  async do_payment_success() {
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
    this.apiserv.confirmorder(this.sid, this.user_id, this.payment_type).subscribe(data => {
      loading.dismiss();
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        // that.utilserv.presentAlert('Cash Payment request submitted successfully');
        that.router.navigate(['paymentsuccess',{order_id:response['order_id']}]);
        // that.navctrl.navigateBack('/paymentsuccess');
        that.utilserv.reset_sid();
        // }
      } else {
        loading.dismiss();
        that.utilserv.presentAlert(response['message']);
      }
    },(err)=>{
      loading.dismiss();
    })
  }

  doOnlinepayment(name,mobile,email,grand_total,order_id,razorpayOrderId) {
    console.log(this.payment_type);
    let that = this;
    var options = {
      description: 'Rovor',
      image: null,
      currency: that.currency, // your 3 letter currency code
      key: that.utilserv.setting_data.razorpay_key_id, // your Key Id from Razorpay dashboard
      order_id: razorpayOrderId,
      amount: grand_total * 100, // Payment amount in smallest denomiation e.g. cents for USD
      name: 'Rovor App',
      prefill: {
        email: email,
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
      var failed_sid=that.sid;
      localStorage.setItem('failed_sid',failed_sid);
      that.utilserv.reset_sid();
      that.router.navigate(['paymentfailure',{order_id:that.fail_order_id,selected_method:that.selected_method}]);
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
    this.apiserv.confirminitiateonline(this.sid, order_id, this.txn_id).subscribe(data => {
      loading.dismiss();
      var response = data['response'][0];
      if (response['status'] == "Valid") {
        this.utilserv.reset_sid();
        this.router.navigate(['paymentsuccess',{order_id:response['order_id']}]);
      }

    },(err)=>{
      loading.dismiss();
    })
  }


  async paytmPay(){
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
    var inappbrowser = that.iab.create("https://rovor.co.in/webservices/initiate-with-paytm?sid=" + 
    that.sid + "&user_id=" + that.user_id+"&payment_option=" +that.payment_type, '_blank', { location: 'no', zoom: 'yes', hideurlbar: 'yes' });
    var success_url = 'https://rovor.co.in/webservices/paytm-response';
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
        that.checkPaymentStatus(that.sid);
      } else if (retryAllowed == 'false') {
        inappbrowser.close();
        that.utilserv.presentToast('Payment Failure', 'danger');      
      }
    });
  }

  async checkPaymentStatus(sid){
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
    this.apiserv.checkPaytmStatus(sid).subscribe(data => {
      var response = data['response'][0];
      loading.dismiss();
      if (response['status'] == 'Valid') {
        if(response['order_id']){
          that.router.navigate(['paymentsuccess',{order_id:response['order_id']}]);
          that.utilserv.reset_sid();
        }
       
        // }
      } else {
        loading.dismiss();
        that.utilserv.presentAlert(response['message']);
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
    this.apiserv.initiatecashPayOnline(this.sid, this.user_id, this.payment_type).subscribe(data => {
      var response = data['response'][0];
      loading.dismiss();
      if (response['status'] == 'Valid') {
        that.order_id = response['order_id']
        that.fail_order_id = response['order_id'];
        that.name = response['name'];
        that.email = response['email'];
        that.mobile = response['mobile'];
        that.online_grand_total = response['pay_online_amount'];
        that.online_pay_amount = '';
        that.online_pay_amount = that.online_grand_total;
        console.log(that.online_grand_total);
        that.cf_token = response['cftoken'];
        that.cf_appId = response['cashfree_key_id'];
        that.utilserv.reset_sid();
        that.docashfreeOnlinepayment(that.name, that.mobile, that.email, that.online_pay_amount, that.order_id, that.cf_token, that.cf_appId);
      } else {
        loading.dismiss();
        that.utilserv.presentAlert(response['message']);
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
      'orderAmount': that.grand_total,
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
        } else if (res.txStatus == 'FAILED') {
          var failed_sid = that.sid;
          localStorage.setItem('failed_sid', failed_sid);
          that.utilserv.reset_sid();
          that.router.navigate(['paymentfailure', { order_id: paymentOrderId,selected_method:that.selected_method}]);
        }
        else if (res.txStatus == 'CANCELLED') {
          var failed_sid = that.sid;
          localStorage.setItem('failed_sid', failed_sid);
          that.utilserv.reset_sid();
          that.router.navigate(['paymentfailure', { order_id: that.order_id,selected_method:that.selected_method}]);
        }
      },
      function (error) {
        var failed_sid = that.sid;
        localStorage.setItem('failed_sid', failed_sid);
        that.utilserv.reset_sid();
        that.router.navigate(['paymentfailure', { order_id: that.order_id,selected_method:that.selected_method}]);
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
    this.apiserv.confircashfreeminitiateonline(this.sid, order_id, txn_id).subscribe(data => {
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

  // const exitApp_confirm_alert = await this.alertCtrl.create({
      //   header: 'Confirm!',
      //   message: 'Please select which method you want to continue',
      //   buttons: [
      //     {
      //       text: 'Paytm',
      //       cssClass: 'secondary',
      //       handler: () => {
      //        this.paytmPay();
      //        this.alertCtrl.dismiss();
      //       }
      //     }, {
      //       text: 'Razorpay',
      //       cssClass: 'secondary',
      //       handler: () => {
      //         this.razorPay();
      //         this.alertCtrl.dismiss();
      //       }
      //     },
      //     {
      //       text: 'CashFree',
      //       cssClass: 'secondary',
      //       handler: () => {
      //        this.cashfreepay();
      //        this.alertCtrl.dismiss();
      //       }
      //     }, 
      //   ]
      // });
      // await exitApp_confirm_alert.present();

}