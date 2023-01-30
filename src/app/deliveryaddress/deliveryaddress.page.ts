import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-deliveryaddress',
  templateUrl: './deliveryaddress.page.html',
  styleUrls: ['./deliveryaddress.page.scss'],
})
export class DeliveryaddressPage implements OnInit {

  public radiocheck;
  public activeclas;
  cities: any = [];
  locations: any = [];
  areaId: any;
  cityId: any;
  user_id: any;
  addresslist: any;
  totalamount: any;
  public sid;
  public address_id: any;
  cart_count:any;
  no_icon:any;
  no_message:any;
  select_date:any;
  public selected_address_id = null;
  wallet_check:any;
  constructor(private apiserv: ApiService,
    private navctrl: NavController,
    private actroute: ActivatedRoute,
    private route: Router,private loadingCtrl:LoadingController,
    public utilserv: UtilityService,private alertController:AlertController) {
    this.user_id = localStorage.getItem('user_id');
    this.sid = localStorage.getItem('sid');
    // this.cityId = localStorage.getItem('city_id');
    this.totalamount = this.actroute.snapshot.paramMap.get('totalamount');
    this.select_date = this.actroute.snapshot.paramMap.get('date');
    this.wallet_check = this.actroute.snapshot.paramMap.get('walletCheck');
  }


  ngOnInit() {
   this.cartcount();
  }

  ionViewWillEnter() {
    // this.totalamount = this.actroute.snapshot.paramMap.get('totalamount');
    this.Address_book();
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

  Address_book() {
    this.apiserv.addressbook(this.user_id).subscribe(data => {
      var response = data['response'][0];
      console.log(response);
      //  this.utilserv.dismissLoading();  
      if(response['icon']){
        this.no_icon=response['icon'];
      }
      if(response['message']){
        this.no_message=response['message'];
      }
      if (response['status'] == 'Valid') {
        if(response['address']){
          this.addresslist = response['address'];
        }
        else{
          this.addresslist=[];
        }
        
      }
      else{
        this.addresslist=[];
      }
    });
  }

  addAddress(){
      this.route.navigate(['addaddress',{walletCheck:this.wallet_check}]);
    
  }

  Delivery_address() {
    if (this.selected_address_id == null) {
      this.utilserv.presentAlert("Please Select Address");
      return;
    }
    for(var i=0;i<this.addresslist.length;i++){
      if(this.selected_address_id==this.addresslist[i].id){
        this.cityId=this.addresslist[i].city;
      }
    }
    this.apiserv.deliverytothisaddress(this.user_id, this.sid, this.selected_address_id, this.cityId).subscribe(data => {
      var response = data['response'][0];

      if (response['status'] == 'Valid') {
        // setTimeout(() => {
        //   this.utilserv.presentToast(response['message'], 'success');
        // }, 1000);
        if(this.select_date){
          setTimeout(() => {
            this.route.navigate(['paymentoption', { totalamount: this.totalamount,walletCheck:this.wallet_check }]);
            //  this.navctrl.navigateForward('/paymentoption');
          }, 1000);
        }
        else{
          if(this.utilserv.setting_data.delivery_slots=='Yes' ){
            setTimeout(() => {
              this.route.navigate(['deliveryslots', { totalamount: this.totalamount,walletCheck:this.wallet_check}]);
              // this.navctrl.navigateForward('/deliveryslots');
            }, 1000);
          }
          else{
            this.apiserv.updatedeliveryslots(this.sid, '', '').subscribe(data => {
              console.log(data);
              var response = data['response'][0];
              if (response['status'] == 'Valid') {
                // this.utilserv.presentAlert(response['message']);
                if(this.totalamount==0){
                  this.do_payment_success('Wallet');
                }else{
                  setTimeout(() => {
                    this.route.navigate(['paymentoption', { totalamount: this.totalamount,walletCheck:this.wallet_check }]);
                    //  this.navctrl.navigateForward('/paymentoption');
                  }, 1000);
                }
                
              }
            })
            // setTimeout(() => {
            //   this.route.navigate(['paymentoption', { totalamount: this.totalamount,walletCheck:this.wallet_check }]);
            //   //  this.navctrl.navigateForward('/paymentoption');
            // }, 1000);
          }
        }
       
        
      }
      else{
        this.utilserv.presentAlert("Not able to deliver this address!");
      }
    })
  }

  removeAddress(remove_address_id) {
    this.apiserv.deleteaddress(this.user_id, remove_address_id).subscribe(server_response => {
      var data = server_response['response'][0];
      if (data['status'] == 'Valid') {
        this.utilserv.presentAlert(data['message']);
        // this.utilserv.presentToast(data['message'], 'success');
        this.Address_book();
      }
    })
  }

  select_address(address_id) {
    console.log(address_id);
    this.selected_address_id = address_id;
  }

  radioGroupChange(event) {
    console.log(event);
    this.selected_address_id = event.target.value;
  }

  async do_payment_success(payment_type) {
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
    this.apiserv.confirmorder(this.sid, this.user_id, payment_type).subscribe(data => {
      var response = data['response'][0];
      loading.dismiss();
      if (response['status'] == 'Valid') {
        // that.utilserv.presentAlert('Cash Payment request submitted successfully');
        that.route.navigate(['paymentsuccess',{order_id:response['order_id']}]);
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
  
}
