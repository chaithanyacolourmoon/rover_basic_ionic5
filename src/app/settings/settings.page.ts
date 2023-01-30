import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user_id:any;
  refer_data:any;
  constructor(public utilserv:UtilityService,private navctrl: NavController,
    private apiserv:ApiService,private loadingCtrl:LoadingController,
    ) {
    this.user_id = localStorage.getItem('user_id');
   }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    // this.utilserv.updateAppVersion();
  }

  async getRefer() {
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
    this.apiserv.getReferCode(this.user_id).subscribe(data => {
      loading.dismiss();
      var response = data['response'][0];
      //   this.dismissLoading();
      console.log(response);
      if (response['status'] == 'Valid') {
        this.refer_data = response;
        console.log(this.refer_data);
      }
    },(err)=>{
      loading.dismiss();
    })
  }
  updateapp() {
    // this.iab.create(this.utilserv.setting_data.ios_app_link,"_blank","location=no");
    window.open("https://play.google.com/store/apps/details?id=com.rovor", "_system");
  }
  
}