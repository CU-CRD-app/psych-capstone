import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GetProgressService {

  constructor(public http: HttpClient, public events: Events) { }

  getData() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
  
    return this.http.post('https://crossfacerecognition.herokuapp.com/userData/', {}, httpOptions);
  }

}