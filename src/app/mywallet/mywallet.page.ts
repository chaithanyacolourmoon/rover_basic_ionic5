import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-mywallet',
  templateUrl: './mywallet.page.html',
  styleUrls: ['./mywallet.page.scss'],
})
export class MywalletPage implements OnInit {
  walletAmount:any;
  wallet_transcation:any;
  constructor(public utilserv:UtilityService,private apiserv:ApiService,private loadingCtrl:LoadingController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getWallet();
    this.utilserv.getWallet();
  }

  async getWallet(){
    this.wallet_transcation=[];
    var user_id=localStorage.getItem('user_id');
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
    this.apiserv.getWalletAmount(user_id).subscribe(data => {
      var response = data['response'][0];
      //   this.dismissLoading();
      console.log(response);
      loading.dismiss();
      if (response['status'] == 'Valid') {
        this.walletAmount = response['wallet_balance'];
        if(response['transactions']==null){
          this.wallet_transcation=[];
        }else{
          this.wallet_transcation = response['transactions'];
        }
       
        
      }
    },(err)=>{
      loading.dismiss();
    })
  }

}
