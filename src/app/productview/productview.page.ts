import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-productview',
  templateUrl: './productview.page.html',
  styleUrls: ['./productview.page.scss'],
})
export class ProductviewPage implements OnInit {

  public prod_id;
  public sid;
  city_id: any;
  title: any;
  description: any;
  productimage: any;
  outofstockmessage: any;
  pricelist: any = [];
  pricesize: any;
  price: any;
  subscriptionplan: any;
  cart_quantity: any;
  productviews: any = [];
  cart_id: any;
  cartCount: any;
  size_id: any;
  id: any;
  user_id: any;
  reviews: any = [];
  selectId: any;
  price_id: any;
  sizes: any;
  selectprices: any;
  reviewscount: any;
  productdetail: any;
  in_wishlist: any;
  selectedItem: any;
  seg_active:any="details";
  add_id:any;
  benefits:any;
  slideOpts1 = {
    initialSlide: 0,
    speed: 800,
    autoplay: true,
    slidesPerView: 1,
    centeredSlides: true
  };
  
  hotlineproducts:any;
  slideOptsSeller = {
    initialSlide: 1,
    speed: 400,
    slidesPerView: 2.2,
    autoplay: true,
    pager: false,
    spaceBetween: 10,
    pagination: false
  };
  hot_product_id:any;
  selectIddhot:any;
  other_class:boolean=false;
  constructor(
    private apiserv: ApiService,
    private navctrl: NavController,
    public utilserv: UtilityService,
    private loadingCtrl: LoadingController,
    private activeroute: ActivatedRoute,
    private changeDet:ChangeDetectorRef,
    private router:Router) {
    this.prod_id = this.activeroute.snapshot.params['product_id'];
    // this.cart_id = this.activeroute.snapshot.params['cart_id'];
    this.user_id = localStorage.getItem('user_id');
    this.city_id = localStorage.getItem('city_id');
    this.sid = localStorage.getItem('sid');
  }

  ngOnInit() {
    
  }
  

  hotlinesales() {
    // Hot Line
    var language_id=localStorage.getItem('language_id');
    var tag = 'Best Seller';
    var start = 0;
    var limit = 10;
    this.apiserv.hotline(tag, start, limit, this.city_id,language_id,this.sid,'Recent',this.user_id).subscribe(data => {
      var response = data['response'][0];
      this.hotlineproducts = response['products'];
      this.hotlineproducts.forEach(element => {
        element['quantity'] = 0;
        if(element.other_language_name){
          this.other_class=true;
        }
      });
      console.log(this.hotlineproducts);
    })
  }

  async productview() {
    var language_id=localStorage.getItem('language_id');
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
    this.apiserv.getproductview(this.prod_id, this.sid, this.city_id,language_id,this.user_id).subscribe(data => {
      // console.log(data);
      var response = data['response'][0];
      this.productdetail = response;
      loading.dismiss();
      if (response['status'] == 'Valid') {
        this.productdetail.quantity = 0;
        this.cart_quantity = this.productdetail.quantity;
        this.selectedItem = this.productdetail.selectedItem;
        this.pricelist = response['prices'];
        this.sizes = this.pricelist[0]['id'];
        this.selectprices = this.pricelist[0]['price'];
        this.price_id = this.pricelist[0]['id'];
        this.cart_id = this.pricelist[0]['cart_id'];
        this.title = response['name'];
        this.id = response['id'];
        this.description = response['description'];
        this.benefits = response['benefits'];
        this.outofstockmessage = response['out_of_stock_message'];
        this.pricesize = this.pricelist['size'];
        this.size_id = this.pricelist[0]['id'];
        this.price = this.pricelist['price'];
        this.in_wishlist = response['in_wishlist'];
        this.productimage = response['images'];
        if(response['images']==null){
          this.productimage=[];
        }
        console.log(this.productimage);
      }
      console.log(this.productdetail);
    },(err)=>{
      loading.dismiss();
    })
  }

