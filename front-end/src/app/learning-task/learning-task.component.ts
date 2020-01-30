import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-learning-task',
  templateUrl: './learning-task.component.html',
  styleUrls: ['./learning-task.component.scss'],
})
export class LearningTaskComponent implements OnInit {
  @Output() finished = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < this.numFaces; i++)
    {
      this.setNames.push(this.namePool[Math.floor(Math.random() * this.numNames)]);
    }
    this.currentName = this.setNames[this.progress];
  }

  numFaces : number = 8; //hardcoded for now, happen to be 8 practice faces.
  progress : number = 0;

  namePool : string[] = ["Sam", "Kenny", "Jones", "Dave", "John", "Gale", "Kent", "Tom", "Bill", "Greg", "Anthony", "Tony", "George", "Kevin", "Dick", "Richard"];
  numNames : number = 16;
  setNames : string[] = []

  currentFace : string = `../../assets/sample-faces/${this.progress}.png`;
  currentName : string;

  changeCard(direction : string) {
    if (direction == 'next') {
      this.progress++;
    } else {
      this.progress--;
    }
    this.currentFace = `../../assets/sample-faces/${this.progress}.png`;
    this.currentName = this.setNames[this.progress];
  }

}
