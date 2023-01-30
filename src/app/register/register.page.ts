import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';
import { ModalController } from '@ionic/angular';
import { OtpComponent } from '../modals/otp/otp.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email_sub: any;
  email_sub1: any;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';
  constructor(private modalctrl: ModalController,
    private apiserv: ApiService,
    public utilserv: UtilityService,
    private router: Router,
    private menuCtrl:MenuController,
    private navctrl: NavController,private loadingCtrl:LoadingController) {

    this.email_sub = false;
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.menuCtrl.enable(false);
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }

  checkTerm(email_sub) {
    console.log(email_sub);
    if (email_sub == 'No') {
      this.email_sub = 'Yes';
    }
    else if (email_sub = 'Yes') {
      this.email_sub == 'No';
    }
  }

  async registerSubmit(registerForm) {
    var device_id=localStorage.getItem('fcm_token');
    if (this.email_sub == true) {
      this.email_sub1 = 'Yes';
    }
    else if (this.email_sub == false) {
      this.email_sub1 = 'No';
    }
   // alert(this.email_sub1);
    // this.Otpmodal();
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var name_reg=/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
    var pattern = /^[0-9]*$/;
    var no_pattern=/^[5-9][0-9]{9}$/;
    if (registerForm.name == "" || registerForm.name == undefined) {
      this.utilserv.presentAlert('Enter Name');
      return;
    }
    if(name_reg.test(registerForm.name) == false){
      this.utilserv.presentAlert('Name Only Accept Characters');
      return;
    }
    // if ((registerForm.name as string).indexOf(' ') >= 0) {
    //   this.utilserv.presentToast('Space not allowed in name', 'danger');
    //   return;
    // }
    if (registerForm.email == "" || registerForm.email == undefined) {
      this.utilserv.presentAlert('Enter valid Email Id');
      return;
    }
    if (reg.test(registerForm.email) == false) {
      this.utilserv.presentAlert('Enter valid Email address');
      return;
    }
    if (registerForm.mobile == "" || registerForm.mobile == undefined) {
      this.utilserv.presentAlert('Enter mobile number');
      return;
    }
    if (pattern.test(registerForm.mobile) == false) {
      this.utilserv.presentAlert('Enter valid mobile number');
      return;
    }
    if (no_pattern.test(registerForm.mobile) == false) {
      this.utilserv.presentAlert('Enter valid mobile number');
      return;
    }
    if (registerForm.mobile.toString().length != 10) {
      this.utilserv.presentAlert('Enter 10 digit valid mobile number');
      return;
    }
    
    if (registerForm.password == "" || registerForm.password == undefined) {
      this.utilserv.presentAlert('Enter password');
      return;
    }
    if (registerForm.password.toString().length < 8) {
      this.utilserv.presentAlert('Please enter minimum 8 letters');
      return;
    }
    if ((registerForm.password as string).indexOf(' ') >= 0) {
      this.utilserv.presentAlert('Space not allowed in password');
      return
    }
    if (registerForm.referral_code == "" || registerForm.referral_code == undefined) {
      registerForm.referral_code='';
    }
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
    this.apiserv.doregister(
      registerForm.name,
      registerForm.mobile,
      registerForm.email,
      registerForm.password,
      this.email_sub1,
      device_id,
      registerForm.referral_code).subscribe(function (data) {
      console.log(data);
      loading.dismiss();
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        localStorage.setItem('mobile', registerForm.mobile);
        localStorage.setItem('token', response['token']);
        that.updateCity();
        // that.utilserv.presentToast(response['message'], 'success');
        setTimeout(() => {
          that.Otpmodal(registerForm.mobile);
        }, 1500);
      } else {
        that.utilserv.presentAlert(response['message']);
      }
    },(err)=>{
      loading.dismiss();
    })
  }

  async Otpmodal(mobile) {
    const modal = await this.modalctrl.create({
      component: OtpComponent,
      componentProps:{
        'mobile_number':mobile
      }
    });
    return await modal.present();
  }

  skipClick(){
    this.router.navigate(['home']);
  }

  updateCity(){
    var user_id=localStorage.getItem('user_id');
    var city_id=localStorage.getItem('city_id');
    if(user_id){
      this.apiserv.UpdateCity(user_id,city_id).subscribe(data => {
        console.log(data);
      }, (err) => {
      });
    }
    
  }
}
