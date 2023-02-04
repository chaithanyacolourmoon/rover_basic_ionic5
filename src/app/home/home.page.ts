import { BoundElementProperty } from '@angular/compiler';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, LoadingController, MenuController, NavController, Platform, PopoverController } from '@ionic/angular';
import { SidepopoverComponent } from '../modals/sidepopover/sidepopover.component';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  city_id: any;
  banners: any;
  categories: any = [];
  hotlineproducts: any = [];
  cartCount: any;
  is_logged_in: any;
  sid: any;
  user_id:any;
  whatsapp_no:any;
  phone:any;

  slidesOptsHeader = {
    autoplay: true,
    speed: 400,
    spaceBetween: 8,
    slidesPerView: 3,
    pager: false,
  };

  slideOpts = {
    initialSlide: 0,
    speed: 800,
    autoplay: true,
    slidesPerView: 1.2,
    pager: false,
    spaceBetween: 15,
    // centeredSlides: true,

  };

  slideOpts1 = {
    initialSlide: 1,
    speed: 400,
    slidesPerView: 2.2,
    autoplay: true,
    pager: false,
    spaceBetween: 10,
    pagination: false
  };
  banercategories: any;
  categoryname: any;
  scategoryname: any;
  currentcity:any;
  homeActive:boolean=true;
  categoryActive:boolean=false;
  favouriteActive:boolean=false;
  ordersActive:boolean=false;
  notificationActive:boolean=false;
  selectId:any;
  product_id:any;
  selectIdd:any;
  earliest:any;
  add_id:any;
  languages_titles:any;
  notification_data:any;
  notification_count:any;
  ad_1:any;
  ad_2:any;
  ad_3:any;
  current_sub_index:any;
  no_icon:any;
  no_message:any;
  other_class:boolean=false;
  map_location:any;
  sub_show:any='false';
  constructor(private apiserv: ApiService,
    private navctrl: NavController,
    public utilserv: UtilityService,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private router: Router,
    private ref:ChangeDetectorRef,
    private menuCtrl:MenuController,
    public popoverController: PopoverController) {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.sid = localStorage.getItem('sid');
    this.user_id = localStorage.getItem('user_id');
    this.map_location=localStorage.getItem('mapLocation');
    this.other_class=false;
    this.is_logged_in = localStorage.getItem('is_logged_in');
    this.city_id = localStorage.getItem('city_id');  
    this.currentcity = localStorage.getItem('City');
    this.favouriteActive=false;
    this.homeActive=true;
    this.categoryActive=false;
    this.ordersActive=false;
    this.notificationActive=false;
    this.getcontact();
     this.ref.detectChanges();
    if(this.user_id){
      this.utilserv.getWallet();
      if(this.utilserv.setting_data.subscription=='Yes'){
        this.getSubscription();
      }
    }
    
   
    this.getbanners();
    this.homecategoriesList();
    this.hotlinesales();
    this.cartcount();
    this.getEarliestDelivery();
    // this.getLanguageTitles();
    this.getAppAdds();
    this.getNotificationCount();
    this.utilserv.getLanguageTitles();
    this.utilserv.getSettings();
    this.utilserv.getAppColour();
    
    
  }

  ngOnInit() {
    
  }

  getAppAdds(){
    this.apiserv.getAppads(this.city_id,'App Home 1 - 350X150').subscribe(data => {
      var response = data['response'][0];
      //   this.dismissLoading();

      if (response['status'] == 'Valid') {
        this.ad_1 = response['banners'];
        // console.log(this.banners);
      }
      this.getAppAdds2();
    })
  }

  getSubscription(){
    this.apiserv.getSubscription(this.user_id).subscribe(data => {
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.sub_show='true';
      }
      else{
        this.sub_show='false';
      }
    },(err)=>{
      this.utilserv.presentAlert("Network Error");
    })
  }

  getAppAdds2(){
    this.apiserv.getAppads(this.city_id,'App Home 2 - 350X150').subscribe(data => {
      var response = data['response'][0];
      //   this.dismissLoading();

      if (response['status'] == 'Valid') {
        this.ad_2 = response['banners'];
        // console.log(this.banners);
      }
      this.getAppAdds3();
    })
  }

  getAppAdds3(){
    this.apiserv.getAppads(this.city_id,'App Home 3 - 350X150').subscribe(data => {
      var response = data['response'][0];
      //   this.dismissLoading();

      if (response['status'] == 'Valid') {
        this.ad_3 = response['banners'];
        // console.log(this.banners);
      }
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

  async getbanners() {
    this.apiserv.homebanners(this.city_id).subscribe(data => {
      var response = data['response'][0];
      //   this.dismissLoading();

      if (response['status'] == 'Valid') {
        if(response['banners']){
          this.banners = response['banners'];
        }
        else{
          this.banners=[];
        }
        
        // console.log(this.banners);
      }
    })
  }

  async getEarliestDelivery() {
    this.apiserv.getEarliestDelivery().subscribe(data => {
      var response = data['response'][0];
      //   this.dismissLoading();

      if (response['status'] == 'Valid') {
        this.earliest = response;
        console.log(this.earliest);
      }
    })
  }

  async presentPopover(ev: any) {
    console.log(this.user_id);
    if(this.user_id==''||this.user_id==null){
      this.utilserv.presentToast('Please Login',"danger");
      return;
    }
    const popover = await this.popoverController.create({
      component: SidepopoverComponent,
      cssClass: 'popover-class',
      event: ev,
      translucent: true
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
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
      // return;
      this.apiserv.getCategories().subscribe(data => {
        console.log(data);
        var response = data['response'][0];
        loading.dismiss();
        this.categories = response['categories'];
      }, (err) => {
        loading.dismiss();
      });
  }

  goCategory(){
    this.router.navigate(['category']);
  }

  goBestSeller(){
    this.router.navigate(['bestseller']);
  }
  
  gotoProductList(product) {
    // console.log(product);
    if(product.sub_categories.length>1){
      this.router.navigate(['subcategory',{cat_id:product.id}]);
    }
    else{
      this.router.navigate(['/productlist', { banner: product.image, id: product.id, title: product.category }]);
    }
    // this.router.navigate(['/productlist', { banner: product.image, id: product.id, title: product.category }]);
  }

  // gotoPage(d) {
  //   console.log(d);
  //   this.apiserv.homecategories().subscribe(data => {
  //     var response = data['response'][0];
  //     // if (response['status'] == 'Valid') {
  //     this.banercategories = response['categories'];
  //     console.log(this.banercategories);
  //     for (var i = 0; i < this.banercategories.length; i++) {
  //       if (this.banercategories[i].id == d.category) {
  //         var scategoryData = this.banercategories[i];
  //         console.log(scategoryData);
  //         this.categoryname = this.banercategories[i].category;
  //         console.log(this.categoryname);
  //         console.log(this.banercategories[i].sub_categories);
  //         for (var j = 0; j < scategoryData.sub_categories.length; j++) {
  //           if (scategoryData.sub_categories[j].id == d.scategory) {
  //             this.scategoryname = scategoryData.sub_categories[j].sub_category;
  //             console.log(this.scategoryname);
  //           }
  //         }
  //       }
  //     }
  //   })

  //   if (d.target_type == 1) {
  //     setTimeout(() => {
  //       this.router.navigate(['tabs/shop', { category_id: d.category, category: this.categoryname }]);
  //       // this.navctrl.navigateForward('/categorylist/' + d.category_id + '/' + this.categoryname);
  //     }, 1000);
  //   } else if (d.target_type == 2) {
  //     setTimeout(() => {
  //       this.navctrl.navigateForward('/subcategorylist/' + d.category_id + '/' + d.sub_category_id + '/' + this.scategoryname);
  //     }, 1000);
  //   } else if (d.target_type == 3) {
  //     setTimeout(() => {
  //       this.navctrl.navigateForward('/productview/' + d.product);
  //     }, 1000);
  //   }
  // }

  viewProduct(pid) {
    this.router.navigate(['/productview/' + pid]);
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

  async show_loader() {
    // const loading = await this.loadingCtrl.create({
    //   spinner: 'crescent',
    //   message: 'Please wait...',
    //   translucent: true,
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
          
    // loading.present();
    return await loading.present();
  }

  dismissLoading() {
    this.loadingCtrl.dismiss();
  }

  goFacebook() {
    var fb = "https://www.facebook.com/";
    window.open(fb, "_system");
  }

  updateapp() {
    window.open("https://play.google.com/store/apps/details?id=com.rovor", "_system");
  }

  goInsta() {
    var insta = "https://www.instagram.com/accounts/login/";
    window.open(insta, "_system");
  }

  goWhatsapp() {
    var no = "https://wa.me/7981949319";
    window.open(no, "_system");
  }

  mailto() {
    let Link = "https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&sacu=1&rip=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin";
    window.open(Link, "_system");
  }

  hotlinesales() {
    // Hot Line
    var language_id=localStorage.getItem('language_id');
    var tag = 'Best Seller';
    var start = 0;
    var limit = 10;
    this.apiserv.hotline(tag, start, limit, this.city_id,language_id,this.sid,'Recent',this.user_id).subscribe(data => {
      var response = data['response'][0];
      if(response.total_products!=0){
        this.hotlineproducts = response['products'];
        this.hotlineproducts.forEach(element => {
          element['quantity'] = 0;
          console.log(element);
          if(element.other_language_name){
            this.other_class=true;
          }
        });
        
        console.log(this.hotlineproducts);
      }
      else{
        this.hotlineproducts=[];
        if(response['icon']){
          this.no_icon=response['icon'];
        }
        if(response['message']){
          this.no_message=response['message'];
        }
      }
      
    })
  }

  addtocartitem(product) {
    this.product_id = product['id'];
    if (this.user_id == '' || this.user_id == undefined || this.user_id == null) {
      // this.utilserv.presentToast('Please Login', 'danger');
      this.router.navigate(['login']);
      // setTimeout(() => {
      //   this.navctrl.navigateForward('/login');
      // }, 1000);
      return;
    } 
    else{
      if (product.quantity == 0 || product.quantity == null) {
        product.quantity = 1;
      }
      this.selectIdd=product.price[0].id;
      product.price[0].cart_qty++;
      this.apiserv.addtocart(this.product_id, product.price[0].id, this.sid, product.price[0].cart_qty,this.user_id).subscribe(data => {
        console.log(data);
        var response = data['response'][0];
        if (response['status'] == 'Valid') {
         this.cartcount();
          // this.getProductList();
          // this.utilserv.presentToast(response['message'], 'success');
        }
        else{
          product.price[0].cart_qty--;
          this.utilserv.presentAlert(response['message']);
        }
      })
    }
   
  }

  increase(cart_id, addid,selectIdd,item) {
    // alert("coming");
    this.add_id = addid;
    this.hotlineproducts.forEach(ob => {
      if (ob.id == cart_id) {
        ob.price[0].cart_qty = parseInt(ob.price[0].cart_qty) + 1;
        this.updatecartitem(ob.id, ob.price[0].cart_qty,selectIdd);
        // this.cartcount();
        // if(parseInt(ob.price[0].cart_qty)<parseInt(ob.cart_limit)){
        //   ob.price[0].cart_qty = parseInt(ob.price[0].cart_qty) + 1;
        //   this.updatecartitem(ob.id, ob.price[0].cart_qty,selectIdd);
        //   this.cartcount();
        // }
        // else{
        //   this.utilserv.presentAlert("You are able to add this product upto "+ob.cart_limit+" only!");
        // }
      }
    })
  }

  decrease(cart_id, addid,selectIdd,item) {
    
    this.add_id = addid;
    this.hotlineproducts.forEach((ob, index, object) => {
      if (ob.id == cart_id) {
        if (ob.price[0].cart_qty >= 1) {
          ob.price[0].cart_qty--;
          // this.addtocartitem(ob.quantity);
          this.updatecartitem(ob.id, ob.price[0].cart_qty,selectIdd);
          // this.cartcount();
        }
        // if (ob.quantity < 1) {
        //   object.splice(index, 1);
        // }
      }
    })
  }

  updatecartitem(cart_id, qty,selectIdd) {
    // alert("update");
    this.apiserv.addtocart(cart_id, selectIdd, this.sid, qty,this.user_id).subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.cartcount();
        if (this.add_id == '1') {
          console.log("Item has deleted from cart");
          // this.utilserv.presentToast("Item has deleted from cart", 'success');
        } else {
          console.log(response['message']);
          // this.utilserv.presentToast(response['message'], 'success');
        }
      }
      else{
        this.utilserv.presentAlert(response['message']);
        this.hotlinesales();
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

  goBanner(data){
    // console.log(data);
    
    if(this.user_id){
      if(data.target_type==1){
        if(data.category==0 || data.category==''){
          this.router.navigate(['category']);
        }
        else{
          this.router.navigate(['subcategory',{cat_id:data.category}]);
        }
        
      }else if(data.target_type==2){
        if((data.category!=0 || data.category!='') && (data.scategory==0 || data.scategory=='')){
          this.router.navigate(['subcategory',{cat_id:data.category}]);
        }
        else if(data.category && data.scategory){
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
        if(data.product!=0 || data.product==''){
          this.router.navigate(['/productview/' + data.product]);
        }
        
      }else if(data.target_type==4){
        this.router.navigate(['/specialtag',{tag: data.tag}]);
      }
    }
    else{
      this.router.navigate(['login']);
    }
   
  }

  buyNow(){
    var url='https://colourmoon.com/grocery-app-development-cm-groccy.php';
    window.open(url, "_blank");
  }

  goSubscription(){
    if (this.user_id == '' || this.user_id == undefined || this.user_id == null) {
      // this.utilserv.presentToast('Please Login', 'danger');
      this.router.navigate(['login']);
      // setTimeout(() => {
      //   this.navctrl.navigateForward('/login');
      // }, 1000);
      return;
    } 
    else{
      this.router.navigate(['mysubscription']);
    }
    
  }

  getcontact() {
    this.apiserv.getcontactus().subscribe(data => {
      console.log(data);
      var response = data['response'][0];     
      this.phone = response['phone'];      
      this.whatsapp_no =response['whatsapp_no'];

    })
  }
}
