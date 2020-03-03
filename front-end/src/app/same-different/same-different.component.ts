import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

enum Stage { MEMORIZE, SELECT, CORRECT, INCORRECT, DONE }

@Component({
  selector: 'app-same-different',
  templateUrl: './same-different.component.html',
  styleUrls: ['./same-different.component.scss'],
})
export class SameDifferentComponent implements OnInit {
  @Input() facePaths : string;
  @Output() finished = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    this.currentFace = this.facePaths[this.progress];
    this.randomFace = this.currentFace;
    if (Math.random() > .5) {
      this.randomFace = this.facePaths[Math.floor(Math.random() * this.facePaths.length)];
    }
  }

  Stage = Stage;
  progress : number = 0;
  score : number = 0;
  stage : Stage = Stage.MEMORIZE;

  correctSelection : boolean;
  currentFace : string;
  randomFace : string;

  selectFace(sameFace : boolean) {
    if ((sameFace && this.randomFace == this.currentFace) || (!sameFace && this.randomFace != this.currentFace)) {
      this.score++;
      this.stage = Stage.CORRECT;
    } else {
      this.stage = Stage.INCORRECT;
    };
  }

  nextFace() {
    this.progress++;
    this.stage = this.progress == 8 ? Stage.DONE : Stage.MEMORIZE;
    this.currentFace = this.facePaths[this.progress];
    this.randomFace = this.currentFace;
    if (Math.random() > .5) {
      this.randomFace = this.facePaths[Math.floor(Math.random() * this.facePaths.length)];
    }
  }

  clickCard() {
    if (this.stage == Stage.MEMORIZE) {
      this.stage = Stage.SELECT;
    } else if (this.isFeedback()) {
      this.nextFace()
    }
  }

  isFeedback() {
    return this.stage == Stage.CORRECT || this.stage == Stage.INCORRECT;
  }
}
