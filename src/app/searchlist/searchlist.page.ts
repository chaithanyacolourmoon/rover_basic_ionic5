import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, ModalController, NavController } from '@ionic/angular';
import { SelectquantityComponent } from '../modals/selectquantity/selectquantity.component';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-searchlist',
  templateUrl: './searchlist.page.html',
  styleUrls: ['./searchlist.page.scss'],
})
export class SearchlistPage implements OnInit {

  public sid;
  products: any = [];
  public errormessage;
  cartCount: any;
  selectId: any;
  selectIdd: any;
  city_id: any;
  product_id: any;
  user_id: any;
  totalProducts: any=0;
  searchQuery:any;
  selectedprice:any;
  add_id:any;
  key_final:any;
  start: number = 0;
  limit: number = 10;
  totalproductscount: any=0;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  constructor(private apiserv: ApiService,
    public utilserv: UtilityService,
    private navctrl: NavController,private modalctrl:ModalController,
    private router: Router,
    private cd: ChangeDetectorRef,
    private zone: NgZone,) {
    this.sid = localStorage.getItem('sid');
    this.city_id = localStorage.getItem('city_id');
    this.user_id = localStorage.getItem('user_id');
  }

  ngOnInit() {
  }

  // SelectChange(event) {
  //   this.selectId = event.target.value;
  //   this.products[0].sizes.forEach(ob => {
  //     if (ob.size_id == this.selectId) {
  //       this.selectIdd = ob.size_id;
  //     }
  //   })
  // }

  ionViewWillEnter(){
    this.start=0;
    this.limit=10;
    // this.products=[];
    // this.totalProducts=0;
    // this.searchQuery='';
  }

  searchList(ev) {
    this.products=[];
    console.log(ev.target.value);
    var sort = 'low';
    var search_key = ev.target.value;
    if (search_key == '') {
      search_key = null;
      this.start=0;
      this.limit=10;
    }
    this.key_final=search_key;
    this.apiserv.getsearchproducts(search_key, this.city_id, this.start, this.limit,this.user_id,this.sid).subscribe(data => {
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.products = response['products'];
        this.totalProducts = response['total_products'];
        this.totalproductscount = response['total_products'];
        if(this.totalproductscount==0){
        }else{
          this.products.forEach(element => {
            element['quantity'] = 0;
            element['selectedItem'] = element.price[0].id;
          });
        }
       
      }
      else {
        this.errormessage = response['message'];
      }
    })
  }

  async loadmoreproducts(event) {
    var language_id=localStorage.getItem('language_id');
    this.start = (this.start + this.limit);
    this.apiserv.getsearchproducts(this.key_final, this.city_id, this.start, this.limit,this.user_id,this.sid).subscribe(data => {
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        var more_products = response['products'];
        this.totalproductscount = response['total_products'];
        if(this.totalproductscount==0){
         
        }else{
          more_products.forEach(element => {
            element['quantity'] = 0;
            element['selectedItem'] = element.price[0].id;
            this.products.push(element);
          });
          // this.zone.run(() => {
          //   const newData = this.products;
          //   for (let i = 0; i < newData.length; i++) {
          //     this.products.push(newData[i]);
                
          //   }
          //   console.log(this.products);
          //   this.cd.detectChanges();
          // })
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

  SelectChange(event) {
    this.selectId = event.target.value;
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
            this.cartcount();
          }
        })
        
      }
    }
  }

  decrease(cart_id,addid,product) {
    var select_quantity;
    this.selectIdd=product.selectedItem;
    for(var i=0;i<product.price.length;i++){
      if(product.selectedItem==product.price[i].id){
        product.price[i].cart_qty--;
        select_quantity=product.price[i].cart_qty;
      }
    }
    this.add_id=addid;
    this.products.forEach((ob, index, object) => {
      if (ob.id == cart_id) {
        // if (ob.quantity >= 1) {
        //   ob.quantity = parseInt(ob.quantity) - 1;
          // this.addtocartitem(ob.quantity);
          this.updatecartitem(ob.id, select_quantity);
          this.cartcount();;
        // }
        // if (ob.quantity < 1) {
        //   object.splice(index, 1);
        // }
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
      // return;
    }
   else{
    if (product.quantity == 0 || product.quantity == null) {
      product.quantity = 1;
    }
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
    //  }
  }

  updatecartitem(cart_id, qty) {
    this.apiserv.addtocart(cart_id, this.selectIdd, this.sid, qty,this.user_id).subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.cartcount();
        //   this.getProductList();
        //  alert(this.cartCount);
        if(this.add_id=='1'){
          // this.utilserv.presentToast('Item has deleted from cart', 'success');
        }
        else{
          // this.utilserv.presentAlert(response['message']);
        }
        
      }
      else{
        this.utilserv.presentAlert(response['message']);
        this.getSearchList();
        
      }
    })
  }

  getSearchList(){
    var sort = 'low';
    this.products=[];
    this.apiserv.getsearchproducts(this.key_final, this.city_id, this.start, this.limit,this.user_id,this.sid).subscribe(data => {
      var response = data['response'][0];
      if (response['status'] == 'Valid') {
        this.products = response['products'];
        this.totalProducts = response['total_products'];
        this.products.forEach(element => {
          element['quantity'] = 0;
          element['selectedItem'] = element.price[0].id;
        });
      }
      else {
        this.errormessage = response['message'];
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
    this.router.navigate(['/productview/' + pid]);
  }

  Add_to_Wishlist(wishlist, product_id) {
    // this.utilserv.show_loader();
    if (this.user_id == '' || this.user_id == undefined) {
      // this.utilserv.presentToast('Please Login', 'danger');
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
      this.apiserv.deletefromwishlist(this.user_id, product_id).subscribe(server_response => {
        var response = server_response['response'][0];
        this.utilserv.dismissLoading();
        if (response['status'] == 'Valid') {
          // this.utilserv.presentToast(response['message'], 'success');
          // this.getProductList();
        }
      },
        err => {
          this.utilserv.dismissLoading();
          this.utilserv.presentAlert('No Network');
        })
    }
  }

  async selcteQuantity(id,product_name,price_list,price_id) {
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
        console.log(that.products);
        console.log(id);
        for(var i=0; i<that.products.length;i++){
          if(id==that.products[i].id){
            that.products[i].selectedItem=that.selectId;
          }
        }
      }
    })
    return await modal.present();
    }else{
      
    }
  }

  

}
