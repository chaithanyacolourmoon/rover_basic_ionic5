import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
//import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-editaddress',
  templateUrl: './editaddress.page.html',
  styleUrls: ['./editaddress.page.scss'],
})
export class EditaddressPage implements OnInit {

 // public edit_address_form: FormGroup;
  public address_id;
  public user_id;
  cities: any = [];
  locations: any = [];
  areaId: any;
  cityId: any;
  pincodeId: any;
  pincodes: any = [];
  pincode_link:any;
  areas: any = [];
  subareas: any = [];
  subareaId: any;
  flat_no:any;
  apt:any;
  street_name:any;
  city:any;
  location:any;
  sub_location:any;
  landmark:any;
  mobile:any;
  name:any;
  address:any;
  currentlocation:any;
  userlat:any;
  userlang:any
  address_type:any;

  constructor(private apiserv: ApiService,
    public utilserv: UtilityService,
   // private formbuilder: FormBuilder,
    private router:Router,
    private navctrl: NavController,
    private activeroute: ActivatedRoute,private loadingCtrl:LoadingController,
    private nativeGeocoder: NativeGeocoder,private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private platform:Platform,
    private alertctrl:AlertController
    ) {
   
    this.user_id = localStorage.getItem('user_id');
  }

  addressTypeClick(value){
    this.address_type=value;
  }

  ngOnInit() {
    // this.citieslist();
    this.name = this.activeroute.snapshot.params['name'];
    this.address_id = this.activeroute.snapshot.params['address_id'];
    this.address = this.activeroute.snapshot.params['address'];
    this.city = this.activeroute.snapshot.params['city'];
    this.pincode_link = this.activeroute.snapshot.params['pincode'];
    this.location = this.activeroute.snapshot.params['location'];
    this.landmark = this.activeroute.snapshot.params['landmark'];
    this.mobile = this.activeroute.snapshot.params['mobile'];
    this.address_type = this.activeroute.snapshot.params['address_type'];

    // this.areaslist();
    // this.subareaslist();
    // this.edit_address_form = this.formbuilder.group({
    //   name: new FormControl('', [Validators.required]),
    //   flat_no: new FormControl('', [Validators.required]),
    //   apt: new FormControl('', [Validators.required]),
    //   building_name: new FormControl('', [Validators.required]),
    //   street_address: new FormControl('', [Validators.required]),
    //   city_link: new FormControl('', [Validators.required]),
    //   pincode_link: new FormControl('', [Validators.required]),
    //   location: new FormControl('', [Validators.required]),
    //   sub_location: new FormControl('', [Validators.required]),
    //   contact_no: new FormControl('', [Validators.required]),
    //   landmark: new FormControl('', [Validators.required]),
    // })
   // this.load_profile();

  }
  

  // async load_profile() {
  //   this.apiserv.get_address(this.address_id).subscribe(data => {
  //     // console.log(data);
  //     var response = data['response'][0];
  //     var name = response.name;
  //     if (response['status'] == 'Valid') {
  //       var address = response['address'][0];
  //       //  console.log(address);
  //       this.edit_address_form = this.formbuilder.group({
  //         name: new FormControl(address['name'], [Validators.required]),
  //         flat_no: new FormControl(address['flat_no'], [Validators.required]),
  //         apt: new FormControl(address['apt'], [Validators.required]),
  //         street_address: new FormControl(address['street_address'], [Validators.required]),
  //         city_link: new FormControl(address['city_link'], [Validators.required]),
  //         pincode_link: new FormControl(address['pincode_link'], [Validators.required]),
  //         location: new FormControl(address['location'], [Validators.required]),
  //         sub_location: new FormControl(address['sub_location'], [Validators.required]),
  //         contact_no: new FormControl(address['mobile'], [Validators.required]),
  //         landmark: new FormControl(address['landmark'], [Validators.required]),

  //       })
  //     } else {
  //       this.utilserv.presentToast(data['message'], 'danger');
  //     }
  //   })
  // }

