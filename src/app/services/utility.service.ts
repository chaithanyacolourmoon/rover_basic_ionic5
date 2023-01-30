import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  languages_titles:any=[];
  setting_data:any;
  color_data:any;
  version_data:any;
  appVersion:any;
  back_version:any;
  cartCount:any;
  // package:any='advance';
  walletAmount:any;
  force_update:any="No";
  categories:any=[];
  current_sub_index:any;
  constructor(private toastctrl: ToastController,
    private alertctrl: AlertController,
    private loadingCtrl: LoadingController,
    private apiserv:ApiService,private navctrl:NavController,private router:Router) {

  }

  async presentToast(message: any, color: any = 'dark') {
    const toast = await this.toastctrl.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      color: color
    });
    toast.present();
  }

  async presentAlert(message) {
    const alert = await this.alertctrl.create({
      cssClass: 'alert_class',
      // header: 'Alert',
      // subHeader: 'Subtitle',
      message: message,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async show_loader() {
    // const loading = await this.loadingCtrl.create({
    //   spinner: 'crescent',
    //   message: 'Please wait...',
    //   translucent: true
    // });
  let loading = await this.loadingCtrl.create({
    
    showBackdrop:false,
          
    cssClass:'sacustom-cls',     
            
    message:`
          
    <div class="custom-spinner-container">
            
    <img class="loading" width="40px" height="40px" 
    src="assets/images/cmoon.gif" />
          
    </div>`
        
    });
    return await loading.present();
  }
  dismissLoading() {
    console.log('dismiss');
    this.loadingCtrl.dismiss();
  }


  generate_sid() {
    var result = '';
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    for (var i = 20; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result.replace(/['"]+/g, '');
  };

  reset_sid() {
    var sid = this.generate_sid();
    localStorage.setItem('sid', sid);
    console.log(sid);
  }

  checkSid() {
    var sid=localStorage.getItem('sid');
    this.apiserv.checkSid(sid).subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
      }
    })
  }

  getLanguageTitles(){
    var language_id=localStorage.getItem('language_id');
    this.apiserv.getLanguagesTitles(language_id).subscribe(data => {
      var response = data['response'][0];
      //   this.dismissLoading();
      console.log(response);
      if (response['status'] == 'Valid') {
        this.languages_titles = response['language_titles'];
        
      }
      else{
        this.languages_titles=[];
      }
    })
  }

  getTranslation(str){
    if(this.languages_titles[str]){
      return this.languages_titles[str];
    }
    // return str;
  }

  getSettings(){
    this.apiserv.getSettings().subscribe(data => {
      var response = data['response'][0];
      //   this.dismissLoading();
      console.log(response);
      if (response['status'] == 'Valid') {
        this.setting_data = response;
        console.log(this.setting_data);
        localStorage.setItem('multi_language',this.setting_data.multi_language);
        var language=localStorage.getItem('multi_language');
        // if(this.force_update=='Yes'){
        //   this.router.navigate(['updateversion']);
        // }
        // else{
          // alert(localStorage.getItem('language_id'));
          if(language=='No'){
            if(localStorage.getItem('slider')=='0'){
              if(localStorage.getItem('city_id')!=null || localStorage.getItem('mapLocation')!=null){
                this.router.navigate(['home']);
              }
              else{
                localStorage.setItem("city_id","10");
                // this.router.navigate(['location']);
                this.router.navigate(['home']);
              }
            }else{
              this.router.navigate(['slider']);
            }
          }
          
          else if(localStorage.getItem('language_id')){
            if(localStorage.getItem('slider')=='0'){
              if(localStorage.getItem('city_id')!=null || localStorage.getItem('mapLocation')!=null){
                // alert("I am here");
                this.router.navigate(['home']);
                // alert(localStorage.getItem('noti_come'));
                // if(localStorage.getItem('noti_come')=="Yes"){
                //   var noti_data=localStorage.getItem('notification_data');
                //   alert(noti_data);
                //   localStorage.removeItem('noti_come');
                //   localStorage.removeItem('notification_data');
                //   this.goNotification(JSON.parse(noti_data));
                // }
                // else{
                //   this.router.navigate(['home']);
                
                // }
                
              }
              else{
                localStorage.setItem("city_id","10");
                // this.router.navigate(['location']);
                this.router.navigate(['home']);
              }
            }else{
              this.router.navigate(['slider']);
            }
          }
          else{
            this.router.navigate(['language']);
          }
        // }
        
      }
      else{
        this.setting_data=[];
      }
    })
  }

  goNotification(data){
    if(data.target==1){
      if(data.category==0){
        this.router.navigate(['category']);
       
      }
      else{
        this.router.navigate(['subcategory',{cat_id:data.category}]);
      }
      
    }else if(data.target==2){
      if(data.scategory==0){
        this.router.navigate(['subcategory',{cat_id:data.category}]);
      }
      else{
        console.log(this.categories);
        var product;
        for(var i=0;i<this.categories.length;i++){
          if(data.category==this.categories[i].id){
            product=this.categories[i];
            console.log(product.sub_categories);
            for(var j=0;j<product.sub_categories.length;j++){
              console.log(data.scategory);
              console.log(product.sub_categories[j].id);
              if(data.scategory==product.sub_categories[j].id){
                this.current_sub_index=j;
              }
            }
          }
        }
        this.router.navigate(['/productlist', { banner: product.image, id: product.id, title: product.category,sub_category:data.scategory,current_index:this.current_sub_index }]);
      }
    }else if(data.target_type==3){
      console.log(data.product);
      if(data.product!=0){
        this.router.navigate(['/productview/' + data.product]);
      }
      
    }else if(data.target_type==4){
      this.router.navigate(['/specialtag',{tag: data.tag}]);
    }
  }

  getCategory(){
    this.apiserv.getCategories().subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      this.categories = response['categories'];
    }, (err) => {
    });
  }

  async getWallet(){
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
        // alert(this.walletAmount);
      }
    },(err)=>{
      loading.dismiss();
    })
  }

  getAppColour(){
    this.apiserv.getAppcolour().subscribe(data => {
      var response = data['response'][0];
      //   this.dismissLoading();
      console.log(response);
      if (response['status'] == 'Valid') {
        this.color_data = response;
        document.documentElement.style.setProperty('--cm-main-color', this.color_data.header_colour);
        document.documentElement.style.setProperty('--cm-add-color', this.color_data.increment_decrement_button);
        document.documentElement.style.setProperty('--cm-p-color', this.color_data.p_tag);
        document.documentElement.style.setProperty('--cm-box-color', this.color_data.unselected_delivery_box);
        document.documentElement.style.setProperty('--cm-no-item-color', this.color_data.no_item);
        document.documentElement.style.setProperty('--cm-text-background', this.color_data.text_background);
        document.documentElement.style.setProperty('--cm-footer-color', this.color_data.footer_colour);
        document.documentElement.style.setProperty('--cm-head-back-color', this.color_data.text_colour);
        
        console.log(this.setting_data);
      }
      else{
        this.color_data=[];
      }
    })
  }

  updateAppVersion() {
    var appVersion = '2';
    this.apiserv.updateversion().subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.checkVersion(appVersion,response['version']);   // 1, 1.0
      }
    })
  }

  checkVersion(version,back_version){
    this.version_data='';
    this.appVersion=version;
    this.back_version=back_version;
    // alert("coomingg");
    this.apiserv.checkVersion(version).subscribe(data => {
      var response = data['response'][0];
      this.force_update=response['force_update'];
      this.version_data=response['message'];
      console.log(this.force_update);
      if (response['status'] == 'Valid') { 
        // if(this.force_update=='Yes'){
        //   this.router.navigate(['updateversion']);
        // }
        this.getSettings();
      }
      else if(response['status']=="Invalid"){
          if(this.force_update=='Yes'){
            this.navctrl.navigateForward('/updateversion');
          }
          else{
            this.getSettings();
          }
      }
      else{
        // this.version_data='';
      }
    })
  }

  // cartcount() {
  //   var sid = localStorage.getItem('sid');
  //   this.apiserv.cartcountdata(sid).subscribe(data => {
  //     console.log(data);
  //     var response = data['response'][0];
  //     if (response['status'] == 'Valid') {
  //       this.cartCount = response['count'];
  //     }
  //   })
  // }

}
