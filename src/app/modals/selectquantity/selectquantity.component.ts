import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-selectquantity',
  templateUrl: './selectquantity.component.html',
  styleUrls: ['./selectquantity.component.scss'],
})
export class SelectquantityComponent implements OnInit {

  constructor(private modalCtrl:ModalController,public utilserv:UtilityService) { }
  @Input() product_name:any;
  @Input() price_list:any;
  @Input() price:any;
  price_id:any;
  ngOnInit() {
    this.price_id=this.price;
    console.log(this.price_id);
  }

  async dismiss() {
    this.modalCtrl.dismiss(
      //'dismissed': true
      { 'action': 'close', 'type': this.price_id}
      // , 'type': this.price_id
    );
    
  }

  dismissModal(){
    // alert("coming")
    this.modalCtrl.dismiss(
      //'dismissed': true
      { 'action': 'close', 'type': this.price_id}
      // , 'type': this.price_id
    );
  }

  selectPrice(id){
    this.price_id=id;
    this.modalCtrl.dismiss(
      //'dismissed': true
      { 'action': 'close', 'type': this.price_id}
      // , 'type': this.price_id
    );
  }

}