  async AddressSubmit(updateadressForm) {
   // let updateadressForm = this.edit_address_form.value;
   var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
   var pattern = /^[0-9]*$/;
   var no_pattern=/^[5-9][0-9]{9}$/;
   var name_reg=/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
   var white_space=/^(\s+\S+\s*)*(?!\s).*$/;
    if (updateadressForm.name == "" || updateadressForm.name == undefined) {
      this.utilserv.presentAlert('Enter Name');
      return;
    }
    if(name_reg.test(updateadressForm.name) == false){
      this.utilserv.presentAlert('Name Only Accept Characters');
      return;
    }
    if (this.address == "" || this.address == undefined) {
      this.utilserv.presentAlert('Enter address');
      return;
    }
    if(white_space.test(this.address ) == false){
      this.utilserv.presentAlert('Please enter valid address');
      return;
    }
    if(updateadressForm.landmark){
      if(white_space.test(updateadressForm.landmark) == false){
        this.utilserv.presentAlert('Please enter valid landmark');
        return;
      }
    }
    if (this.city == "" || this.city == undefined) {
      this.utilserv.presentAlert('Enter City');
      return;
    }
    if(name_reg.test(this.city) == false){
      this.utilserv.presentAlert('City Only Accept Characters');
      return;
    }

    if (this.pincode_link == "" || this.pincode_link == undefined) {
      this.utilserv.presentAlert('Enter Pincode');
      return;
    }

    if (this.pincode_link.toString().length != 6) {
      this.utilserv.presentAlert('Enter 6 digit valid pincode');
      return;
    }
    if(updateadressForm.location){
      if(white_space.test(updateadressForm.location) == false){
        this.utilserv.presentAlert('Please enter valid location');
        return;
      }
    }

    // if (updateadressForm.mobile == "" || updateadressForm.mobile == undefined) {
    //   this.utilserv.presentAlert('Enter Mobile');
    //   return;
    // }

    // if (updateadressForm.mobile.toString().length > 10 || updateadressForm.mobile.toString().length < 10) {
    //   this.utilserv.presentAlert('Enter Valid Mobile');
    //   return;
    // }
    if (updateadressForm.mobile == "" || updateadressForm.mobile == undefined) {
      this.utilserv.presentAlert('Enter mobile number');
      return;
    }
    if (pattern.test(updateadressForm.mobile) == false) {
      this.utilserv.presentAlert('Enter valid mobile number');
      return;
    }
    if (no_pattern.test(updateadressForm.mobile) == false) {
      this.utilserv.presentAlert('Enter valid mobile number');
      return;
    }
    if (updateadressForm.mobile.toString().length != 10) {
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
    this.apiserv.editaddress(
      this.user_id,
      this.address_id,
      updateadressForm.name,
      this.address,
      this.city,
      this.pincode_link,
      updateadressForm.location,
      updateadressForm.mobile,
      updateadressForm.landmark,
      this.userlat,
      this.userlang,
      this.address_type
    ).subscribe(function (data) {
      console.log(JSON.stringify(data));
      var response = data['response'][0];
      loading.dismiss();
      if (response['status'] == 'Valid') {
        // that.utilserv.presentToast(response['message'], 'success');
        // this.router.navigate(['addressbook']);
        // setTimeout(() => {
          that.navctrl.navigateForward('/addressbook');
        // }, 1000);
      } else {
        that.utilserv.presentAlert(response['message']);
      }
    },
      err => {
        this.utilserv.dismissLoading();
        loading.dismiss();
        this.utilserv.presentAlert('No Network');
      })
  }
  citieslist() {
    this.apiserv.getcities().subscribe(data => {
      var response = data['response'][0];
      //  console.log(response);
      if (response['status'] == 'Valid') {
        this.cities = response['cities'];
        if(this.city){
          for(var i=0;i<this.cities.length;i++){
            if(this.cities[i].city==this.city){
              this.city=this.cities[i].id;
              this.cityId=this.cities[i].id;
              this.pincodeslist();
            }
          }
        }
        console.log(this.cities);
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
        this.pincodeslist();
      }
    }
   
  }


  pincodeslist() {
    this.apiserv.getPincodes(this.cityId).subscribe(data => {
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.pincodes = response['pincodes'];
        if(this.pincode_link){
          for(var i=0;i<this.pincodes.length;i++){
            if(this.pincodes[i].pincode==this.pincode_link){
              this.pincode_link=this.pincodes[i].entry_id;
            }
          }
        }
        console.log(this.pincodes);
      }
    })
  }
  selectpincode(event) {
    this.pincodeId = event.target.value;
    // this.areaslist();
  }

//   async getCurrentCoordinates() { 
    
//     this.getLoader();
//    console.log('loading');
//    this.geolocation.getCurrentPosition().then((resp) => {
//     //  loading.dismiss(); 
//      console.log(resp);
//      this.userlat = resp.coords.latitude;
//      this.userlang = resp.coords.longitude;      
//    }).catch((error) => {
//      console.log('Error getting location', error);
//    });
//  }

 async getAddress() {
  this.checkLocationEnabled();
  this.geolocation.getCurrentPosition().then((resp) => {
    //  loading.dismiss(); 
     console.log(resp);
     this.userlat = resp.coords.latitude;
     this.userlang = resp.coords.longitude;      

     this.nativeGeocoder.reverseGeocode(this.userlat, this.userlang)
     .then((res: NativeGeocoderResult[]) => {
       var address = res[0].thoroughfare + "," + res[0].subLocality + "," + res[0].locality + "," + res[0].subAdministrativeArea + "," + res[0].administrativeArea + "," + res[0].countryName + "," + res[0].postalCode;
       this.currentlocation = address;
       this.address = address;
       console.log(this.currentlocation);
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

  // areaslist() {
  //   this.apiserv.getareas(this.pincodeId).subscribe(data => {
  //     var response = data['response'][0];
  //     console.log(response);
  //     if (response['status'] == 'Valid') {
  //       this.areas = response['areas'];
  //       // console.log(this.pincodes);
  //     }
  //   })
  // }

  // selectarea(event) {
  //   this.areaId = event.target.value;
  //   this.subareaslist();
  // }

  // subareaslist() {
  //   this.apiserv.getsubareas(this.pincodeId).subscribe(data => {
  //     var response = data['response'][0];
  //     console.log(response);
  //     if (response['status'] == 'Valid') {
  //       this.subareas = response['sub_areas'];
  //       // console.log(this.pincodes);
  //     }
  //   })
  // }

  // selectsubarea(event) {
  //   this.subareaId = event.target.value;
  // }
}
