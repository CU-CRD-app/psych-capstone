import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { timer, interval } from 'rxjs';

enum Stage { START, MEMORIZE, SELECT, CORRECT, INCORRECT, DONE }

@Component({
  selector: 'app-shuffle',
  templateUrl: './shuffle.component.html',
  styleUrls: ['./shuffle.component.scss'],
})
export class ShuffleComponent implements OnInit {
  @Input() setNames : string;
  @Input() facePaths : string;
  @Output() finished = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    this.currentFace = this.facePaths[this.progress];
    this.makeRandomFaces();
    interval(1000).subscribe(() => {
      this.timeRemaining--;
    });
  }

  Stage = Stage;
  numberOfOptions = 4; // Hard coded for now
  progress : number = 0;
  score : number = 0;
  stage : Stage = Stage.START;

  currentFace : string;
  selectedFace : string;
  correctFaceOrder : any[];
  randomFaceOrder : any[];
  timeRemaining : number = null;
  feedbackToggle : boolean = true;

  clickDone() {
    let correct : boolean = true;
    this.selectedFace = null;
    for (let i = 0; i < this.randomFaceOrder.length; i++) {
      if (this.randomFaceOrder[i] != this.correctFaceOrder[i]) {
        correct = false;
      }
    }
    if (correct) {
      this.stage = Stage.CORRECT;
      this.score++;
    } else {
      this.stage = Stage.INCORRECT;
      this.feedbackToggle = true;
    }
  }

  nextFace() {
    this.progress++;
    this.stage = this.progress == 8 ? Stage.DONE : Stage.MEMORIZE;
    this.selectedFace = null;
    this.currentFace = this.facePaths[this.progress];
    this.makeRandomFaces();
    if (this.stage != Stage.DONE) {
      this.startMemorizeTimer();
    }
  }

  isFeedback() {
    return this.stage == Stage.CORRECT || this.stage == Stage.INCORRECT;
  }

  makeRandomFaces() {
    // Correct order
    this.correctFaceOrder = [];
    for (let i = 0; i < this.numberOfOptions - 1; i++) {
      let j = Math.floor(Math.random() * this.facePaths.length);
      while (this.correctFaceOrder.indexOf(this.facePaths[j]) > -1 || j == this.progress) {
        j = Math.floor(Math.random() * this.facePaths.length);
      }
      this.correctFaceOrder.push(this.facePaths[j]);
    }
    let j = Math.floor(Math.random() * this.numberOfOptions);
    this.correctFaceOrder.splice(j, 0, this.currentFace);

    // Shuffled order
    this.randomFaceOrder = [];
    for (let i = 0; i < this.correctFaceOrder.length; i++) {
      this.randomFaceOrder.push(this.correctFaceOrder[i]);
    }
    for (let i = this.randomFaceOrder.length - 1; i > 0; i -= 1) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.randomFaceOrder[i];
      this.randomFaceOrder[i] = this.randomFaceOrder[j];
      this.randomFaceOrder[j] = temp;
    }
  }

  startMemorizeTimer() {
    this.timeRemaining = 5;
    this.stage = Stage.MEMORIZE;
    timer(this.timeRemaining * 1000).subscribe(() => {
      if (this.stage == Stage.MEMORIZE) {
        this.stage = Stage.SELECT
      }
    });
  }

  getSrc(index : number) {
    if (this.stage == Stage.SELECT) {
      return this.randomFaceOrder[index];
    } else if (this.stage == Stage.INCORRECT && !this.feedbackToggle) {
      return this.randomFaceOrder[index];
    } else {
      return this.correctFaceOrder[index];
    }
  }

  clickCard(index : number) {
    console.log(index)
    console.log(this.randomFaceOrder)
    if (this.stage == Stage.SELECT) {
      if (this.selectedFace == null) {
        this.selectedFace = this.randomFaceOrder[index];
      } else {
        [this.randomFaceOrder[index], this.randomFaceOrder[this.randomFaceOrder.indexOf(this.selectedFace)]] = [this.randomFaceOrder[this.randomFaceOrder.indexOf(this.selectedFace)], this.randomFaceOrder[index]];
        /*let temp = this.randomFaceOrder[index];
        this.randomFaceOrder[index] = this.selectedFace;
        this.randomFaceOrder[this.randomFaceOrder.indexOf(this.selectedFace)] = temp;*/
        this.selectedFace = null;
      }
    }
    console.log(index)
    console.log(this.randomFaceOrder)
  }
}

// timer?
// mask
// toggle feedback