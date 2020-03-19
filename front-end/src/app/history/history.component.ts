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
    events.subscribe('history:read', (username, levels) => 
    {
      console.log("subbed!");
      this.username = username;
      this.levels = levels;
    });
  }

  ngOnInit() {
  	this.history.getJSON();
  }

  update() {
    this.history.update_page();
  }

  username : string = "placeholder";
  levels : boolean[] = [false, false, false, false]

}
