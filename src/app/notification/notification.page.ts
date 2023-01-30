import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  homeActive:boolean=false;
  categoryActive:boolean=false;
  favouriteActive:boolean=false;
  ordersActive:boolean=false;
  notificationActive:boolean=true;
  user_id:any;
  notification_data:any;
  notification_count:any;
  no_icon:any;
  no_message:any;
  current_sub_index:any;
  constructor(private router:Router,public utilserv:UtilityService,
    private apiserv:ApiService) {
    this.user_id = localStorage.getItem('user_id');
   }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.favouriteActive=false;
    this.homeActive=false;
    this.categoryActive=false;
    this.ordersActive=false;
    this.notificationActive=true;
    this.getNotificationCount();
    this.getNotification();
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

  getNotification(){
    this.apiserv.getNotification(this.user_id).subscribe(data => {
      var response = data['response'][0];
      //   this.dismissLoading();
      if(response['icon']){
        this.no_icon=response['icon'];
      }
      if(response['message']){
        this.no_message=response['message'];
      }
      console.log(response);
      if (response['status'] == 'Valid') {
        if(response['notifications']){
          this.notification_data = response['notifications'];
        }
        else{
          this.notification_data=[];
        }
       
        // console.log(this.banners);
      }
    })
  }

  getNotificationCount(){
    this.apiserv.getNotificationCount(this.user_id).subscribe(data => {
      var response = data['response'][0];
      console.log(response['count']);
      this.notification_count=response['count'];
      localStorage.setItem("noti_count",this.notification_count);
    })
  }

  notiRead(noti_id,target_id){
    this.apiserv.readNotification(this.user_id,noti_id).subscribe(data => {
      var response = data['response'][0];
      //   this.dismissLoading();
      console.log(response);
      if (response['status'] == 'Valid') {
        this.getNotification();
        this.getNotificationCount();
        this.notification_data.forEach(element => {
          if(element.notification_id==noti_id){
            if(element.target=='Order'){
              this.router.navigate(['/orderdetail/'+target_id]);
            }
            else if(element.target==1){
              if(element.category=='0'){
                this.router.navigate(['category']);
              }
              else{
                this.router.navigate(['subcategory',{cat_id:element.category}]);
              }
              
            }else if(element.target==2){
              if(element.scategory=='0'){
                this.router.navigate(['subcategory',{cat_id:element.category}]);
              }
              else{
                console.log(this.utilserv.categories);
                var product;
                for(var i=0;i<this.utilserv.categories.length;i++){
                  if(element.category==this.utilserv.categories[i].id){
                    product=this.utilserv.categories[i];
                    console.log(product.sub_categories);
                    for(var j=0;j<product.sub_categories.length;j++){
                      console.log(element.scategory);
                      console.log(product.sub_categories[j].id);
                      if(element.scategory==product.sub_categories[j].id){
                        this.current_sub_index=j;
                      }
                    }
                  }
                }
                this.router.navigate(['/productlist', { banner: product.image, id: product.id, title: product.category,sub_category:element.scategory,current_index:this.current_sub_index }]);
              }
            }else if(element.target==3){
              console.log(element.product);
              if(element.product!='0'){
                this.router.navigate(['/productview/' + element.product]);
              }
              
            }else if(element.target==4){
              this.router.navigate(['/specialtag',{tag: element.tag}]);
            }
          }
        });
        // this.router.navigate(['/orderdetail/'+target_id]);
        // console.log(this.banners);
      }
    })

  }

}
