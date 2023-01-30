import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private settingsObject = new Subject<any>();

  constructor() { }

  publishSettingsData(data: any) {
    this.settingsObject.next(data);
  }

  getObservable(): Subject<any> {
    return this.settingsObject;
  }
}
