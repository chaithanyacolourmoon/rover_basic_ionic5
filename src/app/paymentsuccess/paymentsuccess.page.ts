import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-paymentsuccess',
  templateUrl: './paymentsuccess.page.html',
  styleUrls: ['./paymentsuccess.page.scss'],
})
export class PaymentsuccessPage implements OnInit {
  order_id:any;
  constructor(private activeroute:ActivatedRoute,public utilserv:UtilityService,
    private router:Router) { 
    this.order_id=this.activeroute.snapshot.params['order_id'];
  }

  ngOnInit() {
  }

  goHome(){
    this.router.navigate(['home']);
  }

  goOrderDetail(){
    this.router.navigate(['orderdetail/'+this.order_id]);
  }


}
