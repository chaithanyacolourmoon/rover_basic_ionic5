import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-trackorder',
  templateUrl: './trackorder.page.html',
  styleUrls: ['./trackorder.page.scss'],
})
export class TrackorderPage implements OnInit {

  order_id:any;
  track_data:any;
  details:boolean=true;
  constructor(private activeroute:ActivatedRoute,private loadingCtrl:LoadingController,
    private apiserv:ApiService,private changeDet:ChangeDetectorRef) {
    this.order_id = this.activeroute.snapshot.params['order_id'];
    // 
   }

  ngOnInit() {
    
  }

  changeDetail(){
    this.details= !this.details;
  }

  ionViewWillEnter(){
    this.viewTrackDetails();
  }

  doSubmit(id){
    console.log(id);
    this.order_id=id;
    this.viewTrackDetails();
  }

  async viewTrackDetails() {
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
    this.apiserv.trackOrder(this.order_id).subscribe(data => {
      console.log(data);
      loading.dismiss();
      this.track_data = data['response'][0];
    },(err)=>{
      loading.dismiss();
    })
  }



}
