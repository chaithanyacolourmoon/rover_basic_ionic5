import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-updateversion',
  templateUrl: './updateversion.page.html',
  styleUrls: ['./updateversion.page.scss'],
})
export class UpdateversionPage implements OnInit {
  constructor(private navctrl: NavController,public utilserv:UtilityService) { }

  ngOnInit() {
  }
  updateapp() {
    window.open("https://play.google.com/store/apps/details?id=com.rovor", "_system");
  }

}