import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.page.html',
  styleUrls: ['./contactus.page.scss'],
})
export class ContactusPage implements OnInit {
  title: any;
  address: any;
  phone: any;
  email: any;
  customercare: any;
  whatsapp_no:any;
  constructor(private apiserv: ApiService,public utilserv:UtilityService) { }

  ngOnInit() {
    this.getcontact();
  }
  getcontact() {
    this.apiserv.getcontactus().subscribe(data => {
      console.log(data);
      var response = data['response'][0];
      this.title = response['title'];
      this.address = response['address'];
      this.phone = response['phone'];
      this.customercare = response['customer_care'];
      this.email = response['email'];
      this.whatsapp_no =response['whatsapp_no'];

    })
  }
}