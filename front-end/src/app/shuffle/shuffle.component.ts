import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { timer, interval } from 'rxjs';
import { takeUntil} from 'rxjs/operators';

enum Stage { START, MEMORIZE, MASK, SELECT, CORRECT, INCORRECT, DONE }

@Component({
  selector: 'app-shuffle',
  templateUrl: './shuffle.component.html',
  styleUrls: ['./shuffle.component.scss'],
})
export class ShuffleComponent implements OnInit {
  @Input() facePaths : string;
  @Output() finished = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    this.currentFace = this.facePaths[this.progress];
    this.makeRandomFaces();
  }

  Stage = Stage;
  numberOfOptions : number = 4; // Hard coded for now
  memorizeTime : number = 10;
  progress : number = 0;
  progressPercent : number = 0;
  score : number = 0;
  memorizeCounter : number = 0;
  stage : Stage = Stage.START;
  mask : string = 'assets/background_imgs/mask1.png';

  currentFace : string;
  selectedFace : string;
  correctFaceOrder : any[];
  randomFaceOrder : any[];
  timeRemaining : number = null;
  feedbackToggle : boolean = true;

  clickDone() {
    let correct : boolean = true;
    let score : number = 1;
    this.selectedFace = null;
    for (let i = 0; i < this.randomFaceOrder.length; i++) {
      if (this.randomFaceOrder[i] != this.correctFaceOrder[i]) {
        correct = false;
        score -= 1/this.numberOfOptions;
      }
    }
    this.score += score;
    if (correct) {
      this.stage = Stage.CORRECT;
    } else {
      this.stage = Stage.INCORRECT;
      this.feedbackToggle = true;
    }
    this.progressPercent = (this.progress + 1)/this.facePaths.length;
  }

  nextFace() {
    this.progress++;
    this.stage = this.progress > 7 ? Stage.DONE : Stage.MEMORIZE;
    this.selectedFace = null;
    if (this.stage != Stage.DONE) {
      this.currentFace = this.facePaths[this.progress];
      this.makeRandomFaces();
      this.startMemorizeTimer();
    } else {
      this.score = Math.ceil(this.score);
    }
  }

  showFeedback() {
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
    this.timeRemaining = this.memorizeTime;
    this.stage = Stage.MEMORIZE;
    let counter : number = this.memorizeCounter;
    timer(this.timeRemaining * 1000).subscribe(() => {
      if (this.stage == Stage.MEMORIZE && counter == this.memorizeCounter) {
        this.startMaskTimer();
      }
    });
    interval(1000)
    .pipe(
      takeUntil(timer(this.timeRemaining * 1000))
    )
    .subscribe(() => {
      if (counter == this.memorizeCounter) {
        this.timeRemaining--;
      }
    });
  }

  startMaskTimer() {
    this.stage = Stage.MASK;
    timer(2000).subscribe(() => {
      this.stage = Stage.SELECT;
    });
  }

  getSrc(index : number) {
    if (this.stage == Stage.MASK) {
      return this.mask;
    } else if (this.stage == Stage.SELECT || (this.stage == Stage.INCORRECT && this.feedbackToggle)) {
      return this.randomFaceOrder[index];
    } else {
      return this.correctFaceOrder[index];
    }
  }

  clickCard(index : number) {
    if (this.stage == Stage.SELECT) {
      if (this.selectedFace == null) {
        this.selectedFace = this.randomFaceOrder[index];
      } else {
        let index_selected : number = this.randomFaceOrder.indexOf(this.selectedFace);
        [this.randomFaceOrder[index], this.randomFaceOrder[index_selected]] = [this.randomFaceOrder[index_selected], this.randomFaceOrder[index]];
        this.selectedFace = null;
      }
    } else if (this.showFeedback()) {
      this.feedbackToggle = !this.feedbackToggle;
    }
  }
}