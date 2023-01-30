import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notificationdata',
  templateUrl: './notificationdata.component.html',
  styleUrls: ['./notificationdata.component.scss'],
})
export class NotificationdataComponent implements OnInit {
  @Input() title:any;
  @Input() description:any;
  constructor() { }

  ngOnInit() {}

}
