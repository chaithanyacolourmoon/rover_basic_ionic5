import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { UtilityService } from '../services/utility.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ApiService } from '../services/api.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.page.html',
  styleUrls: ['./refer.page.scss'],
})
export class ReferPage implements OnInit {
  refer_code:any;
  user_id:any;
  refer_data:any;
  text: string='Flamenco'
  imgurl:string= 'https://cdn.pixabay.com/photo/2019/12/26/05/10/pink-4719682_960_720.jpg'
  link: string='https://link.medium.com/JA4amAHFJ5'
  constructor(public utilserv:UtilityService,private loadingCtrl:LoadingController,
    private clipboard:Clipboard,private apiserv:ApiService,private socialSharing:SocialSharing) {
      this.user_id = localStorage.getItem('user_id');
     }

  ngOnInit() {
    this.getRefer();
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
      var response = data['response'][0];
      //   this.dismissLoading();
      console.log(response);
      loading.dismiss();
      if (response['status'] == 'Valid') {
        this.refer_data = response;
        console.log(this.refer_data);
      }
    },(err)=>{
      loading.dismiss();
    })
  }

  async copyString(data){
    // alert(data);
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
    this.clipboard.copy(data);
    this.utilserv.presentAlert("Copied!");
    // this.CopyInputText=true;
    loading.dismiss();
  }


  async shareWhatsapp() {
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
      let text ="Use my referral code "+this.refer_data.referral_code+" while registering and enjoy your shopping. You can download our app from playstore or use this link to download the app. Thank you !";
      console.log(text);
      let ur = 'https://rovor.co.in/admin/img/logo.png';
      let url="Click Here"+" "+"https://play.google.com/store/apps/details?id=com.rovor";
      this.socialSharing.share(text, '', ur, url).then(() => {
        // Success!
        loading.dismiss();
      }).catch(() => {
        // Error!
        //alert("Share failed");
        loading.dismiss();
      });
   
  }

  // async shareWhatsapp() {
    
  //   var shareText="You can download our app from playstore or use this link to download the app. And you can get the refer amount in your wallet on first successful order, Thank you !";
  //   var dataUrl='https://klhaskaa.com/admin/img/logo.png';
  //   var sharingUrl= 'https://play.google.com/store/apps/details?id=com.rovor';
  //   this.socialSharing.share(shareText, dataUrl, sharingUrl).then((res) => {
  //     console.log('image shared with whatsapp');
  //   }).catch((e) => {
  //     console.error('social share, something went wrong!', e);
  //   });
   
  // }

  // async shareFacebook() {
  //   var shareText="You can download our app from playstore or use this link to download the app. And you can share awesome coupons with your loved once, Thank you !";
  //   var sharingImage='https://klhaskaa.com/admin/img/logo.png';
  //   var sharingUrl= 'https://play.google.com/store/apps/details?id=com.rovor';
  //   this.socialSharing.shareViaFacebook(shareText,sharingImage,sharingUrl)
  //   .then((res) => {
  //     console.log("share via facebook possible");
  //   })
  //   .catch((e) => {
  //     console.log('error', e);
  //   });
  // }

  // shareViaEmail() {
  //   var sharingImage=['https://klhaskaa.com/admin/img/logo.png'];
  //   this.socialSharing.canShareViaEmail().then((res) => {
  //     this.socialSharing.shareViaEmail("test", "test Subject", ["rubi@colourmoon.com"], null, null, sharingImage).then(() => {
  //       // this.modal.dismiss();
  //     })
  //   }).catch((e) => {
  //     // Error!
  //   });
  // }

}
