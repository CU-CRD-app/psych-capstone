import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

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

  progress : number = 0;
  score : number = 0;
  stage : number = 0; // memorize, choose, feedback

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
    this.stage = 2;
  }

  nextFace() {
    this.stage = 0;
    this.progress++;
    this.currentFace = this.facePaths[this.progress];
    this.randomFace = this.currentFace;
    if (Math.random() > .5) {
      this.randomFace = this.facePaths[Math.floor(Math.random() * this.facePaths.length)];
    }
  }

  clickCard() {
    if (this.stage == 0) {
      this.stage = 1;
    } else if (this.stage == 2) {
      this.nextFace()
    }
  }
}
