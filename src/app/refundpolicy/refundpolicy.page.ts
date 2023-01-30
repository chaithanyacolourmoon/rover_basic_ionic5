import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-refundpolicy',
  templateUrl: './refundpolicy.page.html',
  styleUrls: ['./refundpolicy.page.scss'],
})
export class RefundpolicyPage implements OnInit {
  description:any;
  constructor(private apiserv:ApiService,public utilserv:UtilityService,
    private loadingCtrl:LoadingController) { }

  ngOnInit() {
    this.refundContect();
  }
  
  async refundContect() {
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
    this.apiserv.getRefund().subscribe(data => {
      console.log(data);
      loading.dismiss();
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.description = response['description'];
      }
    }),(err)=>{
      loading.dismiss();
    }
  }

}
