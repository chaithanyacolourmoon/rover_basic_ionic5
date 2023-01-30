import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-subscriptionsuccess',
  templateUrl: './subscriptionsuccess.page.html',
  styleUrls: ['./subscriptionsuccess.page.scss'],
})
export class SubscriptionsuccessPage implements OnInit {

  constructor(private router:Router,public utilserv:UtilityService) { }

  ngOnInit() {
  }

  goHome(){
    this.router.navigate(['home']);
  }

}
