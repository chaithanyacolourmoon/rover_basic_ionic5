import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import { OtpverifyComponent } from '../otpverify/otpverify.component';


@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  mobile: any;
  token: any;
  fullOtpCode:any;
  @Input() mobile_number:any;

  constructor(private apiserv: ApiService,
    private router: Router,
    private modalctrl: ModalController,
    private navctrl: NavController,private loadingCtrl:LoadingController,
    public utilserv: UtilityService) {
    this.token = localStorage.getItem('token');
    this.mobile = localStorage.getItem('mobile');
  }

  ngOnInit() { }
  gotonext(nextElement) {
    nextElement.setFocus();
  }

  onOtpChange(event) {
    console.log(event);
    this.fullOtpCode = event;
  }

  async otpSubmit(otpform) {
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
    let that = this;
    this.apiserv.dootp(this.token, this.fullOtpCode).subscribe(data => {
      console.log(data);
      loading.dismiss();
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        // that.utilserv.presentToast(response['message'], 'success');
        setTimeout(() => {
          that.OtpVerifymodal(response['message'],response['user_id']);
          that.modalClose();
          // that.modalClose();
          // that.navctrl.navigateForward('/login');
        }, 1000);
      } else {
        if(this.fullOtpCode == "" || this.fullOtpCode == undefined){
          this.utilserv.presentAlert("Please Enter OTP");
        }else{
          this.utilserv.presentAlert(response['message']);
        }
      
      }
    },(err)=>{
      loading.dismiss();
    })
  }

  async resendOtp() {
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
    //this.utilserv.show_uploading_loader();
    this.apiserv.resendOtp(this.token).subscribe(data => {
      loading.dismiss();
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.utilserv.presentAlert(response['message']);
        //  this.router.navigate(['home']);
      } else {
        // that.utilserv.dismissLoading();
        this.utilserv.presentAlert(response['message']);
      }
    },(err)=>{
      loading.dismiss();
    })
  }
  modalClose() {
    this.modalctrl.dismiss();
  }

  async OtpVerifymodal(message,user_id) {
    const modal = await this.modalctrl.create({
      component: OtpverifyComponent,
      componentProps: {
        'message': message,
        'user_id': user_id
      }
    });
    return await modal.present();
  }
}
