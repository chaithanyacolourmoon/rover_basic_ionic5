import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { SortComponent } from '../modals/sort/sort.component';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { SelectquantityComponent } from '../modals/selectquantity/selectquantity.component';
import { FilterComponent } from '../modals/filter/filter.component';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.page.html',
  styleUrls: ['./productlist.page.scss'],
})
export class ProductlistPage implements OnInit {
  apirequest:any;
  current_segment_id: any;
  sid: any;
  user_id: any;
  category_id: any;
  categorieslist: any = [];
  banner: any;
  quantity: any;
  cat_id: any;
  cat_name: any;
  city_id: any;
  products: any;
  selectId: any;
  selectedprice: any;
  selectIdd: any;
  selectquantity: any;
  totalproduct: any;
  product_id: any;
  entry_id: any;
  cartCount: any;
  itemsarray: any = [];
  totalproductscount: any=0;
  sub_cat: any;
  public sort_type = 'Recent';
  title: any;
  start: number = 0;
  limit: number = 10;
  result: any = [];
  add_id: any;
  no_message:any;
  no_icon:any;
  current_index:any;
  sort_value:any;
  brand:any;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(private apiserv: ApiService,
    public utilserv: UtilityService,
    private navctrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private cd: ChangeDetectorRef,
    private zone: NgZone,
    private modalctrl: ModalController,
    private activeroute: ActivatedRoute) {
    this.sid = localStorage.getItem('sid');
    this.user_id = localStorage.getItem('user_id');
    this.city_id = localStorage.getItem('city_id');
    this.banner = this.activeroute.snapshot.paramMap.get('banner');
    this.cat_id = this.activeroute.snapshot.paramMap.get('id');
    this.cat_name = this.activeroute.snapshot.paramMap.get('title');
    this.sub_cat = this.activeroute.snapshot.paramMap.get('sub_category');
    this.current_index = this.activeroute.snapshot.paramMap.get('current_index');
    this.sid = localStorage.getItem('sid');
    //this.current_segment_id = this.cat_id;

  }

