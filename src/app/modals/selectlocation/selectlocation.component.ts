import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { EventsService } from 'src/app/services/events.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Router } from '@angular/router';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';


@Component({
  selector: 'app-selectlocation',
  templateUrl: './selectlocation.component.html',
  styleUrls: ['./selectlocation.component.scss'],
})
export class SelectlocationComponent implements OnInit {
  cities:any=[];
  city_id:any;citiesData:any;
  currentlocation:any;
  userlat:any;
  userlang:any;
  currentUserArea:any;
  currentuserlocation:any;
  constructor(private apiserv:ApiService,private modalCtrl:ModalController,
    public utilserv:UtilityService,private events:EventsService,private loadingCtrl:LoadingController,
    private nativeGeocoder: NativeGeocoder,private geolocation: Geolocation,
    private router:Router,
    private diagnostic: Diagnostic,
    private platform:Platform,
    private alertctrl:AlertController) { }

  ngOnInit() {
    this.getcities();
  }

  async getcities() {
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
    this.apiserv.getcities().subscribe(data => {
      var response = data['response'][0];
      console.log(response);
      loading.dismiss();
      if (response['status'] == 'Valid') {
        this.citiesData=response['cities'];
        this.cities = response['cities'];
        console.log(this.cities);
      }
    },(err)=>{
      loading.dismiss();
    })
  }

  getItems(searchTerm) {
    var searchWord=searchTerm.target.value;
    console.log(searchWord);
    if(searchWord){
      var data= this.citiesData.filter(item => {
        return item.city.toLowerCase().indexOf(searchWord.toLowerCase()) > -1;
      });
      this.cities=data;
    }
    else{
      this.getcities();
    }
   
    console.log(data);
  }

  checkValue(value){
    console.log(value);
    this.city_id=value;
    this.modalCtrl.dismiss(
      //'dismissed': true
      { 'action': 'close', 'type': this.city_id}
    );
  }

  async dismiss() {
    if(this.city_id == "" || this.city_id == undefined){
      this.utilserv.presentAlert('Please Select Any City');
      return;
    } 
    this.modalCtrl.dismiss(
      //'dismissed': true
      { 'action': 'close', 'type': this.city_id}
    );
    
  }

  
  async getCurrentCoordinates() { 
  //   let loading = await this.loadingCtrl.create({
  //    spinner: 'circles',
  //    message: 'Please wait',
  //  });
  //  loading.present(); 
  //  console.log('loading');
  //  this.geolocation.getCurrentPosition().then((resp) => {
  //    loading.dismiss(); 
  //    console.log(resp);
  //    this.userlat = resp.coords.latitude;
  //    this.userlang = resp.coords.longitude;      
  //  }).catch((error) => {
  //    loading.dismiss(); 
  //    console.log('Error getting location', error);
  //  });
 }

  async getAddress() {
    this.checkLocationEnabled();
    console.log('loading');
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.userlat = resp.coords.latitude;
      this.userlang = resp.coords.longitude; 

      this.nativeGeocoder.reverseGeocode(this.userlat, this.userlang)
      .then((res: NativeGeocoderResult[]) => {
        var address = res[0].thoroughfare + "," + res[0].subLocality + "," + res[0].locality + "," + res[0].subAdministrativeArea + "," + res[0].administrativeArea + "," + res[0].countryName + "," + res[0].postalCode;
         this.currentlocation = res[0].locality ;
         this.currentuserlocation = res[0].locality;
         this.currentUserArea=res[0].subAdministrativeArea;
        this.getLocation();
      })
      .catch((error: any) => {
        this.currentlocation = 'No Location Found';
        this.utilserv.presentAlert(JSON.stringify(error));
        //  alert('Error getting location' + JSON.stringify(error));
      });     
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    
    }

    getLocation(){

    console.log(this.currentUserArea);
    var location_match=false;
    for (var i = 0; i < this.cities.length; i++) {
      if (this.cities[i].city.toLowerCase() == this.currentuserlocation.toLowerCase() || this.cities[i].city.toLowerCase()==this.currentUserArea.toLowerCase()) {
        var cityname = this.cities[i].city;
        localStorage.setItem('City', cityname);
        localStorage.setItem('city_id', this.cities[i].id);
        this.updateCity();
        this.events.publishSettingsData({
          City: cityname
        });
        location_match=true;
        
      }
    }

    if(location_match){
      this.modalCtrl.dismiss(
        //'dismissed': true
        { 'action': 'close', 'type': localStorage.getItem('city_id')}
      );
    }
    else{
      this.utilserv.presentAlert("Service Not Available To This Location!");
    }
      // for (var i = 0; i < this.cities.length; i++) {
      //   if (this.cities[i].city == 'Visakhapatnam') {
      //     var cityname = this.cities[i].city;
      //     this.city_id=this.cities[i].id;
      //     localStorage.setItem('City', cityname);
      //     localStorage.setItem('city_id', this.cities[i].id);
      //     this.events.publishSettingsData({
      //       City: cityname
      //     });
         
      //   }
      // }
      // this.modalCtrl.dismiss(
      //   //'dismissed': true
      //   { 'action': 'close', 'type': this.city_id}
      // );
    }

    async checkLocationEnabled() {
      return new Promise((resolve, reject) => {
        this.diagnostic.isLocationEnabled().then((isEnabled) => {
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
            this.utilserv.presentAlert('Please turn on Location');
            reject(false);
          });
      });
    }
  
    async presentAlertConfirm() {
      const alert = await this.alertctrl.create({
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

    updateCity(){
      var user_id=localStorage.getItem('user_id');
      var city_id=localStorage.getItem('city_id');
      if(user_id){
        this.apiserv.UpdateCity(user_id,city_id).subscribe(data => {
          console.log(data);
          this.utilserv.reset_sid();
        }, (err) => {
        });
      }
      
    }

}
