import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-addaddress',
  templateUrl: './addaddress.page.html',
  styleUrls: ['./addaddress.page.scss'],
})
export class AddaddressPage implements OnInit {

  cities: any = [];
  locations: any = [];
  areaId: any;
  cityId: any;
  user_id: any;
  addresslist: any = [];
  public sid;
  public address_id: any;
  public selected_address_id = null;
  pincodeId: any;
  pincodes: any = [];
  areas: any = [];
  subareas: any = [];
  subareaId: any;
  totalamount: any;
  userlat:any;
  userlang:any;
  currentlocation:any;
  address:any;
  address_type='Home';
  selectCity:any;
  wallet_check:any;
  constructor(private apiserv: ApiService, private navctrl: NavController, public utilserv: UtilityService,
    private actroute: ActivatedRoute,private loadingCtrl:LoadingController,
    private nativeGeocoder: NativeGeocoder,private geolocation: Geolocation,
    private route: Router,
    private diagnostic: Diagnostic,
    private platform:Platform,
    private alertctrl:AlertController) {
    this.user_id = localStorage.getItem('user_id');
    this.wallet_check = this.actroute.snapshot.paramMap.get('walletCheck');
  }

  // change(value){
  //   //manually launch change detection
  //   // this.cdRef.detectChanges();

  // }

  addressTypeClick(value){
    this.address_type=value;
  }


  async addadressSubmit(addadressForm) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var pattern = /^[0-9]*$/;
    var no_pattern=/^[5-9][0-9]{9}$/;
    var name_reg=/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
    var white_space=/^(\s+\S+\s*)*(?!\s).*$/;
    if (addadressForm.name == "" || addadressForm.name == undefined) {
      this.utilserv.presentAlert('Enter Name');
      return;
    }
    if(name_reg.test(addadressForm.name) == false){
      this.utilserv.presentAlert('Name Only Accept Characters');
      return;
    }
    if (this.address == "" || this.address == undefined) {
      this.utilserv.presentAlert('Enter address');
      return;
    }
    if(white_space.test(this.address) == false){
      this.utilserv.presentAlert('Please enter valid address');
      return;
    }
    if(addadressForm.landmark){
      if(white_space.test(addadressForm.landmark) == false){
        this.utilserv.presentAlert('Please enter valid landmark');
        return;
      }
    }
    if (this.cityId == "" || this.cityId == undefined) {
      this.utilserv.presentAlert('Enter City');
      return;
    }
    if(name_reg.test(this.cityId) == false){
      this.utilserv.presentAlert('City Only Accept Characters');
      return;
    }
    if (this.pincodeId == "" || this.pincodeId == undefined) {
      this.utilserv.presentAlert('Enter Pincode');
      return;
    }

    if (this.pincodeId.toString().length != 6) {
      this.utilserv.presentAlert('Enter 6 digit valid pincode');
      return;
    }

    if(addadressForm.location){
      if(white_space.test(addadressForm.location) == false){
        this.utilserv.presentAlert('Please enter valid location');
        return;
      }
    }

    // if (addadressForm.contact_no.toString().length > 10 || addadressForm.contact_no.toString().length < 10) {
    //   this.utilserv.presentAlert('Enter Valid Mobile');
    //   return;
    // }

    if (addadressForm.contact_no == "" || addadressForm.contact_no == undefined) {
      this.utilserv.presentAlert('Enter mobile number');
      return;
    }
    if (pattern.test(addadressForm.contact_no) == false) {
      this.utilserv.presentAlert('Enter valid mobile number');
      return;
    }
    if (no_pattern.test(addadressForm.contact_no) == false) {
      this.utilserv.presentAlert('Enter valid mobile number');
      return;
    }
    if (addadressForm.contact_no.toString().length != 10) {
      this.utilserv.presentAlert('Enter 10 digit valid mobile number');
      return;
    }

    if (this.userlat == "" || this.userlat== undefined) {
      this.userlat='';
    }