  async segmentChanged(event,index) {
    this.brand='';
    this.sort_type = 'Recent';
    this.sort_value='';
    console.log(index);
    this.current_segment_id = event.entry_id;
    this.totalproductscount='';
    this.title = event.category;
    console.log(this.current_segment_id);
    this.current_index=index;
    console.log(this.current_index);
    document.getElementById("segment-" + this.current_index).scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  });
    // this.products = [];
    this.getProductList();
  }
  ionViewWillEnter() {
    this.subcategory();
    this.cartcount();;
    // this.products = [];
    console.log(this.sub_cat);
    if (this.sub_cat) {
      this.current_segment_id = this.sub_cat;
    }
  }

  ngOnInit() {
   
  }

  subcategory() {
    this.apiserv.subcategoriesList(this.cat_id).subscribe(data => {
      var response = data['response'][0];
      this.categorieslist = response['sub_categories'];
      if(response['icon']){
        this.no_icon=response['icon'];
      }
      if(response['message']){
        this.no_message=response['message'];
      }
      this.title = this.categorieslist[0].category;
      this.entry_id = this.categorieslist[0].entry_id;
      if (this.sub_cat) {
        this.current_segment_id = this.sub_cat;
        if(this.current_index){
          setTimeout(() => {
            document.getElementById("segment-" + this.current_index).scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            });
          }, 500);
        }
      } else {
        this.current_segment_id = this.entry_id;
      }

      this.getProductList()
    })
  }

  async sortmodal() {
    const modal = await this.modalctrl.create({
      component: SortComponent,
      cssClass: 'custom-filter-modal',
      componentProps: {
        'sort_value': this.sort_value,
      }
    });
    let that = this;
    modal.onDidDismiss().then(function (res) {
      that.sort_value = res.data.sort_type
      that.sort_type = res.data.sort_type;
      //  that.sort_first = true;
      // this.products=[];
      that.getProductList();

    })
    modal.present();
  }

  async filtermodal() {
    const modal = await this.modalctrl.create({
      component: FilterComponent,
      cssClass: 'custom-filter-modal',
      componentProps: {
        'catId': this.current_segment_id,
        'selected_value':this.brand
      }
    });
    let that = this;
    modal.onDidDismiss().then(function (res) {
      console.log(res);
      if(res.role=="backdrop"){
        // modal.dismiss();
        that.router.navigate(['/productlist', { banner: that.banner, id: that.cat_id, title: that.cat_name }]);
      }
      else{
        var myArray=[];
        myArray=res.data.json_data;
        if(myArray.length>0){
          that.brand = myArray.join(",");
          that.getProductList();
        }
        else{
          that.brand='';
          that.getProductList();
        }
      }
      
      

    })
    modal.present();
   
  }

  async getProductList() {
    this.products = [];
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
    this.start = 0;
    this.limit = 10;
    this.apiserv.getproducts(this.cat_id, this.current_segment_id, this.sid, this.city_id, this.start, this.limit, this.sort_type,language_id,this.user_id,this.brand).subscribe(data => {

      var response = data['response'][0];
      loading.dismiss();
      if (response['status'] == 'Valid') {
        this.result = response['products'];
        if(response['icon']){
          this.no_icon=response['icon'];
        }
        if(response['message']){
          this.no_message=response['message'];
        }
        this.totalproductscount = response['total_products'];
        if(this.totalproductscount==0){
          this.apirequest='true';
        }else{
          this.result.forEach(element => {
            element['quantity'] = 0;
            element['selectedItem'] = element.price[0].id;
          });
          this.zone.run(() => {
            const newData = this.result;
            for (let i = 0; i < newData.length; i++) {
              this.products.push(newData[i]);
              //   console.log(newData);
            }
            this.cd.detectChanges();
          })
          this.infiniteScroll.complete();
          if (this.totalproductscount <= this.limit) {
            this.infiniteScroll.disabled = true;
          }
          console.log(this.products);
        }
        //  console.log(this.products);
        
      } else {
        // this.products = [];
      }

    },(err)=>{
      loading.dismiss();
    })
  }
  async loadmoreproducts(event) {
    var language_id=localStorage.getItem('language_id');
    this.start = (this.start + this.limit);
    this.apiserv.getproducts(this.cat_id, this.current_segment_id, this.sid, this.city_id, this.start, this.limit, this.sort_type,language_id,this.user_id,this.brand).subscribe(data => {

      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.result = response['products'];
        this.totalproductscount = response['total_products'];
        //  console.log(this.products);
        if(this.totalproductscount==0){
          this.apirequest='true';
        }else{
          this.result.forEach(element => {
            element['quantity'] = 0;
            element['selectedItem'] = element.price[0].id;
          });
          this.zone.run(() => {
            const newData = this.result;
            for (let i = 0; i < newData.length; i++) {
              this.products.push(newData[i]);
              //   console.log(newData);
            }
            this.cd.detectChanges();
          })
          this.infiniteScroll.complete();
          if (this.totalproductscount <= this.limit) {
            this.infiniteScroll.disabled = true;
          }
          console.log(this.products);
        }
      } else {
        // this.products = [];
      }

    })
  }


  SelectChange(event, product) {
    this.selectId = event.target.value;
    console.log(this.selectId);
    // console.log(product.quantity);
    // product.quantity=0;
  }

  increase(cart_id, addid,product) {
    var select_quantity;
    this.selectIdd=product.selectedItem;
    for(var i=0;i<product.price.length;i++){
      if(product.selectedItem==product.price[i].id){
          product.price[i].cart_qty++;
          select_quantity=product.price[i].cart_qty;
          this.add_id = addid;
          this.products.forEach(ob => {
            if (ob.id == cart_id) {
              // ob.quantity = parseInt(ob.quantity) + 1;
              // this.addtocartitem(ob.quantity);
              this.updatecartitem(ob.id, select_quantity);
              // this.cartcount();
            }
          })
        // if(parseInt(product.price[i].cart_qty)<parseInt(product.cart_limit)){
        //   product.price[i].cart_qty++;
        //   select_quantity=product.price[i].cart_qty;
        //   this.add_id = addid;
        //   this.products.forEach(ob => {
        //     if (ob.id == cart_id) {
        //       // ob.quantity = parseInt(ob.quantity) + 1;
        //       // this.addtocartitem(ob.quantity);
        //       this.updatecartitem(ob.id, select_quantity);
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
    this.products.forEach((ob, index, object) => {
      if (ob.id == cart_id) {
        // if (ob.quantity >= 1) {
        //   ob.quantity = parseInt(ob.quantity) - 1;
          // this.addtocartitem(ob.quantity);
          this.updatecartitem(ob.id,select_quantity);
          // this.cartcount();;
        // }
        // if (ob.quantity < 1) {
        //   object.splice(index, 1);
        // }
      }
    })
  }

  addtocartitem(product) {
    console.log(product);
    this.product_id = product['id'];
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
      console.log(product.selectedItem);
      
      this.selectIdd=product.selectedItem;
      // if (this.selectId == '' || this.selectId == null || this.selectId == undefined) {
      //   this.selectIdd = product.selectedItem;
      // } else {
      //   this.selectIdd = this.selectId;
      // }
      var cart_quantity='';
      console.log(this.selectIdd);
      for(var i=0;i<product.price.length;i++){
        if(this.selectIdd==product.price[i].id){
          product.price[i].cart_qty++;
          cart_quantity=product.price[i].cart_qty;
        }
      }
      console.log(product);
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
        this.getProductList();
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

  viewProduct(pid) {
    // if (cart_id == null) {
    //   this.cart_idd = 0;
    // } else {
    //   this.cart_idd = cart_id;
    // }
    this.router.navigate(['/productview/' + pid]);
  }


  Add_to_Wishlist(wishlist, product_id) {
    // this.utilserv.show_loader();
    if (this.user_id == '' || this.user_id == undefined) {
      // this.utilserv.presentToast('Please Login', 'danger');
      this.router.navigate(['login']);
      return;
    }
    this.products.in_wishlist = wishlist == 'Yes' ? 'No' : 'Yes';
    console.log(this.products.in_wishlist);
    this.products.forEach(element => {
      if (element.id == product_id) {
        var status = element.in_wishlist == 'Yes' ? 'No' : 'Yes';
        element.in_wishlist = status;
      }
    });
    if (wishlist == 'No') {
      this.apiserv.addtowishlist(this.user_id, product_id).subscribe(server_response => {
        var response = server_response['response'][0];
        this.utilserv.dismissLoading();
        if (response['status'] == 'Valid') {
          // this.utilserv.presentToast(response['message'], 'success');
          // this.getProductList()
        }
      },
        err => {
          this.utilserv.dismissLoading();
          this.utilserv.presentAlert('No Network');
        })
    } else if (wishlist == "Yes") {
      // this.apiserv.deletefromwishlist(this.user_id, product_id).subscribe(server_response => {
      //   var response = server_response['response'][0];
      //   this.utilserv.dismissLoading();
      //   if (response['status'] == 'Valid') {
      //     this.utilserv.presentToast(response['message'], 'success');
      //     // this.getProductList();
      //   }
      // },
      this.apiserv.addtowishlist(this.user_id, product_id).subscribe(server_response => {
        var response = server_response['response'][0];
        this.utilserv.dismissLoading();
        if (response['status'] == 'Valid') {
          // this.utilserv.presentToast(response['message'], 'success');
          // this.getProductList()
        }
      },
        err => {
          this.utilserv.dismissLoading();
          this.utilserv.presentAlert('No Network');
        })
    }
  }

  async selcteQuantity(id,product_name,price_list,price_id) {
    console.log(price_list);
    if(price_list.length>1){
      let that = this;
      const modal = await this.modalctrl.create({
        component: SelectquantityComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'product_name': product_name,
          'price_list': price_list,
          'price': price_id
        },
        backdropDismiss:true
      });
      console.log(id);
      modal.onDidDismiss().then(function(res){
        console.log(res);
        if(res.data.action == 'close'){
          that.selectId=res.data.type;
          console.log(that.products);
          console.log(id);
          for(var i=0; i<that.products.length;i++){
            if(id==that.products[i].id){
              that.products[i].selectedItem=that.selectId;
              that.products[i].quantity=0;
            }
          }
        }
      })
      return await modal.present();
    }
    else{
      // console.log("coming");
    }
   
  }
}
