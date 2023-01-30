import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, MenuController, ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @ViewChild('content', { static: false }) private content: any;
  data: any;
  tabSelected: any;

  variation: any;
  shopId: any;
  productList: any;
  catId: any;
  attributelist: any=[];
  totalBrands:any=[];
  // attributevalues: any = [];
  size: any = [];
  attribute: any = [];

  selectedArray: any = [];
  selectedFilters: any = [];
  currentSegment;
  attributeValues = [];
  filterdata: any = [];
  attributeValues1: any = [];
  filter_checked_list: any = [];
  myArray:any;
  constructor(private router: Router
    , private actRoute: ActivatedRoute, public modalController: ModalController, private menu: MenuController, 
    private loadingController: LoadingController, public utilserv: UtilityService, private api: ApiService, navParams: NavParams) {
    this.catId = navParams.get('catId');
     this.attributeValues1 = navParams.get('selected_value');
  }

  ngOnInit() {
    this.getAttributesList();
    console.log(this.attributeValues1);
    if(this.attributeValues1){
      this.myArray = this.attributeValues1.split(',');
      console.log(this.myArray);
    }
    else{
      this.myArray=[];
    }
    
  }

  filterItems(ev) {
    console.log(ev);
      const val = ev.target.value;
      if (val && val.trim() !== '') {
          this.attributelist = this.totalBrands.filter((item) => {
              return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
      } else {
        this.attributelist=this.totalBrands;
        //  this.isItemAvailable = false;
      }
     
  }

  async getAttributesList() {
    this.attributelist=[];
    let loading = await this.loadingController.create({
      
      showBackdrop:false,
           
      cssClass:'sacustom-cls',     
             
      message:`
           
      <div class="custom-spinner-container">
             
      <img class="loading" width="40px" height="40px" 
      src="assets/images/cmoon.gif" />
           
      </div>`
         
      });
      loading.present();
    this.api.getBrands(this.catId).subscribe(data => {
      var response = data['response'][0];
      console.log(response);
      loading.dismiss();
      if (response['status'] == 'Valid') {
        if(response['brands']){
          var attr=response['brands'];
          for(var i=0;i<attr.length;i++){
            var value= {title:attr[i]};
            this.attributelist.push(value);
          }
          // this.attributelist = response['brands'];
          console.log(this.attributelist);
          if(this.myArray.length>0){
            for(var i=0;i<this.myArray.length;i++){
              for(var j=0;j<this.attributelist.length;j++){
                if(this.attributelist[j].title==this.myArray[i]){
                  this.attributelist[j].is_checked=true;
                  this.selectedFilters.push(this.attributelist[j].title);
                }
              }
            }
          }
          else{
            this.attributelist.forEach(attype => {
              attype.is_checked = false
            });
            this.selectedFilters=[];
          }
          this.totalBrands=this.attributelist;
        }
        else{
          this.attributelist=[];
          this.totalBrands=this.attributelist;
        }
        
      }
      else {
        this.utilserv.presentToast("No Attributes", 'danger');
      }
    })
    
  }

  selectAttrVal(event,title) {
    this.currentSegment = title;
    var is_checked= event.detail.checked;
    console.log(this.attributelist);
    for( var i =0;i<this.attributelist.length;i++){
      if (this.attributelist[i].title == this.currentSegment) {
          this.attributelist[i].is_checked = is_checked;
          if (this.attributelist[i].is_checked == true) {
            this.selectedFilters.push(this.attributelist[i].title);
            console.log(this.selectedFilters);
          } else {
            console.log(this.selectedFilters);
            for(var j=0;j<this.selectedFilters.length;j++){
              if(this.selectedFilters[j]==this.attributelist[i].title){
                this.selectedFilters.splice(j, 1);
              }
              
            }
            // this.selectedFilters.splice(i, 1);
          }
      }
    }
    this.filter_checked_list = this.selectedFilters;
    console.log(this.filter_checked_list);
    // this.attributelist.forEach(attype => {
       
    // });

  }

  reset() {
    this.filter_checked_list=[];
    this.modalController.dismiss({
      action: 'filterApply',
      json_data: this.filter_checked_list,
    })
    // this.attributelist.forEach(attype => {
    //   attype.attributes_values.forEach(attval => {
    //     attval.is_checked = false;
    //   });
    // });

  }
  
  apply() {
    this.modalController.dismiss({
      action: 'filterApply',
      json_data: this.filter_checked_list,
    })
  }


  onMenuClick(cate_id) {
    this.tabSelected = cate_id;
    let yOffset = document.getElementById(cate_id).offsetTop;
    let yHOffset = document.getElementById(cate_id).offsetHeight;
    this.content.scrollToPoint(0, yOffset, 1000);

  }

  onBrandClick(categoryId: any, brandId: any) {
    // this.router.navigateByUrl('search/' + categoryId + '/' + brandId);
  }

  onPromotionClick(cate2Id: any) {
    // this.router.navigateByUrl('search/' + cate2Id);
  }

  onCoverClick(coverId: any) {
    // this.router.navigateByUrl('promotion/' + coverId);
  }

  scrollTo(element: string) {

  }
  dismiss() {
    this.modalController.dismiss(
      {
        'action': 'close'
      }
    );
  }

  


  variationChange(val) {
    this.variation = val;
  }
}
