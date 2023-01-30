import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {
  public user_id = null;
  constructor(public utilserv: UtilityService,
    private apiserv: ApiService,private router:Router,
    private navctrl: NavController,private loadingCtrl:LoadingController) { }

  ngOnInit() {
    this.user_id = localStorage.getItem('user_id');
  }
  async passwordSubmit(passwordForm) {
    console.log(passwordForm);
    if (passwordForm.old_password == "" || passwordForm.old_password == "undefined") {
      this.utilserv.presentAlert('Enter Current Password');
      return;
    }
    if (passwordForm.password == "" || passwordForm.password == "undefined") {
      this.utilserv.presentAlert('Enter New Password');
      return;
    }
    if (passwordForm.password.toString().length < 8) {
      this.utilserv.presentAlert('Please enter minimum 8 letters');
      return;
    }
    if ((passwordForm.password as string).indexOf(' ') >= 0) {
      this.utilserv.presentAlert('Space not allowed in password');
      return
    }
    if (passwordForm.cpassword == "" || passwordForm.cpassword == "undefined") {
      this.utilserv.presentAlert('Enter Confirm Password');
      return;
    }
    if (passwordForm.password != passwordForm.cpassword) {
      this.utilserv.presentAlert('Password does not match');
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
    this.apiserv.dochangepassword(
      passwordForm.old_password,
      passwordForm.password,
      this.user_id).subscribe(data => {
        loading.dismiss();
        var response = data['response'][0];
        if (response['status'] == 'Valid') {
          // that.utilserv.presentToast(response['message'], 'success');
          this.router.navigate(['home']);
          // setTimeout(() => {
          //   that.navctrl.navigateForward('/login');
          // }, 1000);

        } else {
          that.utilserv.presentAlert(response['message']);
        }
      },(err)=>{
        loading.dismiss();
      })
  }
}
