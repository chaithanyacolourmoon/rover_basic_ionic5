import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ModalController, NavController, Platform } from '@ionic/angular';
import { SelectlocationComponent } from '../modals/selectlocation/selectlocation.component';
import { ApiService } from '../services/api.service';
import { EventsService } from '../services/events.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  cities: any = [];
  cityId: any;
  constructor(private apiserv: ApiService,
    public utilserv: UtilityService,
    private events: EventsService,
    private route: Router,
    private navctrl: NavController,
    private modalCtrl:ModalController,
    private menuCtrl:MenuController) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.menuCtrl.enable(false);
    this.getcities();
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

  selectcity(event) {
    this.cityId = event.target.value;
    console.log(this.cityId);
    for (var i = 0; i < this.cities.length; i++) {
      if (this.cities[i].id == this.cityId) {
        var cityname = this.cities[i].city;
        localStorage.setItem('City', cityname);
        localStorage.setItem('city_id', this.cityId);
        this.events.publishSettingsData({
          City: cityname
        });
      }
    }
  }

  getstart() {
    if (this.cityId == '' || this.cityId == null) {
      this.utilserv.presentAlert('Please select city');
      return;
    }
    this.updateCity();
    setTimeout(() => {
      this.route.navigate(['home'])
    }, 10);
  }

  goMap(){
    this.route.navigate(['maplocation']);
  }

  async goCities() {
    let that = this;
    const modal = await this.modalCtrl.create({
      component: SelectlocationComponent,
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then(function(res){
      console.log(res);
      if(res.role=='backdrop'){
        that.route.navigate(['location']);
      }
      else if(res.role!='backdrop'){
        if(res.data.action == 'close'){
          var cityId=res.data.type;
          if (cityId == '' || cityId == null) {
            that.utilserv.presentAlert('Please select city');
            return;
          }
          else{
            console.log(that.cities);
            for (var i = 0; i < that.cities.length; i++) {
              if (that.cities[i].id == cityId) {
                var cityname = that.cities[i].city;
                localStorage.setItem('City', cityname);
                localStorage.setItem('city_id', cityId);
                that.events.publishSettingsData({
                  City: cityname
                });
              }
            }
            localStorage.removeItem('mapLocation');
            that.updateCity();
            setTimeout(() => {
              that.route.navigate(['home'])
            }, 10);
          }
      }
      
      
        
        
        // console.log(res.data.type);
        // that.bike_brand=res.data.type;
        // that.bike_brand_id=res.data.id;
        // that.data.bike_modal='';
        // that.getBikeModal();
      }
    })
    return await modal.present();
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
