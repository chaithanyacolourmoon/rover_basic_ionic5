import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-deliveryslots',
  templateUrl: './deliveryslots.page.html',
  styleUrls: ['./deliveryslots.page.scss'],
})
export class DeliveryslotsPage implements OnInit {

  date: any;
  user_id: any;
  slots: any = [];
  slot: any;
  sid: any;
  totalamount: any;
  //maxDate: string;
  minDate: any;
 // minDate: string = new Date().toISOString();
  todaydate:any;
  dateData:any=[];
  // maxDate: string ='2090-12-30';
  slidesOptsHeader = {
    // autoplay: true,
    speed: 400,
    spaceBetween: 8,
    slidesPerView: 4.2,
    pager: false,
  };
  address:any;
  wallet_check:any;
  city_id:any;
  constructor(private apiserv: ApiService,
    public utilserv: UtilityService,
    private actroute: ActivatedRoute,
    private route: Router,
    private navctrl: NavController, public datepipe: DatePipe,private loadingCtrl:LoadingController) {
    this.user_id = localStorage.getItem('user_id');
    this.totalamount = this.actroute.snapshot.paramMap.get('totalamount');
    this.address = this.actroute.snapshot.paramMap.get('address');
    this.wallet_check = this.actroute.snapshot.paramMap.get('walletCheck');
    this.city_id = localStorage.getItem('city_id');  
  }

  ngOnInit() {
    this.sid = localStorage.getItem('sid');
    var dtToday = new Date();
    for(var i=1;i<=7;i++){
      var test = dtToday.toISOString().substring(0, 10);
      const dayIndex = dtToday.getDay();
      const getDayName = (dayIndex) =>{
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[dayIndex];
      }
      const dayName = getDayName(dayIndex);
      var month = dtToday.getMonth() + 1;
      var select_month;
      var select_day; 
      if(month<10){
         select_month= '0'+month;
      } 
      else{
         select_month=month;
      }
      var day = dtToday.getDate();
      if(day<10){
        select_day= '0'+day;
      } 
      else{
        select_day=day;
      }
      var year = dtToday.getFullYear();
      console.log(year , month, day);
      var select_date = select_day + '-' +select_month + '-' + year;
      this.dateData.push({"date": test,"day": dayName,"show_date":select_date});
      dtToday.setDate(dtToday.getDate() + 1);
    }
    this.date=this.dateData[0].show_date;
    this.getdeliveryslots();
    // console.log(this.dateData);
    // for(var j=0;j<2;j++){
    //   if(j==0){

    //     this.dateData[0].push({"set_day":"Today"});
    //   }
    //   if(j==1){
    //     this.dateData[1].push({"set_day":"Tomorrow"});
    //   }
    // }
    // dtToday.setDate(dtToday.getDate() + 4);
    // console.log(dtToday);
    // this.minDate = dtToday.toISOString().substring(0, 10);
    // console.log(this.minDate);


//     var select_month;
//     var select_day;
//     var month = dtToday.getMonth() + 1; 
//     if(month<10){
//        select_month= '0'+month;
//     } 
//     else{
//        select_month=month;
//     }   // getMonth() is zero-based
//     var day = dtToday.getDate();
//     if(day<10){
//       select_day= '0'+day;
//     } 
//     else{
//       select_day=day;
//     }
//     var year = dtToday.getFullYear();
//     console.log(year , month, day);
//     this.date = year + '-' +select_month + '-' + select_day;
//  console.log(this.date);

  }


  gettodayDate(e) {
    console.log(e.detail.value);
    this.date = new Date(e.detail.value).toISOString().substring(0, 10);
  //  this.date = this.datepipe.transform(this.date, 'dd-MM-yyyy');
  // .toISOString().substring(0, 10)
    console.log(this.date);
  //  console.log(this.date);
    this.getdeliveryslots();
  }

  dateClick(date){
    this.date=date;
    this.slot='';
    this.getdeliveryslots();
  }

  getdeliveryslots() {
    
    this.apiserv.deliveryslots(this.date,this.city_id).subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      if(response['status']=="Valid"){
        if(response['slots']){
          this.slots = response['slots'];
        }
        else{
          this.slots =[];
        }
        
      }
      else{
        this.slots=[];
      }
      
      console.log(this.slots);
    })
  }

  selectslot(event) {
    this.slot = event.target.value;
    console.log(this.slot);
  }

  updatedelivery() {
    console.log(this.date);
    console.log(this.slot);
    
      if (this.date == '' || this.date == null) {
        this.utilserv.presentAlert('Please select delivery date');
        return;
      } if (this.slot == '' || this.slot == null) {
        this.utilserv.presentAlert('Please select delivery slot');
        return;
      }
      if(this.address=="not_select"){
        this.apiserv.updatedeliveryslots(this.sid, this.date, this.slot).subscribe(data => {
          console.log(data);
          var response = data['response'][0];
          if (response['status'] == 'Valid') {
            // this.utilserv.presentAlert(response['message']);
            setTimeout(() => {
              this.route.navigate(['deliveryaddress', { totalamount: this.totalamount,date:this.date,time:this.slot,walletCheck:this.wallet_check }]);
              //  this.navctrl.navigateForward('/paymentoption');
            }, 1000);
          }
        })
      }else {
        this.apiserv.updatedeliveryslots(this.sid, this.date, this.slot).subscribe(data => {
          console.log(data);
          var response = data['response'][0];
          if (response['status'] == 'Valid') {
            // this.utilserv.presentAlert(response['message']);
            if(this.totalamount==0){
              this.do_payment_success('Wallet');
            }else{
              setTimeout(() => {
                this.route.navigate(['paymentoption', { totalamount: this.totalamount,walletCheck:this.wallet_check }]);
                //  this.navctrl.navigateForward('/paymentoption');
              }, 1000);
            }
            
          }
        })
      }
    
  }

  async do_payment_success(payment_type) {
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
    this.apiserv.confirmorder(this.sid, this.user_id, payment_type).subscribe(data => {
      var response = data['response'][0];
      loading.dismiss();
      if (response['status'] == 'Valid') {
        // that.utilserv.presentAlert('Cash Payment request submitted successfully');
        that.route.navigate(['paymentsuccess',{order_id:response['order_id']}]);
        // that.navctrl.navigateBack('/paymentsuccess');
        that.utilserv.reset_sid();
        // }
      } else {
        loading.dismiss();
        that.utilserv.presentAlert(response['message']);
      }
    },(err)=>{
      loading.dismiss();
    })
  }
}