    if (this.userlang == "" || this.userlang == undefined) {
      this.userlang='';
    }


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
    let that = this;
    this.apiserv.addaddressform(
      this.user_id,
      addadressForm.name,
      this.address,
      addadressForm.landmark,
      this.cityId,
      this.pincodeId,
      addadressForm.location,
      addadressForm.contact_no,
      this.userlat,
      this.userlang,
      this.address_type
    ).subscribe(function (data) {
      console.log(JSON.stringify(data));
      var response = data['response'][0];
      console.log(response);
      loading.dismiss();
      if (response['status'] == 'Valid') {
        // that.utilserv.presentAlert(response['message']);
        setTimeout(() => {
          // that.router.navigate(['deliveryaddress']);
          // that.navctrl.navigateForward('/deliveryaddress');
          var total = localStorage.getItem('total_amount');
          that.route.navigate(['deliveryaddress', { totalamount: total,walletCheck: that.wallet_check}]);
          // this.totalamount = that.actroute.snapshot.paramMap.get('totalamount');
        }, 1000);
      } else {
        that.utilserv.presentAlert(response['message']);
      }
    },
      err => {
        that.utilserv.dismissLoading();
        loading.dismiss();
        that.utilserv.presentAlert('No Network');
      }
    )
  }

  ngOnInit() {
    this.citieslist();
  }


  citieslist() {
    this.apiserv.getcities().subscribe(data => {
      var response = data['response'][0];
      //  console.log(response);
      if (response['status'] == 'Valid') {
        this.cities = response['cities'];
        console.log(this.cities);
        if(this.selectCity){
          for(var i=0;i<this.cities.length;i++){
            if(this.selectCity==this.cities[i].city){
              this.cityId=this.cities[i].id;
            }
          }
          this.pincodeslist();
        }
      }
    })
  }

  selectcity(event) {
    this.cityId = event.target.value;
    console.log(this.cityId);
    for (var i = 0; i < this.cities.length; i++) {
      if (this.cities[i].id == this.cityId) {
        var cityname = this.cities[i].city;
        // localStorage.setItem('City', cityname);
      }
    }
    this.pincodeslist();
  }

  pincodeslist() {
    this.apiserv.getPincodes(this.cityId).subscribe(data => {
      var response = data['response'][0];
      console.log(response);
      if (response['status'] == 'Valid') {
        this.pincodes = response['pincodes'];
        console.log(this.pincodes);
        if(this.currentlocation){
          for(var i=0;i<this.pincodes.length;i++){
            if(this.currentlocation==this.pincodes[i].pincode){
              this.pincodeId=this.pincodes[i].entry_id;
            }
          }
        }
      }
    })
  }
  selectpincode(event) {
    this.pincodeId = event.target.value;
    this.areaslist();
  }

  areaslist() {
    this.apiserv.getareas(this.pincodeId).subscribe(data => {
      var response = data['response'][0];
      console.log(response);
      if (response['status'] == 'Valid') {
        this.areas = response['areas'];
        // console.log(this.pincodes);
      }
    })
  }

  selectarea(event) {
    this.areaId = event.target.value;
    this.subareaslist();
  }

  subareaslist() {
    this.apiserv.getsubareas(this.pincodeId).subscribe(data => {
      var response = data['response'][0];
      console.log(response);
      if (response['status'] == 'Valid') {
        this.subareas = response['sub_areas'];
        // console.log(this.pincodes);
      }
    })
  }

  selectsubarea(event) {
    this.subareaId = event.target.value;
  }

  async getCurrentCoordinates() { 
    
 }

 getAddress() {
  this.checkLocationEnabled();
  console.log('loading');
  this.geolocation.getCurrentPosition().then((resp) => {
   //  loading.dismiss(); 
    console.log(resp);
    this.userlat = resp.coords.latitude;
    this.userlang = resp.coords.longitude;     
    
    this.nativeGeocoder.reverseGeocode(this.userlat, this.userlang)
      .then((res: NativeGeocoderResult[]) => {
        var address = res[0].thoroughfare + "," + res[0].subLocality + "," + res[0].locality + "," + res[0].subAdministrativeArea + "," + res[0].administrativeArea + "," + res[0].countryName + "," + res[0].postalCode;
        this.currentlocation = res[0].postalCode;
        this.address = address;
        console.log(this.address);
        this.selectCity=res[0].locality;
        console.log(res[0].locality);
        this.citieslist();
        //  alert(JSON.stringify(this.currentlocation));
      })
      .catch((error: any) => {
        this.currentlocation = 'No Location Found';
        this.utilserv.presentAlert(JSON.stringify(error));
        //  alert('Error getting location' + JSON.stringify(error));
      });
  }).catch((error) => {
   //  loading.dismiss(); 
    console.log('Error getting location', error);
  });
    
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
      

  // selectlocation(event) {
  //   this.areaId = event.target.value;
  //   for (var i = 0; i < this.locations.length; i++) {
  //     if (this.locations[i].id == this.areaId) {
  //       var areaname = this.locations[i].location;
  //     }
  //   }
  // }

}
