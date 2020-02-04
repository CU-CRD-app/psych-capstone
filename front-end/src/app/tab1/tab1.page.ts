import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor() {
    for (let i = 0; i < this.numFaces; i++) //randomly shuffles names from namePool into an array passed to activities
    {
      let name = Math.floor(Math.random() * this.namePool.length);
      this.setNames.push(this.namePool[name]);
      this.namePool = this.namePool.slice(0, name).concat(this.namePool.slice(name + 1, this.namePool.length));
    }

    for (let i = 0; i < this.numFaces; i++) //creates array of 0-numFaces, to be shuffled afterwards
    {
      this.faceNums.push(i);
    }
    for (let i = this.faceNums.length-1; i > 0; i--) //shuffle the numbers up
    {
      let j = Math.floor(Math.random() * (i + 1)); //some index to the left of i
      let tmp = this.faceNums[i]; //current num stored in tmp
      this.faceNums[i] = this.faceNums[j]; //swap current slot with randomly chosen slot
      this.faceNums[j] = tmp; //set the chosen slot to tmp
    }
    for (let num of this.faceNums) //creates array of faces in random order to be passed to components
    {
      this.facePaths.push(`./../../assets/sample-faces/${num}.png`);
    }
  }

  numFaces : number = 8; //hardcoded for now, happen to be 8 practice faces.
  progress : number = 0;

  namePool : string[] = ["Sam", "Kenny", "Jones", "Dave", "John", "Gale", "Kent", "Tom", "Bill", "Greg", "Anthony", "Tony", "George", "Kevin", "Dick", "Richard"];
  setNames : string[] = []

  faceNums : number[] = []
  facePaths : string[] = []

  scores : number[] = [0, 0, 0, 0, 0, 0];

  recordAndProgress(score : number) {
    this.scores[this.progress - 2] = score; // developer score for each activity once completed
    this.progress++;
  }
}
