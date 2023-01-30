import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-addreview',
  templateUrl: './addreview.page.html',
  styleUrls: ['./addreview.page.scss'],
})
export class AddreviewPage implements OnInit {
  rating:any;
  user_id:any;
  order_id:any;
  description:any;
  constructor(public utilserv:UtilityService,private loadingCtrl:LoadingController,
    private apiserv:ApiService,private activeroute:ActivatedRoute,
    private router:Router) { 
      this.user_id = localStorage.getItem('user_id');
      this.order_id = this.activeroute.snapshot.params['order_id'];
    }

  ngOnInit() {
  }

  setrating(s) {
    this.rating = s;
  }

  async addReview(){
    if (this.rating == "" || this.rating == undefined) {
      this.utilserv.presentAlert('Enter Rating');
      return;
    }
    if (this.description == "" || this.description == undefined) {
      this.utilserv.presentAlert('Enter Review');
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
    this.apiserv.addReview(this.user_id,this.order_id,this.rating,this.description).subscribe(data => {
      var response = data['response'][0];
      //   this.dismissLoading();
      console.log(response);
      loading.dismiss();
      if (response['status'] == 'Valid') {
        // this.utilserv.presentToast(response['message'],'success');
        this.router.navigate(['orderdetail/'+this.order_id]);
      }
    },(err)=>{
      loading.dismiss();
    })
  }

}
