import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';
import { ModalController } from '@ionic/angular';
import { ForgotpasswordComponent } from '../modals/forgotpassword/forgotpassword.component';
import { EventsService } from '../services/events.service';
import { Router } from '@angular/router';
import { OtpComponent } from '../modals/otp/otp.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  token: any;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';
  public is_logged_in: boolean = false;
  data:any={};
  constructor(private apiserv: ApiService,
    public utilserv: UtilityService,
    private navctrl: NavController,
    private modalctrl: ModalController,
    private events: EventsService,
    private router: Router,
    private loadingCtrl:LoadingController,
    private menuCtrl:MenuController
  ) {

  }

  ionViewWillEnter(){
    this.menuCtrl.enable(false);
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }

  skipClick(){
    this.router.navigate(['home']);
  }
    


  async onClickSubmit(loginform) {
    console.log(loginform);
    var device_id=localStorage.getItem('fcm_token');
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (loginform.mobile == "" || loginform.mobile == undefined) {
      this.utilserv.presentAlert('Enter Mobile Number');
      return;
    } else if (loginform.password == "" || loginform.password == undefined) {
      this.utilserv.presentAlert('Enter Password');
      return;
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
    // alert(device_id);
    console.log(device_id);
    this.apiserv.dologin(
      loginform.mobile,
      loginform.password,
      device_id).subscribe(function (data) {
        console.log(data);
        loading.dismiss();
        var response = data['response'][0];
        that.token = response['token'];
        localStorage.setItem('token', that.token);
        if (response['status'] == 'Valid') {
          //localStorage.setItem('mobile', loginform.mobile);
          localStorage.setItem('user_id', response['uid']);
          localStorage.setItem('name', response['name']);
          localStorage.setItem('mobile', loginform.mobile);
          localStorage.setItem('is_logged_in', 'true');
          this.is_logged_in = true;
          that.events.publishSettingsData({
            name: response['name'],
            mobile: loginform.mobile,
            is_logged_in: this.is_logged_in
          });
          // that.utilserv.presentToast(response['message'], 'success');
          setTimeout(() => {
            loginform.mobile='';
            loginform.password='';
            that.utilserv.getWallet();
            that.updateCity();
            that.router.navigate(['home']);
            // that.navctrl.navigateForward('/home');
          }, 1000);
        }
        else if (response['message'] == 'Invalid Username Or Password'){
          // alert("Coming");
          that.utilserv.presentAlert(response['message']);
        }
        else if (response['status'] == 'Invalid' && response['token'] != '') {
          // that.utilserv.presentToast(response['message'], 'danger');
          localStorage.setItem('mobile', loginform.mobile);
          that.Otpmodal(loginform.mobile);
          // that.router.navigate(['otp']);
        }
        
      })
  }
  ngOnInit() {
  }

  registerClick(){
      this.data.mobile='';
      this.data.password='';
      this.router.navigate(['register']);
      
  }

  async forgotmodal() {
    const modal = await this.modalctrl.create({
      component: ForgotpasswordComponent,
    });
    return await modal.present();
  }

  
  async Otpmodal(mobile) {
    const modal = await this.modalctrl.create({
      component: OtpComponent,
      componentProps:{
        'mobile_number':mobile,
      }
    });
    return await modal.present();
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

