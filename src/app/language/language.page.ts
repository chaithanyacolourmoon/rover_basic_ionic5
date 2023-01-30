import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, LoadingController, MenuController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  select_lang:any;
  languages:any;
  constructor(private router:Router,private apiserv:ApiService,private routerOutlet:IonRouterOutlet,
    public utilserv:UtilityService,private loadingCtrl:LoadingController,private menuCtrl:MenuController) { }

  ngOnInit() {
    // this.menuCtrl.enable(false);
    this.getLangauges();
  }

  ionViewWillEnter(){
    this.menuCtrl.enable(false);
  }

  langClick(value){
    this.select_lang=value;
  }

  goSlider(){
    localStorage.setItem('language_id',this.select_lang);
    if(localStorage.getItem('slider')=='0'){
      this.router.navigate(['home']);
    }else{
      this.router.navigate(['slider']);
    }
    
  }

  async getLangauges() {
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
    this.apiserv.getLanguages().subscribe(data => {
      var response = data['response'][0];
      //   this.dismissLoading();
      console.log(response);
      loading.dismiss();
      if (response['status'] == 'Valid') {
        this.languages = response['languages'];
        if(localStorage.getItem('language_id')){
          this.select_lang=localStorage.getItem('language_id');
        }else{
          this.select_lang=this.languages[0].language_id;
        }
        
        // console.log(this.banners);
      }
    })
  }

}
