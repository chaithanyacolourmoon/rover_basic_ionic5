import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.page.html',
  styleUrls: ['./myorders.page.scss'],
})
export class MyordersPage implements OnInit {
  // public current_segment_name: string = 'Ongoing';
  public active_tab: any = 'Ongoing';
  public product;
  public user_id;
  ongoinglists: any;
  compltemessage: any;
  completedlists: any;
  ongoingmessage: any;
  ongoing_list:any=[];
  completed_list:any=[];
  cancelled_list:any=[];

  constructor(private apiserv: ApiService,
    public utilserv: UtilityService,
    private loadingCtrl: LoadingController,
    private navctrl: NavController) {
    this.product = 'on going';
    this.user_id = localStorage.getItem('user_id');
    console.log(this.active_tab)
  }
  segmentChanged(event) {
    console.log(event.target.value);
    this.active_tab = event.target.value;
  }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.orderhistorylistongoing();
  }

  async orderhistorylistongoing() {
    var type = 'on going';
    this.ongoing_list=[];
    this.completed_list=[];
    this.cancelled_list=[];
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
    this.apiserv.orderhistory(this.user_id).subscribe(data => {
      var response = data['response'][0];
      console.log(response);
      loading.dismiss();
      if (response['status'] == 'Valid') {
        if(response['orders']){
          this.ongoinglists = response['orders'];
          for(var i=0;i<this.ongoinglists.length;i++){
            if(this.ongoinglists[i].order_status!='Delivered' && this.ongoinglists[i].order_status!='Cancelled'){
              this.ongoing_list.push(this.ongoinglists[i]);
            }
            if(this.ongoinglists[i].order_status=='Delivered' && this.ongoinglists[i].payment_status=='Paid'){
              this.completed_list.push(this.ongoinglists[i]);
            }
            if(this.ongoinglists[i].order_status=='Cancelled'){
              this.cancelled_list.push(this.ongoinglists[i]);
            }
          }

          console.log(this.ongoing_list);
         
        }
        else{
          this.ongoinglists=[];
        }
        

      } else {
        this.ongoingmessage = response['message'];

      }
    },(err)=>{
      loading.dismiss();
    })
  }

}
