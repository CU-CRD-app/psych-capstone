import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-forced-choice',
  templateUrl: './forced-choice.component.html',
  styleUrls: ['./forced-choice.component.scss'],
})
export class ForcedChoiceComponent implements OnInit {
  @Input() setNames : string;
  @Input() facePaths : string;
  @Output() finished = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    this.currentFace = this.facePaths[this.progress];
    this.randomFaces = [];
    for (let i = 0; i < this.numberOfOptions - 1; i++) {
      let j = Math.floor(Math.random() * this.facePaths.length);
      while (this.randomFaces.indexOf(this.facePaths[j]) > -1 || j == this.progress) {
        j = Math.floor(Math.random() * this.facePaths.length);
      }
      this.randomFaces.push(this.facePaths[j]);
    }
    let j = Math.floor(Math.random() * this.numberOfOptions - 1);
    this.randomFaces.splice(j, 0, this.currentFace);
  }

  numberOfOptions = 4; // Hard coded for now
  progress : number = 0;
  score : number = 0;
  stage : number = 0; // memorize, choose, feedback

  correctSelection : boolean;
  currentFace : string;
  randomFaces : any[] = [];
  selectedFace : string;

  selectFace(facePath : string) {
    if (this.stage != 2) {
      if (facePath == this.currentFace) {
        this.score++;
        this.correctSelection = true;
      } else {
        this.correctSelection = false;
      }
      this.selectedFace = facePath;
      this.stage = 2;
    }
  }

  nextFace() {
    this.stage = 0;
    this.progress++;
    this.selectedFace = null;
    this.currentFace = this.facePaths[this.progress];
    this.randomFaces = [];
    for (let i = 0; i < this.numberOfOptions - 1; i++) {
      let j = Math.floor(Math.random() * this.facePaths.length);
      while (this.randomFaces.indexOf(this.facePaths[j]) > -1 || j == this.progress) {
        j = Math.floor(Math.random() * this.facePaths.length);
      }
      this.randomFaces.push(this.facePaths[j]);
    }
    let j = Math.floor(Math.random() * this.numberOfOptions - 1);
    this.randomFaces.splice(j, 0, this.currentFace);
  }
}
