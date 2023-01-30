import { ChangeDetectorRef, Component,Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, AlertController, NavController, ModalController, LoadingController } from '@ionic/angular';
import { NointernetpageComponent } from './modals/nointernetpage/nointernetpage.component';
import { ApiService } from './services/api.service';
import { EventsService } from './services/events.service';
import { UtilityService } from './services/utility.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { NotificationdataComponent } from './notificationdata/notificationdata.component';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public back_subscription;
  public franchiseId;
  public device_id;
  public currentcity;
  public currentarea;
  public user_id;
  public is_logged_in: boolean = false;
  sid: any;
  name: string;
  mobile: any;
  menucategories: any;
  walletAmount:any;
  city_id: any;
  public current_section_index = null;
  public MenuIndex = null;
  public dynamic_sidemenu = [];
  account_show:boolean=false;
  service_show:boolean=false;
  noti_data:any;
  current_sub_index:any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private alertCtrl: AlertController,
    private navctrl: NavController,
    private router: Router,
    private apiserv: ApiService,
    private network: Network,
    private appversion: AppVersion,
    private events: EventsService,
    private modalctrl: ModalController,
    public utilserv: UtilityService,
    private ref:ChangeDetectorRef,
    private renderer: Renderer2,
    private push:Push,
    private diagnostic: Diagnostic,
    private loadingCtrl:LoadingController,
    private activeroute:ActivatedRoute
    
  ) {
    
    this.initializeApp();
    this.menuList();
    this.currentcity = localStorage.getItem('City');
    if(localStorage.getItem('slider')=='0'){
      if(localStorage.getItem('city_id')!=null || localStorage.getItem('mapLocation')!=null){
        if (localStorage.getItem('is_logged_in') == 'true') {
          this.is_logged_in = true;
          this.user_id = localStorage.getItem('user_id');
          this.name = localStorage.getItem('name');
          this.mobile = localStorage.getItem('mobile');
        }
        // this.router.navigate(['home']);
        this.utilserv.getSettings();
      }
    }else{
      this.router.navigate(['slider']);
    }
    var sid = localStorage.getItem('sid');
    if (sid == '' || sid == null || sid == undefined) {
      this.utilserv.reset_sid();
    }
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.presentContactModal();
    });
    this.sid = localStorage.getItem('sid');
    this.dynamic_sidemenu = [
      {
        "menu_label": "My Account",
        "childern": [
          { "childern_name": "Profile", "menulink": "/profile" },
          { "childern_name": "Order History", "menulink": "/myorders" },
          { "childern_name": "Address Book", "menulink": "/addressbook" },
          { "childern_name": "Wish List", "menulink": "/wishlist" },
          { "childern_name": "Change Password", "menulink": "/changepassword" }
        ]
      }
    ];
    this.listenToLoginEvents();
  }

  listenToLoginEvents() {
    this.user_id = localStorage.getItem('user_id');
    this.events.getObservable().subscribe((data) => {
      console.log(JSON.stringify(data));
      if (data['name']) {
        this.name = data['name'];
      } else {
      }
      if (data['mobile']) {
        this.mobile = data['mobile'];
      } else {
      }
      if (data['is_logged_in']) {
        this.is_logged_in = data['is_logged_in'];
      } else {
      }

      if (data['City']) {
        this.currentcity = data['City'];
      } else {
      }
      if (data['Area']) {
        this.currentarea = data['Area'];
      } else {
      }
    });
  }

  toggle_section(arindex) {
    console.log(arindex);
    this.current_section_index = arindex;
  }
  Myaccounttoggle_section1(menu) {
    this.MenuIndex = menu;
  }

  async checkLocationEnabled() {
    console.log("coming");
    return new Promise((resolve, reject) => {
      this.diagnostic.isLocationEnabled().then((isEnabled) => {
        console.log(isEnabled);
        if (isEnabled === false) {
          // this.util.presentToast('Please turn on Location Service', 'danger');        
          setTimeout(() => {
            this.presentAlertConfirm();
          }, 1500);
          resolve(false);
        } else {
        }
      })
        .catch((e) => {
          // setTimeout(() => {
          //   this.presentAlertConfirm();
          // }, 1500);
          this.utilserv.presentAlert('Please turn on Location');
          reject(false);
        });
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Your Location is OFF.Please turn ON',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            navigator['app'].exitApp();
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.openSettingLocation();
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  openSettingLocation() {
    if (this.platform.is("android")) {
      this.diagnostic.switchToLocationSettings();
    } else {
      this.diagnostic.switchToSettings();
    }
  }

  gotoProductList(product, sub,index) {
    // console.log(this.menucategories);
    // console.log(product);
    for (var i = 0; i < this.menucategories.length; i++) {
      if (this.menucategories[i].category == product) {
        this.router.navigate(['/productlist', { banner: this.menucategories[i].image, id: this.menucategories[i].id, title: this.menucategories[i].category, sub_category: sub, current_index:index}]);
      }
    }
    // this.router.navigate(['/productlist', { banner: product.image, id: product.id, title: product.category }]);
  }

  profile(){
    // this.popCtrl.dismiss();
    if(this.user_id==''||this.user_id==null){
      this.router.navigate(['home']);
      // this.utilserv.presentToast('Please Login',"danger");
      // return;
    }
    this.router.navigate(['profile']);
  }


  close_section1() {
    this.MenuIndex = null;
  }
  close_section() {
    this.current_section_index = null;
  }
  ngOnInit() {
    this.currentcity = localStorage.getItem('City');
    this.currentarea = localStorage.getItem('Area');
  }

  menuList() {
    this.apiserv.categoriesList().subscribe(data => {
      var response = data['response'][0];
      this.menucategories = response['categories'];
      console.log(this.menucategories);
    })
  }
  async presentContactModal() {
    const modal = await this.modalctrl.create({
      component: NointernetpageComponent,
      componentProps: {}
    });
    modal.onDidDismiss().then((data) => {
    });
    await modal.present();
  }

  onToggleColorTheme(){ 
    this.renderer.setAttribute(document.body, 'color-theme', 'light');
  }


  initializeApp() {
    this.utilserv.getLanguageTitles();
    this.utilserv.updateAppVersion();
    this.utilserv.getAppColour();
    this.utilserv.getCategory();
    this.utilserv.checkSid();
    if(localStorage.getItem('user_id')){
      this.utilserv.getWallet();
    }
    
    // this.checkLocationEnabled();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // this.statusBar.hide();
      this.statusBar.styleLightContent();
      this.renderer.setAttribute(document.body, 'color-theme', 'light');
      this.statusBar.backgroundColorByHexString('#001646');
      this.onToggleColorTheme();
      this.back_subscription = this.platform.backButton.subscribeWithPriority(5,async () => {
        let url = this.router.url.split(';')[0];
        let testUrl =this.router.url.split('/')[1];
        // alert(testUrl);
        if (this.router.url == '/login' || this.router.url == '/home') {
          this.exitApp_confirm();
          return;
        }
        else if (this.router.url == '/revieworder') {
          this.navctrl.navigateBack('/home')
        }
        else if (this.router.url == '/location') {
          this.navctrl.navigateBack('/home')
        }
         
        else if (url == '/subcategory') {
          // setTimeout(() => {
            this.router.navigate(['category']);
          // }, 10); 
        }
        else if (url == '/category') {
            this.router.navigate(['home']);
        }
        else if (url == '/paymentsuccess') {
          setTimeout(() => {
            this.router.navigate(['home']);
          }, 10); 
        }
        else if (url == '/paymentfailure') {
          setTimeout(() => {
            this.router.navigate(['home']);
          }, 10); 
        }
        else if (testUrl == 'orderdetail') {
          // setTimeout(() => {
            this.router.navigate(['myorders']);
          // }, 10); 
        }
        else if (url == '/myorders') {
          // setTimeout(() => {
            this.router.navigate(['home']);
          // }, 10); 
        }
        else {
          window.history.back();
        }
      });

      this.push.hasPermission().then((res: any) => {
        // alert(res);
        if (res.isEnabled) {
            console.log('We have permission to send push notifications');
        } else {
            console.log('We do not have permission to send push notifications');
        }
      });
  
      const options: PushOptions = {
        android: {
            senderID: '650270734369'
        },
        ios: {
            alert: 'true',
            badge: true,
            sound: 'false'
        },
        windows: {},
        browser: {
            pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        }
      }
  
      const pushObject: PushObject = this.push.init(options);
      pushObject.on('registration').subscribe((registration: any) => {
        // alert('Device registered' + JSON.stringify(registration));
        localStorage.setItem('fcm_token', registration.registrationId);
        this.updateToken(registration.registrationId);
      });
      // if (localStorage.getItem('fcm_token') == "" ||
      //     localStorage.getItem('fcm_token') == null ||
      //     localStorage.getItem('fcm_token') == undefined) {
      //     pushObject.on('registration').subscribe((registration: any) => {
      //         // alert('Device registered' + JSON.stringify(registration));
      //         localStorage.setItem('fcm_token', registration.registrationId);
      //     });
      // }
      pushObject.on('notification').subscribe((notification: any) => {
          console.log('Received a notification', notification);
          // alert(JSON.stringify(notification));
          if(notification.additionalData){
            var data=notification.additionalData;
            console.log(data.target);
            if(data.foreground==true){
              this.openPopup(notification.title,notification.message);
            }
            if(data.target==1){
              if(data.category==''){
                this.router.navigate(['category']);
               
              }
              else{
                this.router.navigate(['subcategory',{cat_id:data.category}]);
              }
              
            }else if(data.target==2){
              if(data.scategory==''){
                this.router.navigate(['subcategory',{cat_id:data.category}]);
              }
              else{
                // alert("I am here");
                console.log(this.utilserv.categories);
                var product;
                for(var i=0;i<this.utilserv.categories.length;i++){
                  if(data.category==this.utilserv.categories[i].id){
                    product=this.utilserv.categories[i];
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
            }else if(data.target==3){
              if(data.product){
                this.router.navigate(['/productview/' + data.product]);
              }
              
            }else if(data.target==4){
              console.log(data.target);
              this.router.navigate(['/specialtag',{tag: data.tag}]);
            }else if(data.notification_type=='order'){
              // alert(notification.title);
              this.router.navigate(['/orderdetail/'+data.order_id])
            }
           
          }
          // else{
          //   alert("coming");
          //   this.utilserv.getSettings();
          // }
          //this.alertService.notification(notification);            
      });
  
      pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
      // this.updateAppVersion();
    });

   
  }

  async openPopup(title,description) {
    const modal = await this.modalctrl.create({
      component: NotificationdataComponent,
      cssClass: 'custom-filter-modal',
      componentProps: {
        'title': title,
        'description':description
      }
    });
    setTimeout(() =>{
      this.modalctrl.dismiss(
        );
    },2500)
    
    let that = this;
    modal.onDidDismiss().then(function (res) {

    })
    modal.present();

    
  }

  

  updateToken(device_id){
    var user_id=localStorage.getItem('user_id');
    this.apiserv.updateToken(user_id,device_id).subscribe(data => {
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        // alert(JSON.stringify(response));
        console.log("valid Token");
      } else {
        
      }
    },(err)=>{
    })
  }

  async exitApp_confirm() {
    const exitApp_confirm_alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Do you really want to exit the app?',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {
            navigator['app'].exitApp();
          }
        }, {
          text: 'Cancel',
          handler: () => {
            console.log('Confirm Okay');
            this.alertCtrl.dismiss();
          }
        }
      ]
    });
    await exitApp_confirm_alert.present();
  }

  // updateAppVersion() {
  //   var appVersion = '1.0';
  //   this.apiserv.updateversion().subscribe(data => {
  //     console.log(data);
  //     var response = data['response'][0];
  //     if (response['status'] == 'Valid') {
  //       this.utilserv.checkVersion(appVersion,response['version']);
  //       // if (appVersion != response['version']) {
  //       //   this.navctrl.navigateForward('/updateversion');
  //       // } else {

  //       // }
  //     }
  //   })
  // }

  async logout() {
    const exitApp_confirm_alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Do you really want to Logout?',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {
            localStorage.removeItem('uid');
            // this.events.publishSettingsData({
            //   is_logged_in: this.is_logged_in
            // });
            localStorage.removeItem('user_id');  
            localStorage.removeItem('name');  
            localStorage.removeItem('mobile');  
            localStorage.removeItem('noti_count');  
            this.ref.detectChanges();
            this.is_logged_in = false;
            localStorage.removeItem('is_logged_in');
            localStorage.removeItem('sid');
            // this.utilserv.cartCount=0;
            setTimeout(() => {
              // this.router.navigate(['home']);
              window.location.assign('/');
              // this.navctrl.navigateForward('/home');
            }, 1000);
          }
        }, {
          text: 'Cancel',
          handler: () => {
            console.log('Confirm Okay');
            this.alertCtrl.dismiss();
          }
        }
      ]
    });
    await exitApp_confirm_alert.present();
    
  }

  accountShow(){
    this.account_show=!this.account_show;
  }

  serviceShow(){
    this.service_show=!this.service_show;
  }

  password(){
    if(this.user_id==''||this.user_id==null){
      // this.utilserv.presentToast('Please Login',"danger");
      this.router.navigate(['login']);
    }
    this.router.navigate(['changepassword']);
  }

}

