import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss'],
})
export class SortComponent implements OnInit {
  @Input() sort_value:any;
  constructor(private modalctrl: ModalController,public utilserv:UtilityService) { }

  ngOnInit() { 
  }
  modalClose(filter) {
    this.sort_value=filter;
    this.modalctrl.dismiss(
      { 'action': 'close', 'sort_type': filter }
    );
  }

  modalHeadClose(filter){
    this.sort_value=filter;
    this.modalctrl.dismiss(
      { 'action': 'close' , 'sort_type': this.sort_value }
    );
  }
}
