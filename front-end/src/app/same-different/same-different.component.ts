import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

enum Stage { Memorize, Select, Feedback }

@Component({
  selector: 'app-same-different',
  templateUrl: './same-different.component.html',
  styleUrls: ['./same-different.component.scss'],
})
export class SameDifferentComponent implements OnInit {
  @Input() setNames : string;
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
  stage : Stage = Stage.Memorize;

  correctSelection : boolean;
  currentFace : string;
  randomFace : string;

  selectFace(facePath : string) {
    if (facePath == this.currentFace) {
      this.score++;
      this.correctSelection = true;
    } else {
      this.correctSelection = false;
    }
    this.stage = Stage.Feedback;
  }

  nextFace() {
    this.stage = Stage.Memorize;
    this.progress++;
    this.currentFace = this.facePaths[this.progress];
    this.randomFace = this.currentFace;
    if (Math.random() > .5) {
      this.randomFace = this.facePaths[Math.floor(Math.random() * this.facePaths.length)];
    }
  }

  clickCard() {
    if (this.stage == Stage.Memorize) {
      this.stage = Stage.Select;
    } else if (this.stage == Stage.Feedback) {
      this.nextFace()
    }
  }
}
