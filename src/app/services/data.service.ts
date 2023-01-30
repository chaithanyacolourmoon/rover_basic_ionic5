import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  onCategoryDataListChanged: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  public dorOderParams: any;
  constructor(private http: HttpClient) {

  }

}
