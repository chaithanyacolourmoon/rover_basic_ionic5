import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { EventsService } from 'src/app/services/events.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-otpverify',
  templateUrl: './otpverify.component.html',
  styleUrls: ['./otpverify.component.scss'],
})
export class OtpverifyComponent implements OnInit {
  @Input() message:any;
  @Input() user_id:any;
  name:any;
  mobile:any;
  is_logged_in:any;
  // maxtime: any=30
  constructor(private modalctrl:ModalController,private router:Router,
    private apiserv:ApiService,private events:EventsService,
    public utilserv:UtilityService) { }

  ngOnInit() {
    // this.startCountdown(this.maxtime);
  }

  // startCountdown(seconds) {
  //   let counter = seconds;
      
  //   const interval = setInterval(() => {
  //     console.log(counter);
  //     counter--;
        
  //     if (counter < 0 ) {
  //       clearInterval(interval);
  //       console.log('Ding!');
  //     }
  //   }, 1000);
  // }

  goHome(){
    let that=this;
    this.apiserv.Profile(this.user_id).subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      that.name = response['name'];
      that.mobile = response['mobile'];
      localStorage.setItem('user_id', that.user_id);
      localStorage.setItem('name', that.name);
      localStorage.setItem('mobile', that.mobile);
      localStorage.setItem('is_logged_in', 'true');
      this.is_logged_in = true;
      that.events.publishSettingsData({
        name: that.name,
        mobile: that.mobile,
        is_logged_in: this.is_logged_in
      });
      // that.utilserv.presentToast(response['message'], 'success');
      setTimeout(() => {
        that.modalClose();
        that.utilserv.getWallet();
        that.router.navigate(['home']);
      }, 1000);
      
    })
    // this.modalClose();
    // this.router.navigate(['login']);
  }

  modalClose() {
    this.modalctrl.dismiss();
  }

}
