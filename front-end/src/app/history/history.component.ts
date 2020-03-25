import { Component, OnInit, Input } from '@angular/core';
import { HistoryDataService } from '../service/history-data.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-history-comp',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {

  constructor(public history: HistoryDataService, public events: Events) {
    events.subscribe('history:read', (username, pseudoJSON) => 
    {
      this.username = username;
      this.levels = pseudoJSON[0];
      this.dates = pseudoJSON[1];
      this.prescores = pseudoJSON[2];
      this.postscores = pseudoJSON[3];
    });
  }

  ngOnInit() {
  	this.history.getJSON();
  }

  update() {
    
  }

  username : string = "placeholder";
  levels : boolean[] = [false, false, false, false, false, false];
  dates : string[] = [];
  prescores: number[] = [];
  postscores: number[] = [];

}
