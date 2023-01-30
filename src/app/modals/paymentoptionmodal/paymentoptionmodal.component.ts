import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-paymentoptionmodal',
  templateUrl: './paymentoptionmodal.component.html',
  styleUrls: ['./paymentoptionmodal.component.scss'],
})
export class PaymentoptionmodalComponent implements OnInit {
  payment_method:any;
  constructor(public utilserv:UtilityService,private modalctrl:ModalController) { }

  ngOnInit() {}


  modalClose(payment_method) {
    this.payment_method=payment_method;
    this.modalctrl.dismiss(
      { 'action': 'close', 'payment_method': this.payment_method }
    );
  }

  modalHeadClose(payment_method){
    this.payment_method=payment_method;
    this.modalctrl.dismiss(
      { 'action': 'close' , 'payment_method': this.payment_method }
    );
  }

}
