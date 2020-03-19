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
  levels : boolean[] = [false, false, false, false, false, false];
  dates : string[] = [];
  prescores: number[] = [];
  postscores: number[] = [];
  pseudoJSON: any[];

  update_page() {
    console.log("first: ", this.username);
    this.pseudoJSON = [this.levels, this.dates, this.prescores, this.postscores];
  	this.events.publish('history:read', this.username, this.pseudoJSON);
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
      for (var i = 0; i < this.levels.length; i++) {
        if (this.levels[i]) {
          this.dates[i] = data['History'][(i+1).toString()]['Date'];
          this.prescores[i] = data['History'][(i+1).toString()]['Pre-score'];
          this.postscores[i] = data['History'][(i+1).toString()]['Post-score'];
        }
      }
  	});
    setTimeout(() => { 
      //terrible practice, I hate async languages
      //waits 300ms before calling so that getJSON has read the JSON
        this.update_page()
    }, 300);
  }

  myTest() {
    return this.http.get("assets/JSON_test_files/Bobby.json");
  }
}
