import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-addressbook',
  templateUrl: './addressbook.page.html',
  styleUrls: ['./addressbook.page.scss'],
})
export class AddressbookPage implements OnInit {
  addresslist: any = [];
  public sid;
  public address_id: any;
  public selected_address_id = null;
  user_id: any;
  cityId: any;
  no_icon:any;
  no_message:any;
  constructor(private apiserv: ApiService,
    private navctrl: NavController,private loadingCtrl:LoadingController,
    private router:Router,
    public utilserv: UtilityService) {
    this.user_id = localStorage.getItem('user_id');
    this.sid = localStorage.getItem('sid');
    this.cityId = localStorage.getItem('city_id');
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.Address_book();
  }

  async Address_book() {
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
    this.apiserv.addressbook(this.user_id).subscribe(data => {
      loading.dismiss();
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
        this.addresslist = response['address'];
      }
      else{
        this.addresslist='';
      }
    },(err)=>{
      loading.dismiss();
    });
  }
  removeAddress(remove_address_id) {
    this.apiserv.deleteaddress(this.user_id, remove_address_id).subscribe(server_response => {
      var data = server_response['response'][0];
      if (data['status'] == 'Valid') {
        // this.utilserv.presentToast(data['message'], 'success');
        this.Address_book();
      }
    })
  }
  gotoeditaddress(a){
    // alert("Coming");
     this.router.navigate(['/editaddress', {address_id:a.id,name:a.name,address:a.address,city:a.city,pincode:a.pincode,location:a.location,landmark:a.landmark,mobile:a.mobile,address_type:a.address_type}]);
  }
}