  SelectChange(event) {
    this.selectId = event.target.value;
    console.log(this.selectId);
    this.pricelist.forEach(ob => {
      if (ob.id == this.selectId) {
        this.selectId = ob.id;
        //   console.log(this.selectId);
      }
    })
  }
  ionViewWillEnter() {
    this.other_class=false;
    this.cartcount();
    this.productview();
    this.hotlinesales();
  }
  increase(addid) {
    var select_quantity;
    for(var i=0;i<this.productdetail.prices.length;i++){
      if(this.selectId==this.productdetail.prices[i].id){
        this.productdetail.prices[i].cart_qty++;
          select_quantity=this.productdetail.prices[i].cart_qty;
          this.add_id=addid;
          // this.cart_quantity = parseInt(this.cart_quantity) + 1;
          this.updatecartitem(select_quantity);
          this.cartcount();
        // if(parseInt(this.productdetail.prices[i].cart_qty)<parseInt(this.productdetail.cart_limit)){
        //   this.productdetail.prices[i].cart_qty++;
        //   select_quantity=this.productdetail.prices[i].cart_qty;
        //   this.add_id=addid;
        //   // this.cart_quantity = parseInt(this.cart_quantity) + 1;
        //   this.updatecartitem(select_quantity);
        //   this.cartcount();
        // }
        // else{
        //   this.utilserv.presentAlert("You are able to add this product upto "+this.productdetail.cart_limit+" only!");
        // }
      }
    }
    
  }

  decrease(addid) {
    var select_quantity;
    for(var i=0;i<this.productdetail.prices.length;i++){
      if(this.selectId==this.productdetail.prices[i].id){
        this.productdetail.prices[i].cart_qty--;
        select_quantity=this.productdetail.prices[i].cart_qty;
      }
    }
    this.add_id=addid;
    // this.cart_quantity = parseInt(this.cart_quantity) - 1;
    this.updatecartitem(select_quantity);
    this.cartcount();;
  }

  segmentChanged(event){
    this.seg_active=event.detail.value;
  }

  addtocartitem() {
    if (this.user_id == '' || this.user_id == undefined || this.user_id == null) {
      // this.utilserv.presentToast('Please Login', 'danger');
      this.router.navigate(['login']);
      // setTimeout(() => {
      //   this.navctrl.navigateForward('/login');
      // }, 2000);
      // return;
    }
    else{
      if (this.cart_quantity == 0 || this.cart_quantity == null) {
        this.cart_quantity = 1;
      }
      if (this.selectId == '' || this.selectId == null) {
        this.selectId = this.size_id;
      } else {
        this.selectId = this.selectId;
      }
      var select_quantity;
      for(var i=0;i<this.productdetail.prices.length;i++){
        if(this.selectId==this.productdetail.prices[i].id){
          this.productdetail.prices[i].cart_qty++;
          select_quantity=this.productdetail.prices[i].cart_qty;
        }
      }
      this.apiserv.addtocart(this.prod_id, this.selectId, this.sid, select_quantity,this.user_id).subscribe(data => {
        console.log(data);
        var response = data['response'][0];
        if (response['status'] == 'Valid') {
          this.cartcount();
          this.hotlineproducts.forEach(element => {
            if(this.prod_id==element.id){
              this.hotlinesales();
            }
          });
        }
        else{
          for(var i=0;i<this.productdetail.prices.length;i++){
            if(this.selectId==this.productdetail.prices[i].id){
              this.productdetail.prices[i].cart_qty--;
              select_quantity=this.productdetail.prices[i].cart_qty;
            }
          }
          this.utilserv.presentAlert(response['message']);
        }
      })
    }
  }

