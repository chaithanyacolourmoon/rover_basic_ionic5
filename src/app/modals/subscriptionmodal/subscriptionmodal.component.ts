import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
declare var RazorpayCheckout: any;
@Component({
  selector: 'app-subscriptionmodal',
  templateUrl: './subscriptionmodal.component.html',
  styleUrls: ['./subscriptionmodal.component.scss'],
})
export class SubscriptionmodalComponent implements OnInit {
  package_id:any;
  sub_plans:any=[];
  user_id:any;
  currency: string = 'INR';
  name:any;
  mobile:any;
  email:any;
  txn_id = '';
  constructor(private modalctrl: ModalController,public utilserv:UtilityService,
    private router:Router,private loadingCtrl:LoadingController,private apiserv:ApiService) {
      this.user_id=localStorage.getItem('user_id');
     }

  ngOnInit() { 
  }

  ionViewWillEnter(){
    this.getProfile();
    this.getSubscriptionPlans();
  }

  modalHeadClose(){
    this.modalctrl.dismiss(
      { 'action': 'close'}
    );
  }

  goTerms(){
    this.modalctrl.dismiss();
    this.router.navigate(['terms']);
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
          // this.package_id=this.sub_plans[0].plan_id;
       }else{
         this.sub_plans=[];
       }
     }, (err) => {
       loading.dismiss();
     });
 }

  subChange(event){
  console.log(event.detail.value);
  this.package_id=event.detail.value;
 }

 async modalClose() {
  if (this.package_id == "" || this.package_id == undefined) {
    this.utilserv.presentAlert('Select Package');
    return;
  }else{
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
          this.modalctrl.dismiss(
            { 'action': 'close' }
          );
          this.utilserv.presentAlert(response['message']);
          // this.sub_plans=[];
        }
      }, (err) => {
        loading.dismiss();
      });
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
      color: '#2bba46'
    },
    modal: {
      ondismiss: function () {
      }
    }
  };

  var successCallback = function (payment_id) {
    // alert('payment_id: ' + payment_id);
    that.txn_id = payment_id;
    that.do_online_payment_success(token,paid_amount);
  };

  var cancelCallback = function (error) {
    //  alert(error.description + ' (Error ' + error.code + ')');
  };

  RazorpayCheckout.open(options, successCallback, cancelCallback);
}

do_online_payment_success(token,paid_amount) {
  this.apiserv.confirmBuySubscription(token, this.user_id, paid_amount, this.txn_id).subscribe(data => {
    var response = data['response'][0];
    if (response['status'] == "Valid") {
      this.modalctrl.dismiss();
      this.router.navigate(['subscriptionsuccess']);
    }
    else{
      this.utilserv.presentAlert(response['message']);
    }

  },(err)=>{
    console.log("Network Error");
  })
}

}
