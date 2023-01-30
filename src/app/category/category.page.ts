import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  categories:any;
  homeActive:boolean=false;
  categoryActive:boolean=true;
  favouriteActive:boolean=false;
  ordersActive:boolean=false;
  notificationActive:boolean=false;
  user_id:any;
  notification_data:any;
  notification_count:any;
  no_icon:any;
  no_message:any;
  constructor(private loadingCtrl:LoadingController,private apiserv:ApiService,
    private router:Router,public utilserv:UtilityService) {
      this.user_id = localStorage.getItem('user_id');
      this.notification_count=localStorage.getItem("noti_count");
     }

  ngOnInit() {
    this.homecategoriesList();
  }

  ionViewWillEnter(){
    this.favouriteActive=false;
    this.homeActive=false;
    this.categoryActive=true;
    this.ordersActive=false;
    this.notificationActive=false;
  }
  getNotificationCount(){
    this.apiserv.getNotificationCount(this.user_id).subscribe(data => {
      var response = data['response'][0];
      console.log(response['count']);
      this.notification_count=response['count'];
    })
  }

  goOrdersTab(){
    this.homeActive=false;
    this.categoryActive=false;
    this.favouriteActive=false;
    this.ordersActive=true;
    this.notificationActive=false;
    if (this.user_id==''||this.user_id==null) {
      // this.utilserv.presentToast('Please Login',"danger");
      this.router.navigate(['login']);
      return;
      
    }else{
      this.router.navigate(['myorders']);
    }
  }

  goHomeTab(){
    this.homeActive=true;
    this.categoryActive=false;
    this.favouriteActive=false;
    this.ordersActive=false;
    this.notificationActive=false;
    this.router.navigate(['home']);
  }

  goNotificationTab(){
    this.homeActive=false;
    this.categoryActive=false;
    this.favouriteActive=false;
    this.ordersActive=false;
    this.notificationActive=true;
    this.router.navigate(['notification']);
  }
  
  goCategoryTab(){
    this.homeActive=false;
    this.categoryActive=true;
    this.favouriteActive=false;
    this.ordersActive=false;
    this.notificationActive=false;
    this.router.navigate(['category']);
  }
  goFavouriteTab(){
    this.homeActive=false;
    this.categoryActive=false;
    this.favouriteActive=true;
    this.ordersActive=false;
    this.notificationActive=false;
    if(this.user_id==''||this.user_id==null){
      // this.utilserv.presentToast('Please Login',"danger");
      this.router.navigate(['login']);
      return;
    }
    this.router.navigate(['wishlist']);
  }

  async homecategoriesList() {
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
    this.apiserv.getCategories().subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      loading.dismiss();
      if(response['icon']){
        this.no_icon=response['icon'];
      }
      if(response['message']){
        this.no_message=response['message'];
      }
      this.categories = response['categories'];
    },(err)=>{
      loading.dismiss();
    })
  }

  goSubCategory(category){
    console.log(category.sub_categories);
    if(category.sub_categories.length>1){
      this.router.navigate(['subcategory',{cat_id:category.id}]);
    }
    else{
      this.router.navigate(['/productlist', { banner: category.image, id: category.id, title: category.category }]);
    }
    
  }

}
