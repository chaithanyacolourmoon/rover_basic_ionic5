import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-couponlist',
  templateUrl: './couponlist.component.html',
  styleUrls: ['./couponlist.component.scss'],
})
export class CouponlistComponent implements OnInit {
  couponList:any=[];
  @Input() selected_coupon:any;
  coupon_select:any;
  constructor(private loadingController:LoadingController,private api:ApiService,
    public utilserv:UtilityService,private modalctrl:ModalController) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.getCouponList();
    if(this.selected_coupon){
      this.coupon_select=this.selected_coupon;
    }
  }

  async getCouponList() {
    let loading = await this.loadingController.create({
      
      showBackdrop:false,
           
      cssClass:'sacustom-cls',     
             
      message:`
           
      <div class="custom-spinner-container">
             
      <img class="loading" width="40px" height="40px" 
      src="assets/images/cmoon.gif" />
           
      </div>`
         
      });
      loading.present();
    this.api.getCouponList().subscribe(data => {
      var response = data['response'][0];
      console.log(response);
      loading.dismiss();
      if (response['status'] == 'Valid') {
        this.couponList=response['coupons'];
      }
      else {
        this.utilserv.presentToast("No Coupons", 'danger');
      }
    })
    
  }

  modalClose(filter) {
    this.coupon_select=filter;
    this.modalctrl.dismiss(
      { 'action': 'close', 'selected_coupon': this.coupon_select }
    );
  }

  dismiss(){
    this.modalctrl.dismiss(
      { 'action': 'dismiss'  }
    );
    
  }

  modalHeadClose(){
    this.modalctrl.dismiss(
      { 'action': 'modal_close' }
    );
  }

}
