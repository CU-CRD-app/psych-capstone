import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HistoryDataService {

  constructor(public http: HttpClient, public events: Events) { }

  username : string = "username";
  levels : boolean[] = [false, false, false, false];
  dates : string[] = [];
  prescores: number[] = [];
  postscores: number[] = [];

  update_page() {
    console.log("first: ", this.username);
  	this.events.publish('history:read', this.username, this.levels);
  }

  getJSON() {
  	this.http.get("assets/JSON_test_files/Bobby.json")
  	.subscribe(data => {
      //read Username
  		this.username = data['History']['Username'];
      //find out which levels are done
      for (var i = 0; i < this.levels.length; i++) {
        this.levels[i] = data['History'][(i+1).toString()]['Completed'];
      }
      //use levels[] to know what to read next
      
  		console.log(data);
  	});
    setTimeout(() => { 
      //terrible practice, I hate async languages
      //waits 300ms before calling so that getJSON has read the JSON
        this.update_page()
    }, 300);
  }
}
