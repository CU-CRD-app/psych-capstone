import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor() {
    for (let i = 0; i < this.numFaces; i++)
    {
      let name = Math.floor(Math.random() * this.namePool.length);
      this.setNames.push(this.namePool[name]);
      this.namePool = this.namePool.slice(0, name).concat(this.namePool.slice(name + 1, this.namePool.length));
    }
  }

  numFaces : number = 8; //hardcoded for now, happen to be 8 practice faces.
  progress : number = 0;

  namePool : string[] = ["Sam", "Kenny", "Jones", "Dave", "John", "Gale", "Kent", "Tom", "Bill", "Greg", "Anthony", "Tony", "George", "Kevin", "Dick", "Richard"];
  setNames : string[] = []

  scores : number[] = [0, 0, 0, 0, 0, 0];

  recordAndProgress(score : number) {
    this.scores[this.progress - 2] = score;
    this.progress++;
  }
}
