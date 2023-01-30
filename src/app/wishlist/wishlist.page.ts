import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { SelectquantityComponent } from '../modals/selectquantity/selectquantity.component';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
  user_id: any;
  wishlist: any;
  images: any = [];
  city_id: any;
  wishid:any;
  selectId:any;
  cartCount:any;
  product_id:any;
  selectIdd:any;
  sid:any;
  add_id:any;
  homeActive:boolean=false;
  categoryActive:boolean=false;
  favouriteActive:boolean=true;
  ordersActive:boolean=false;
  notificationActive:boolean=false;
  notification_data:any;
  notification_count:any;
  no_message:any;
  no_icon:any;

  constructor(private apiserv: ApiService,
    public utilserv: UtilityService,private modalctrl:ModalController,
    private router: Router,private navctrl:NavController,
    private loadingCtrl:LoadingController) {
    this.user_id = localStorage.getItem('user_id');
    this.city_id = localStorage.getItem('city_id');
    this.sid = localStorage.getItem('sid');
    this.notification_count=localStorage.getItem("noti_count");
  }

  ngOnInit() {
    // this.getwishlist();
  }

  ionViewWillEnter(){
    this.favouriteActive=true;
    this.homeActive=false;
    this.categoryActive=false;
    this.ordersActive=false;
    this.notificationActive=false;
    this.getwishlist();
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

  viewProduct(pid) {
    this.router.navigate(['/productview/' + pid]);
  }

  

  async getwishlist() {
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
    this.apiserv.userwishlist(this.user_id, this.city_id,this.sid).subscribe(data => {
      loading.dismiss();
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.wishlist = response['wishlist'];
        if(response['icon']){
          this.no_icon=response['icon'];
        }
        if(response['message']){
          this.no_message=response['message'];
        }
        console.log(this.wishlist);
        if(this.wishlist == null){
          this.wishlist=[];
          // this.utilserv.presentToast('No items Added in wishlist','danger');
        }
        else{
          this.wishlist.forEach(element => {
            this.images = element['product_details'];
            this.images[0]['quantity'] = 0;
            this.images[0]['selectedItem'] = this.images[0].price[0].id;
          });
        }
       
        console.log(this.wishlist);
      }
      else {
       
      }
    },(err)=>{
      loading.dismiss();
    })
  }

  async selcteQuantity(id,product_name,price_list,price_id) {
    console.log(product_name);
    console.log(price_list);
    console.log(price_id);
    if(price_list.length>1){
    let that = this;
    const modal = await this.modalctrl.create({
      component: SelectquantityComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'product_name': product_name,
        'price_list': price_list,
        'price': price_id
      }
    });
    modal.onDidDismiss().then(function(res){
      console.log(res);
      if(res.data.action == 'close'){
        that.selectId=res.data.type;
        console.log(id);
        console.log(that.wishlist);
        for(var i=0; i<that.wishlist.length;i++){
          for(var j=0;j<that.wishlist[i].product_details.length;j++){
            if(id==that.wishlist[i].product_details[j].product_id){
              that.wishlist[i].product_details[j].selectedItem=that.selectId;
            }
          }
          
        }
      }
    })
    return await modal.present();
  }
  else{

  }
  }


  deleteItem_fromWishlist(wishId){
    this.apiserv.deletefromwishlist(this.user_id,wishId).subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
      //  this.utilserv.presentToast(response['message'],'success');
       this.getwishlist();
      }else {
        this.utilserv.presentAlert(response['message']);
      }
    })
  }

  addtocartitem(product) {
    console.log(product);
    this.product_id = product['product_id'];
    if (this.user_id == '' || this.user_id == undefined || this.user_id == null) {
      // this.utilserv.presentToast('Please Login', 'danger');
      this.router.navigate(['login']);
      // setTimeout(() => {
      //   this.navctrl.navigateForward('/login');
      // }, 1000);
      // return;
    }  //need to uncomment after login functionality done
    else{
      if (product.quantity == 0 || product.quantity == null) {
        product.quantity = 1;
      }
  
      this.selectIdd=product.selectedItem;
      var cart_quantity='';
      this.selectIdd=product.selectedItem;
      for(var i=0;i<product.price.length;i++){
        if(this.selectIdd==product.price[i].id){
          product.price[i].cart_qty++;
          cart_quantity=product.price[i].cart_qty;
        }
      }
      // if (this.selectId == '' || this.selectId == null || this.selectId == undefined) {
      //   this.selectIdd = product.selectedItem;
      // } else {
      //   this.selectIdd = this.selectId;
      // }
  
      this.apiserv.addtocart(this.product_id, this.selectIdd, this.sid, cart_quantity,this.user_id).subscribe(data => {
        console.log(data);
        var response = data['response'][0];
        if (response['status'] == 'Valid') {
          this.cartcount();;
          // this.getProductList();
          // this.utilserv.presentToast(response['message'], 'success');
        }
        else{
          for(var i=0;i<product.price.length;i++){
            if(this.selectIdd==product.price[i].id){
              product.price[i].cart_qty--;
              cart_quantity=product.price[i].cart_qty;
            }
          }
          this.utilserv.presentAlert(response['message']);
        }
      })
    }
  }

  increase(cart_id, addid,product) {
    console.log(cart_id);
    console.log(addid);
    var select_quantity;
    this.selectIdd=product.selectedItem;
    for(var i=0;i<product.price.length;i++){
      if(product.selectedItem==product.price[i].id){
        product.price[i].cart_qty++;
        select_quantity=product.price[i].cart_qty;
        this.add_id = addid;
        this.wishlist.forEach(ob => {
          if (ob.product_details[0].product_id == cart_id) {
            // ob.product_details[0].quantity = parseInt(ob.product_details[0].quantity) + 1;
            // this.addtocartitem(ob.quantity);
            this.updatecartitem(ob.product_details[0].product_id, select_quantity);
            this.cartcount();
          }
        })
        // if(parseInt(product.price[i].cart_qty)<parseInt(product.cart_limit)){
        //   product.price[i].cart_qty++;
        //   select_quantity=product.price[i].cart_qty;
        //   this.add_id = addid;
        //   this.wishlist.forEach(ob => {
        //     if (ob.product_details[0].product_id == cart_id) {
        //       // ob.product_details[0].quantity = parseInt(ob.product_details[0].quantity) + 1;
        //       // this.addtocartitem(ob.quantity);
        //       this.updatecartitem(ob.product_details[0].product_id, select_quantity);
        //       this.cartcount();
        //     }
        //   })
        // }
        // else{
        //   this.utilserv.presentAlert("You are able to add this product upto "+product.cart_limit+" only!");
        // }
      }
    }
    
  }

  decrease(cart_id, addid,product) {
    var select_quantity;
    this.selectIdd=product.selectedItem;
    for(var i=0;i<product.price.length;i++){
      if(product.selectedItem==product.price[i].id){
        product.price[i].cart_qty--;
        select_quantity=product.price[i].cart_qty;
      }
    }
    this.add_id = addid;
    this.wishlist.forEach((ob, index, object) => {
      if (ob.product_details[0].product_id == cart_id) {
        // if (ob.product_details[0].quantity >= 1) {
        //   ob.product_details[0].quantity = parseInt(ob.product_details[0].quantity) - 1;
          // this.addtocartitem(ob.quantity);
          this.updatecartitem(ob.product_details[0].product_id, select_quantity);
          this.cartcount();;
        // }
        // if (ob.quantity < 1) {
        //   object.splice(index, 1);
        // }
      }
    })
  }

  updatecartitem(cart_id, qty) {
    this.apiserv.addtocart(cart_id, this.selectIdd, this.sid, qty,this.user_id).subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.cartcount();
        if (this.add_id == '1') {
          // this.utilserv.presentToast("Item has deleted from cart", 'success');
        } else {
          // this.utilserv.presentAlert(response['message']);
        }
      }
      else{
        this.utilserv.presentAlert(response['message']);
        this.getwishlist();
      }
    })
  }

  cartcount() {
    this.apiserv.cartcountdata(this.sid).subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.cartCount = response['count'];
      }
    })
  }
}
