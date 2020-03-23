import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { timer, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { createAnimation } from '@ionic/core';

enum Stage { START, MEMORIZE, MASK, SELECT, CORRECT, INCORRECT, DONE }

@Component({
  selector: 'app-same-different',
  templateUrl: './same-different.component.html',
  styleUrls: ['./same-different.component.scss'],
})
export class SameDifferentComponent implements OnInit {
  @Input() facePaths : string[];
  @Output() finished = new EventEmitter<[number, number]>();

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
  progressPercent : number = 0;
  score : number = 0;
  stage : Stage = Stage.START;
  mask : string = 'assets/background_imgs/mask1.png';
  memorizeTime : number = 3;
  timeRemaining : number = null;

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
    this.progressPercent = (this.progress + 1)/this.facePaths.length;
  }

  nextFace() {
    this.progress++;
    this.currentFace = this.facePaths[this.progress];
    this.randomFace = this.currentFace;
    if (Math.random() > .5) {
      this.randomFace = this.facePaths[Math.floor(Math.random() * this.facePaths.length)];
    }
    if (this.progress > 7) {
      this.stage = Stage.DONE;
    } else {
      this.startMemorizeTimer();
    }
  }

  clickNext() {
    if (this.showFeedback()) {
      this.nextFace()
    }
  }

  showFeedback() {
    return this.stage == Stage.CORRECT || this.stage == Stage.INCORRECT;
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
    .subscribe(() => {
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
      inflate.play();
    });
  }

  startMaskTimer() {
    this.stage = Stage.MASK;
    timer(2000).subscribe(() => {
        this.stage = Stage.SELECT;
    });
  }

  getSrc() {
    if (this.stage == Stage.MEMORIZE) {
      return this.currentFace
    } else if (this.stage == Stage.MASK) {
      return this.mask;
    } else {
      return this.randomFace;
    }
  }
}
