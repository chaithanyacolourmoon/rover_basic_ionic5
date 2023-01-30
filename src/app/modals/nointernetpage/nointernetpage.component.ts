import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-nointernetpage',
  templateUrl: './nointernetpage.component.html',
  styleUrls: ['./nointernetpage.component.scss'],
})
export class NointernetpageComponent implements OnInit {
  public back_subscription;
  constructor(private platform: Platform,
    private router: Router,
    private network: Network,
    public modalController: ModalController,public utilserv:UtilityService) {
    this.backb();
    let connectSubscription = this.network.onConnect().subscribe(() => {
      //this.viewCtrl.dismiss();
      this.modalController.dismiss();
    });
  }

  backb() {
    this.platform.ready().then(() => {
      this.back_subscription = this.platform.backButton.subscribe(() => {
        navigator['app'].exitApp();
      });
    });
  }

  ngOnInit() {
  }
}