  updatecartitem(qty) {
    this.apiserv.addtocart(this.prod_id, this.size_id, this.sid, qty,this.user_id).subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.cartcount();
        if(this.add_id=='1'){
          // this.utilserv.presentToast("Item has deleted from cart", 'success');
        }else{
          // this.utilserv.presentAlert(response['message']);
        }
        this.hotlineproducts.forEach(element => {
          if(this.prod_id==element.id){
            this.hotlinesales();
          }
        });
        
      }
      else{
        this.utilserv.presentAlert(response['message']);
        this.productview();
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

  Add_to_Wishlist(wishlist) {
    // this.utilserv.show_loader();
    if (this.user_id == '' || this.user_id == undefined) {
      // this.utilserv.presentToast('Please Login', 'danger');
      return;
    }
    this.in_wishlist = wishlist == 'Yes' ? 'No' : 'Yes';

    if (wishlist == 'No') {
      this.apiserv.addtowishlist(this.user_id, this.prod_id).subscribe(server_response => {
        var response = server_response['response'][0];
        // this.utilserv.dismissLoading();        
        if (response['status'] == 'Valid') {
          this.productview();
          this.hotlinesales();
          this.changeDet.detectChanges();
          // this.utilserv.presentToast(response['message'], 'success');
        }
      })
    } else if (wishlist == "Yes") {
      this.apiserv.addtowishlist(this.user_id, this.prod_id).subscribe(server_response => {
        var response = server_response['response'][0];
        // this.utilserv.dismissLoading();
        if (response['status'] == 'Valid') {
          this.productview();
          this.hotlinesales();
          this.changeDet.detectChanges();
          // this.utilserv.presentToast(response['message'], 'success');
        }
      },
        err => {
          this.utilserv.dismissLoading();
          this.utilserv.presentAlert('No Network');
        })

    }

  }

  addtocarthot(product) {
    this.hot_product_id = product['id'];
    if (this.user_id == '' || this.user_id == undefined || this.user_id == null) {
      // this.utilserv.presentToast('Please Login', 'danger');
      this.router.navigate(['login']);
      // setTimeout(() => {
      //   this.navctrl.navigateForward('/login');
      // }, 1000);
      // return;
    } 
    if (product.quantity == 0 || product.quantity == null) {
      product.quantity = 1;
    }
    this.selectIddhot=product.price[0].id;
    product.price[0].cart_qty++;
    this.apiserv.addtocart(this.hot_product_id, product.price[0].id, this.sid, product.price[0].cart_qty,this.user_id).subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.cartcount();
        this.hotlineproducts.forEach(element => {
          if(this.prod_id==element.id){
            this.productview();
          }
        });
      }
      else{
        product.price[0].cart_qty--;
        this.utilserv.presentAlert(response['message']);
      }
    })
  }


  increasehot(cart_id, addid,selectIddhot) {
    // alert("coming");
    this.add_id = addid;
    this.hotlineproducts.forEach(ob => {
      if (ob.id == cart_id) {
        ob.price[0].cart_qty = parseInt(ob.price[0].cart_qty) + 1;
        this.updatecarthot(ob.id, ob.price[0].cart_qty,selectIddhot);
        this.cartcount();
        // if(parseInt(ob.price[0].cart_qty)<parseInt(ob.cart_limit)){
        //   ob.price[0].cart_qty = parseInt(ob.price[0].cart_qty) + 1;
        //   this.updatecarthot(ob.id, ob.price[0].cart_qty,selectIddhot);
        //   this.cartcount();
        // }
        // else{
        //   this.utilserv.presentAlert("You are able to add this product upto "+ob.cart_limit+" only!");
        // }
      }
    })
  }

  decreasehot(cart_id, addid,selectIddhot) {
    // alert("coming");
    console.log(cart_id);
    this.add_id = addid;
    this.hotlineproducts.forEach((ob, index, object) => {
      if (ob.id == cart_id) {
        if (ob.price[0].cart_qty >= 1) {
          ob.price[0].cart_qty--;
          // this.addtocartitem(ob.quantity);
          this.updatecarthot(ob.id, ob.price[0].cart_qty,selectIddhot);
          this.cartcount();
        }
        // if (ob.quantity < 1) {
        //   object.splice(index, 1);
        // }
      }
    })
  }

  updatecarthot(cart_id, qty,selectIddhot) {
    // alert("update");
    this.apiserv.addtocart(cart_id, selectIddhot, this.sid, qty,this.user_id).subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.cartcount();
        if (this.add_id == '1') {
          // this.utilserv.presentToast("Item has deleted from cart", 'success');
        } else {
          // this.utilserv.presentAlert(response['message']);
        }
        this.hotlineproducts.forEach(element => {
          if(this.prod_id==element.id){
            this.productview();
          }
        });
      }
      else{
        this.utilserv.presentAlert(response['message']);
        this.hotlinesales();
      }
    })
  }

  viewProduct(pid) {
    this.router.navigate(['/productview/' + pid]);
  }
}
