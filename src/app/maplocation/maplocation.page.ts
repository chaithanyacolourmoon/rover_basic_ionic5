import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { UtilityService } from '../services/utility.service';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EventsService } from '../services/events.service';

declare var google;
@Component({
  selector: 'app-maplocation',
  templateUrl: './maplocation.page.html',
  styleUrls: ['./maplocation.page.scss'],
})
export class MaplocationPage implements OnInit {
  user_id: any;

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;
  latitude: any;
  longitude: any;
  address1: any;
  currentuserlocation: any;
  options: GeolocationOptions;
  currentPos: Geoposition;
  subscription: any;
  locationCoords: any;
  apiResponse: any;
  pincode: any;
  location: any;
  cities:any;
  currentUserArea:any;
  constructor(private nativeGeocoder: NativeGeocoder,private changeDetectorRef: ChangeDetectorRef,
    public utilserv:UtilityService,private alertctrl:AlertController,private platform:Platform,
    private geolocation: Geolocation,private router:Router,private apiserv:ApiService,
    private diagnostic: Diagnostic,private loadingCtrl:LoadingController,private events:EventsService) { }

  ngOnInit() {
    this.loadMap();
    this.getcities();
  }

  loadMap() {
    this.checkLocationEnabled();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      localStorage.setItem('latitude', this.latitude);
      localStorage.setItem('longitude', this.longitude);
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });

      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };

      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      this.nativeGeocoder.reverseGeocode(this.latitude, this.longitude, options)
        .then((result: NativeGeocoderResult[]) => {
          console.log(JSON.stringify(result[0]))
          localStorage.setItem('city', result[0].subAdministrativeArea);
          this.location = result[0].subLocality;
          this.pincode = result[0].postalCode;
          // localStorage.setItem('location', this.location);
          // localStorage.setItem('pincode', this.pincode);

          var address = result[0].thoroughfare + ", " + result[0].subLocality + ", " + result[0].locality + ", " + result[0].subAdministrativeArea + ", " + result[0].administrativeArea + ", " + result[0].countryName + ", " + result[0].postalCode;
          this.address1 = address;
          this.currentuserlocation = result[0].locality;
          this.currentUserArea=result[0].subAdministrativeArea;
          console.log(result[0].locality);
          // + "," + result[0].postalCode;
          // localStorage.setItem('City', this.currentuserlocation);

        })
        .catch((error: any) => {
          console.log('native geocode error')
          console.log(error);
        });

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('dragend', () => {
        this.latitude = this.map.center.lat();
        this.longitude = this.map.center.lng();

        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
        };
        console.log('dragend', this.latitude, this.longitude);
        this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
        this.nativeGeocoder.reverseGeocode(this.latitude, this.longitude, options)
          .then((result: NativeGeocoderResult[]) => {
            console.log(result[0]);
            if (result[0].thoroughfare == '' || result[0].thoroughfare == null || result[0].thoroughfare == 'Unnamed Road') {
              var address = result[0].subLocality + ", " + result[0].locality + ", " + result[0].subAdministrativeArea + ", " + result[0].administrativeArea + ", " + result[0].countryName;
              this.address1 = address;
            } else {
              var address = result[0].thoroughfare + ", " + result[0].subLocality + ", " + result[0].locality + ", " + result[0].subAdministrativeArea + ", " + result[0].administrativeArea + ", " + result[0].countryName;
              this.address1 = address;
            }
            console.log(result[0].locality);
            this.location = result[0].subLocality;
            this.pincode = result[0].postalCode;
            this.currentuserlocation = result[0].locality;
            this.currentUserArea=result[0].subAdministrativeArea;
            // localStorage.setItem('location', this.location);
            this.changeDetectorRef.markForCheck();
            this.changeDetectorRef.detectChanges();
          })
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords " + lattitude + " " + longitude);
    // this.latitude = lattitude;
    // this.longitude = longitude;
    // console.log(this.latitude);
    // console.log(this.longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
        setTimeout(() => {
          this.changeDetectorRef.markForCheck();
          this.changeDetectorRef.detectChanges();
        }, 500);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });
  }

  // confirmuserlocation() {
  //   this.router.navigate(['home']);
  // }

  async confirmuserlocation() {
    // alert("coming");
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
        // localStorage.setItem('mapLocation', '');
        localStorage.setItem('mapLocation', this.address1);
      }
    }

    if(location_match){
      setTimeout(() => {
        this.router.navigate(['home'])
      }, 10);
    }
    else{
      this.utilserv.presentAlert("Service Not Available To This Location!");
      this.router.navigate(['location']);
    }
    
    // alert(this.pincode);
    // alert(this.location);
    // let that = this;

    // this.apiserv.checkLocation(this.pincode).subscribe(data => {
    //   var response = data['response'][0];
    //   // alert(JSON.stringify(response));
    //   loading.dismiss();
    //   if (response['status'] == 'Valid') {
    //     // alert(this.user_id);
    //     this.user_id=localStorage.getItem('user_id');
    //       this.router.navigate(['home']);
       
    //     // if (this.user_id == null || this.user_id == '') {
    //     //   this.router.navigate(['login']);
    //     // } else {
    //     //   this.navCtrl.navigateForward('tabs/home');
    //     // }
    //   }
    //   else {
    //     // localStorage.setItem('location', '');
    //     // localStorage.setItem('pincode', '');
    //     this.utilserv.presentToast(response['message'], 'danger');
    //     // this.getLocation();
    //     // this.router.navigate(['change-location']);
    //     // this.getLocation();
    //   }
    // })
  }

  getcities() {
    this.apiserv.getcities().subscribe(data => {
      var response = data['response'][0];
      console.log(response);
      if (response['status'] == 'Valid') {
        this.cities = response['cities'];
        console.log(this.cities);
      }
    })
  }



  addMarker() {
    this.loadMap();
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
            // navigator['app'].exitApp();
            this.router.navigate(['location']);
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

  searchLocation(){
    console.log('latitude: '+this.latitude);
    if(this.latitude==undefined){
      this.loadMap()
      this.utilserv.show_loader();
      setTimeout(() => {
        this.utilserv.dismissLoading();
        // this.confirmuserlocation();
      }, 1500);
    }else{
      // this.confirmuserlocation();
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
