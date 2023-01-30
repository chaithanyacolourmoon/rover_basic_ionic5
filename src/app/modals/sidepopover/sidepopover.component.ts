import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-sidepopover',
  templateUrl: './sidepopover.component.html',
  styleUrls: ['./sidepopover.component.scss'],
})
export class SidepopoverComponent implements OnInit {
  public is_logged_in: boolean = false;
  user_id:any;
  constructor(private router:Router,
    private ref:ChangeDetectorRef,
    public utilserv:UtilityService,
    private popCtrl:PopoverController) { }

  ngOnInit() {}

  // logout() {
  //   localStorage.removeItem('user_id');
  //   this.is_logged_in = false;
  //   localStorage.removeItem('is_logged_in');
  //   localStorage.removeItem('sid');
  //   this.router.navigate(['home']);
  // }

  ionViewWillEnter() { 
      this.user_id = localStorage.getItem('user_id');
     this.ref.detectChanges();
 
  }
  password(){
    this.popCtrl.dismiss();
    if(this.user_id==''||this.user_id==null){
      this.utilserv.presentToast('Please Login',"danger");
      return;
    }
    this.router.navigate(['changepassword']);
  }

  order(){
    this.popCtrl.dismiss();
    if(this.user_id==''||this.user_id==null){
      this.utilserv.presentToast('Please Login',"danger");
      return;
    }
    this.router.navigate(['myorders']);
  }

  wishlist(){
    this.popCtrl.dismiss();
    if(this.user_id==''||this.user_id==null){
      this.utilserv.presentToast('Please Login',"danger");
      return;
    }
    this.router.navigate(['wishlist']);
  }

  profile(){
    this.popCtrl.dismiss();
    if(this.user_id==''||this.user_id==null){
      this.utilserv.presentToast('Please Login',"danger");
      return;
    }
    this.router.navigate(['profile']);
  }

}
