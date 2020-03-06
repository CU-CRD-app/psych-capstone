import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { timer } from 'rxjs';

enum Stage { MEMORIZE, MASK, SELECT, CORRECT, INCORRECT, DONE }

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

  Stage = Stage;
  numberOfOptions = 4; // Hard coded for now
  progress : number = 0;
  score : number = 0;
  stage : Stage = Stage.MEMORIZE;

  currentFace : string;
  selectedFace : string;
  randomFaces : any[];

  selectFace(facePath : string) {
    if (this.stage != Stage.CORRECT && this.stage != Stage.INCORRECT) {
      if (facePath == this.currentFace) {
        this.score++;
        this.stage = Stage.CORRECT;
      } else {
        this.stage = Stage.INCORRECT;
      }
      this.selectedFace = facePath;
    }
  }

  nextFace() {
    this.progress++;
    this.stage = this.progress == 8 ? Stage.DONE : Stage.MEMORIZE;
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

  isFeedback() {
    return this.stage == Stage.CORRECT || this.stage == Stage.INCORRECT;
  }

  startMaskTimer() {
    this.stage = Stage.MASK;
    timer(2000).subscribe(() => {
        this.stage = Stage.SELECT;
    });
  }
}