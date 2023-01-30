import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { PaymentoptionmodalComponent } from '../modals/paymentoptionmodal/paymentoptionmodal.component';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
declare var RazorpayCheckout: any;
declare var PgCordovaWrapper: any;
@Component({
  selector: 'app-mysubscription',
  templateUrl: './mysubscription.page.html',
  styleUrls: ['./mysubscription.page.scss'],
})
export class MysubscriptionPage implements OnInit {
  package_id:any;
  sub_plans:any=[];
  sub_faq:any=[];
  user_id:any;
  currency: string = 'INR';
  name:any;
  mobile:any;
  email:any;
  txn_id = '';
  sub_show:any='false';
  sub_start_date:any;
  sub_end_date:any;
  sub_plan_price:any;
  sub_plan_title:any;
  payment_method:any;
  cf_appId: any;
  order_id: string = '';
  cf_token: any;
  grand_total: any;
  online_grand_total: any;
  constructor(public utilserv:UtilityService,private router:Router,
    private loadingCtrl:LoadingController,private apiserv:ApiService,
    private modalctrl:ModalController,private iab:InAppBrowser) {
      this.user_id=localStorage.getItem('user_id');
  }

  ngOnInit() {
    
  }
  
  ionViewWillEnter(){
    this.getProfile();
    this.getSubscription();
    this.getSubscriptionPlans();
    this.getSubscriptionFaqs();
  }

