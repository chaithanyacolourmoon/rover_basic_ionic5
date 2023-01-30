import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
})
export class ForgotpasswordComponent implements OnInit {

  constructor(private modalCtrl: ModalController,
    private apiserv: ApiService,
    public utilserv: UtilityService,
    private navctrl: NavController,private loadingCtrl:LoadingController) {

  }
  async forgotSubmit(forgotForm) {
    if (forgotForm.mobile == "" || forgotForm.mobile == undefined) {
      this.utilserv.presentAlert('Enter Mobile Number');
      return;
    }

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
    this.apiserv.doforgot_password(forgotForm.mobile).subscribe(function (data) {
      console.log(data);
      loading.dismiss();
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        that.utilserv.presentAlert(response['message']);
        that.modalClose();
        setTimeout(() => {
          that.navctrl.navigateForward('/login');
        }, 1000);
      } else {
        that.utilserv.presentAlert(response['message']);
      }
    },(err)=>{
      loading.dismiss();
    })
  }
  ngOnInit() {
  }

  modalClose() {
    this.modalCtrl.dismiss();
  }
}
