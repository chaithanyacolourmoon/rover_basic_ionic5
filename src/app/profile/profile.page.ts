import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public user_id;
  public name;
  public mobile;
  public email;

  constructor(private apiserv: ApiService,
    public utilserv: UtilityService,private router:Router,
    private loadingCtrl:LoadingController) {
    this.user_id = localStorage.getItem('user_id');
  }

  ngOnInit() {
    this.getProfile();
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

  async profileSubmit(profileform) {
    // this.formSubmitted = true;
    //  let profileform = this.profileform.value;
    var name_reg=/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
    if (profileform.name == "" || profileform.name == undefined) {
      this.utilserv.presentAlert('Enter Name');
      return;
    }
    // if ((profileform.name as string).indexOf(' ') >= 0) {
    //   this.utilserv.presentAlert('Space not allowed in name');
    //   return
    // }
    if(name_reg.test(profileform.name) == false){
      this.utilserv.presentToast('Name Only Accept Characters', 'danger');
      return;
    }
    if (profileform.mobile == "" || profileform.mobile == undefined) {
      profileform.mobile=this.mobile;
      // this.utilserv.presentAlert('Enter mobile number');
      // return;
    }
    if (profileform.mobile.toString().length != 10) {
      this.utilserv.presentAlert('Enter 10 digit valid mobile number');
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
    this.apiserv.updateProfile(this.user_id, profileform.name, profileform.mobile).subscribe(data => {
      console.log(data);
      loading.dismiss();
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        // this.utilserv.presentAlert(response['message']);
        this.router.navigate(['home']);
      }

    },(err)=>{
      loading.dismiss();
    })

  }
}