  getSubscription(){
    this.apiserv.getSubscription(this.user_id).subscribe(data => {
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.sub_show='true';
        this.sub_start_date=response['start_date'];
        this.sub_end_date=response['end_data'];
        this.sub_plan_title=response['plan_title'];
        this.sub_plan_price=response['plan_price'];
      }
      else{
        this.sub_show='false';
        this.sub_start_date='';
        this.sub_end_date='';
        this.sub_plan_title='';
        this.sub_plan_price='';
      }
    },(err)=>{
      this.utilserv.presentAlert("Network Error");
    })
  }

  async getSubscriptionPlans() {
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
     this.apiserv.getSubscriptionPlans().subscribe(data => {
       console.log(data);
       loading.dismiss();
       var response = data['response'][0];
       if (response['status'] == 'Valid') {
          this.sub_plans = response['plans'];
          this.package_id=this.sub_plans[0].plan_id;
          // if(this.sub_show=='true'){
          //   for(var i=0;i<this.sub_plans.length;i++){
          //     if(this.sub_plan_title==this.sub_plans[i].title){
          //       this.package_id=this.sub_plans[i].plan_id;
          //     }
          //   }
          // }else{
          //   this.package_id=this.sub_plans[0].plan_id;
          // }
          
       }else{
         this.sub_plans=[];
       }
     }, (err) => {
       loading.dismiss();
     });
 }

 async getSubscriptionFaqs() {
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
   this.apiserv.getSubscriptionFaqs().subscribe(data => {
     console.log(data);
     loading.dismiss();
     var response = data['response'][0];
     if (response['status'] == 'Valid') {
        this.sub_faq = response['faqs'];
     }else{
       this.sub_faq=[];
     }
   }, (err) => {
     loading.dismiss();
   });
}

  goTerms(){
    this.router.navigate(['terms']);
  }

  async subChange(event){
    console.log(event.detail.value);
    this.package_id=event.detail.value;
    
  }

  async buySub(){
    if (this.package_id == "" || this.package_id == undefined) {
      this.utilserv.presentAlert('Select Package');
      return;
    }else{
      this.sortmodal();
    }
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

  async sortmodal() {
    const modal = await this.modalctrl.create({
      component: PaymentoptionmodalComponent,
      cssClass: 'custom-filter-modal',
      componentProps: {
      }
    });
    let that = this;
    modal.onDidDismiss().then(function (res) {
      that.payment_method = res.data.payment_method;
      console.log(that.payment_method);
      if(that.payment_method=='' || that.payment_method==undefined){
        that.utilserv.presentAlert('Please select any payment method!');
      }
      else if(that.payment_method=='Razorpay'){
        that.doRazorpay();
      }
      else if(that.payment_method=='Paytm'){
        // that.doRazorpay();
      }
      else if(that.payment_method=='Cashfree'){
        that.cashfreepay();
      }

    })
    modal.present();
  }

  async doRazorpay(){
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
        this.apiserv.initiateBuySubscription(this.user_id,this.package_id).subscribe(data => {
          console.log(data);
          loading.dismiss();
          var response = data['response'][0];
          if (response['status'] == 'Valid') {
            this.doOnlinepayment(response['token'],response['price'],response['razorpay_key_id']);
          }else{
            this.utilserv.presentAlert(response['message']);
            // this.sub_plans=[];
          }
        }, (err) => {
          loading.dismiss();
        });
  }


  doOnlinepayment(token,paid_amount,razorpay_key_id) {
    console.log(token);
    console.log(paid_amount);
    console.log(razorpay_key_id);
    let that = this;
    var options = {
      description: 'Rovor',
      image: null,
      currency: that.currency, // your 3 letter currency code
      key: razorpay_key_id, // your Key Id from Razorpay dashboard
      // order_id: this.razorpayOrderId,
      amount: paid_amount * 100, // Payment amount in smallest denomiation e.g. cents for USD
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
      that.do_online_payment_success(token,paid_amount);
    };

    var cancelCallback = function (error) {
      //  alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }

  async do_online_payment_success(token,paid_amount) {
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
    this.apiserv.confirmBuySubscription(token, this.user_id, paid_amount, this.txn_id).subscribe(data => {
      loading.dismiss();
      var response = data['response'][0];
      if (response['status'] == "Valid") {
          this.router.navigate(['subscriptionsuccess']);
      }
      else{
        this.utilserv.presentAlert(response['message']);
      }

    },(err)=>{
      console.log("Network Error");
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
    var inappbrowser = that.iab.create("https://rovor.co.in/webservices/paytm-buy-subscription?plan_id=" + 
    that.package_id + "&user_id=" + that.user_id, '_blank', { location: 'no', zoom: 'yes', hideurlbar: 'yes' });
    var success_url = 'https://rovor.co.in/webservices/paytm-bs-response';
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
        that.modalctrl.dismiss();
        inappbrowser.close();
      } else if (retryAllowed == 'false') {
        that.modalctrl.dismiss();
        inappbrowser.close();
        that.utilserv.presentToast('Payment Failure', 'danger');      
      }
    });
  }

  cashfreepay() {
    this.apiserv.initiateBuySubscriptionCashFree(this.package_id, this.user_id).subscribe(data => {
      var response = data['response'][0];
      console.log(response);
      if (response['status'] == "Valid") {
        this.order_id = response['token'].toString();
        this.online_grand_total = response['price'];
        this.cf_token = response['cftoken'];
        this.cf_appId = response['cashfree_key_id'];
        this.docashfreeOnlinepayment(this.online_grand_total, this.order_id, this.cf_token, this.cf_appId);
      }
    })
  }


  docashfreeOnlinepayment(online_grand_total, order_id, cf_token, cf_appId) {
    let that = this;
    that.online_grand_total=online_grand_total;
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
        var res = JSON.parse(success);
        console.log(JSON.parse(success));
        if (res.txStatus == 'SUCCESS') {
          var paymentOrderId = res.orderId;
          var transaction_id = res.referenceId;
          that.cashfree_do_online_payment_success(paymentOrderId, transaction_id,online_grand_total);
        }
      },
      function (error) {
        //  alert(JSON.stringify(error));          
        //   that.router.navigate(['paymentfailure',{order_id:paymentOrderId}]);
      });
  }



  async cashfree_do_online_payment_success(order_id, txn_id,online_grand_total) {
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
    this.apiserv.confirmBuySubscriptionCashFree(order_id, this.user_id, txn_id,online_grand_total).subscribe(data => {
      loading.dismiss();
      var response = data['response'][0];
      console.log(response);
      //   alert(JSON.stringify(response));
      if (response['status'] == "Valid") {
        this.router.navigate(['subscriptionsuccess']);
      }
      else{
        this.utilserv.presentAlert(response['message']);
      }

    },(err)=>{
      console.log("Network Error");
      loading.dismiss();
    })

  }
}
