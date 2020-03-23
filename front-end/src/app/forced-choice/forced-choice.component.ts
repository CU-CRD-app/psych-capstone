import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { timer, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { createAnimation } from '@ionic/core';

enum Stage { START, MEMORIZE, MASK, SELECT, CORRECT, INCORRECT, DONE }

@Component({
  selector: 'app-forced-choice',
  templateUrl: './forced-choice.component.html',
  styleUrls: ['./forced-choice.component.scss'],
})
export class ForcedChoiceComponent implements OnInit {
  @Input() facePaths : string[];
  @Output() finished = new EventEmitter<[number, number]>();

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
  stage : Stage = Stage.START;
  mask : string = 'assets/background_imgs/mask1.png';
  memorizeTime : number = 3;
  timeRemaining : number = null;

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
    this.selectedFace = null;
    this.currentFace = this.facePaths[this.progress];
    this.makeRandomFaces();
    if (this.progress > 7) {
      this.stage = Stage.DONE;
    } else {
      this.startMemorizeTimer();
    }
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

  startMemorizeTimer() {
    this.timeRemaining = this.memorizeTime;
    this.stage = Stage.MEMORIZE;
    timer(this.timeRemaining * 1000).subscribe(() => {
      this.startMaskTimer();
    });
    interval(1000)
    .pipe(
      takeUntil(timer(this.timeRemaining * 1000))
    )
    .subscribe(async () => {
      let inflate = createAnimation()
      .addElement(document.querySelector('.time-left'))
      .fill('none')
      .duration(100)
      .keyframes([
        { offset: 0, transform: 'scale(1, 1)' },
        { offset: 0.5, transform: 'scale(1.5, 1.5)' },
        { offset: 1, transform: 'scale(2, 2)' }
      ]);
      this.timeRemaining--;
      await inflate.play();
    });
  }

  startMaskTimer() {
    this.stage = Stage.MASK;
    timer(2000).subscribe(() => {
      this.stage = Stage.SELECT;
    });
  }

  firstStage() {
    return this.stage == Stage.START || this.stage == Stage.MEMORIZE || this.stage == Stage.MASK;
  }
}