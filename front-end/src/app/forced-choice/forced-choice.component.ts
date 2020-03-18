import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { timer } from 'rxjs';

enum Stage { MEMORIZE, MASK, SELECT, CORRECT, INCORRECT, DONE }

@Component({
  selector: 'app-forced-choice',
  templateUrl: './forced-choice.component.html',
  styleUrls: ['./forced-choice.component.scss'],
})
export class ForcedChoiceComponent implements OnInit {
  @Input() facePaths : string[];
  @Output() finished = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    this.currentFace = this.facePaths[this.progress];
    this.makeRandomFaces();
  }

  Stage = Stage;
  numberOfOptions = 4; // Hard coded for now
  progress : number = 0;
  progressPercent : number = 0;
  score : number = 0;
  stage : Stage = Stage.MEMORIZE;
  mask : string = 'assets/background_imgs/mask1.png';

  currentFace : string;
  selectedFace : string;
  randomFaces : any[];

  selectFace(facePath : string) {
    if (!this.showFeedback()) {
      if (facePath == this.currentFace) {
        this.stage = Stage.CORRECT;
      } else {
        this.stage = Stage.INCORRECT;
      }
      this.selectedFace = facePath;
      this.progressPercent = (this.progress + 1)/this.facePaths.length;
    }
  }

  nextFace() {
    this.progress++;
    if (this.stage == Stage.CORRECT) { // Security measure against clicking too quickly
      this.score++;
    }
    this.stage = this.progress > 7 ? Stage.DONE : Stage.MEMORIZE;
    this.selectedFace = null;
    this.currentFace = this.facePaths[this.progress];
    this.makeRandomFaces();
  }

  showFeedback() {
    return this.stage == Stage.CORRECT || this.stage == Stage.INCORRECT;
  }

  makeRandomFaces() {
    this.randomFaces = [];
    for (let i = 0; i < this.numberOfOptions - 1; i++) {
      let j = Math.floor(Math.random() * this.facePaths.length);
      while (this.randomFaces.indexOf(this.facePaths[j]) > -1 || j == this.progress) {
        j = Math.floor(Math.random() * this.facePaths.length);
      }
      this.randomFaces.push(this.facePaths[j]);
    }
    let j = Math.floor(Math.random() * this.numberOfOptions);
    this.randomFaces.splice(j, 0, this.currentFace);
  }

  startMaskTimer() {
    this.stage = Stage.MASK;
    timer(2000).subscribe(() => {
      this.stage = Stage.SELECT;
    });
  }
}