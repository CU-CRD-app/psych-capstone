import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GetProgressService {

  constructor(public http: HttpClient, public events: Events) { }

  // The idea is this service will eventually be called
  // to get info from the backend in terms of what level
  // the user is on for each set of faces. 
  black_level : number = 1;
  asian_level : number = 1;

  giveProgress() {
  	this.events.publish('getProgress', this.black_level, this.asian_level);
  }

  updateProgress(level : number) { // for development only
    this.black_level = level;
  }

  dashLevel() {
    this.events.publish('dashLevel', this.black_level, this.asian_level);
  }

}