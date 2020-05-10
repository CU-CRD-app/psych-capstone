import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { timer, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { createAnimation } from '@ionic/core';
import { IonSlides } from '@ionic/angular';

enum Stage { START, MEMORIZE, MASK, SELECT, CORRECT, INCORRECT }

@Component({
  selector: 'app-memory-match',
  templateUrl: './memory-match.component.html',
  styleUrls: ['./memory-match.component.scss'],
})
export class MemoryMatchComponent implements OnInit {
  @Input() facePaths : string[];
  @Output() finished = new EventEmitter<[number, number]>();
  @ViewChild('slideElement', {static: false}) slideElement: IonSlides;

  constructor() { }

  ngOnInit() {

    this.stage = Stage.START;
    this.score = 0;
    this.promise = 0;
    this.progressPercent = 0;
    this.selectedFace = null;
    this.correctFaces = [];
    this.incorrectFaces = [];
    this.firstSlide = true;
    this.changeScore = createAnimation();

    // Init list of faces
    this.randomFaces = [];
    for (let i = 0; i < this.facePaths.length; i++) {
      this.randomFaces.push(this.facePaths[i]);
      this.randomFaces.push(this.facePaths[i]);
    }
    // Shuffle the faces
    for (let i = this.randomFaces.length - 1; i > 0; i -= 1) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.randomFaces[i];
      this.randomFaces[i] = this.randomFaces[j];
      this.randomFaces[j] = temp;
    }

    this.timer = timer(500).subscribe(async () => {
      let fadeIn = createAnimation()
        .addElement(document.querySelectorAll('.overlay'))
        .fill('none')
        .duration(500)
        .fromTo('opacity', '0', '.9');
      await fadeIn.play();
      if (this.stage == Stage.START) {
        Array.from(document.getElementsByClassName('overlay') as HTMLCollectionOf<HTMLElement>)[0].style.opacity = '.9';
      }
    });
  }

  ngAfterViewInit() {
    this.slideElement.lockSwipes(true);
  }

  ngOnDestroy() {
    if (this.interval) {
      this.interval.unsubscribe();
    }
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }

  finish(event : any) {
    this.finished.emit([this.score, event])
    if (event == 0) { // Reload and retry
      this.ngOnInit();
      this.slideElement.lockSwipes(false);
      this.slideElement.slideTo(0);
      this.slideElement.lockSwipes(true);
    }
  }

  Stage = Stage;
  mask : string = 'assets/background_imgs/mask1.png';
  memorizeTime : number = 10;
  taskLength : number = 32;

  stage : Stage;
  score : number;
  promise : number;
  progressPercent : number;
  timeRemaining : number;
  interval : any;
  timer : any;
  changeScore : any;
  firstSlide : boolean;

  randomFaces : string[];
  correctFaces : string[];
  incorrectFaces : number[];
  selectedFace : number;

  async clickFace(face : number) {
    if (this.stage != Stage.START && this.stage != Stage.MEMORIZE && this.stage != Stage.MASK) { // Waiting for feedback
      if (this.stage == Stage.CORRECT || this.stage == Stage.INCORRECT) {
        this.promise++;
        this.selectedFace = null;
        this.resetSelected();
      }
      if (this.correctFaces.indexOf(this.randomFaces[face]) < 0 && face != this.selectedFace) { // Click on a valid face

        if (this.selectedFace == null) { // Select first face
          this.selectedFace = face;

        } else if (this.randomFaces[face] == this.randomFaces[this.selectedFace]) { // Correct
          this.correctFaces.push(this.randomFaces[face]);
          this.progressPercent = this.correctFaces.length/this.facePaths.length;
          this.score += this.taskLength / this.facePaths.length;
          this.stage = Stage.CORRECT;

          if (this.correctFaces.length == this.facePaths.length) { // Done
            this.score = Math.ceil(this.score);
            this.slideElement.lockSwipes(false);
            this.revealFooter();
          }
          await this.waitForFeedback();

        } else { // Incorrect
          this.incorrectFaces.push(this.selectedFace);
          this.incorrectFaces.push(face);
          this.score = this.score >= 1 ? this.score - 1 : 0;
          this.stage = Stage.INCORRECT;
          await this.waitForFeedback();
        }
      }
    }
  }

  imageIsDisplayed(index : number) {
    return (
      this.stage == Stage.MEMORIZE ||
      this.stage == Stage.MASK ||
      this.incorrectFaces.indexOf(index) > -1 ||
      this.correctFaces.indexOf(this.randomFaces[index]) > -1 ||
      this.selectedFace == index
    )
  }

  resetSelected() {
    this.incorrectFaces = [];
    this.stage = Stage.SELECT;
    this.changeScore.stop();
  }

  async waitForFeedback() {
    this.selectedFace = null;

    if (this.stage == Stage.INCORRECT || this.stage == Stage.CORRECT) {
      this.changeScore = createAnimation()
        .addElement(document.querySelectorAll('.score-change'))
        .fill('none')
        .duration(2000)
        .keyframes([
          { offset: 0, transform: 'translateY(0%)' },
          { offset: 0.05, transform: 'translateY(100%)' },
          { offset: 0.1, transform: 'translateY(200%)' },
          { offset: 0.3, transform: 'translateY(200%)' },
          { offset: 0.5, transform: 'translateY(200%)' },
          { offset: 0.7, transform: 'translateY(200%)' },
          { offset: 0.9, transform: 'translateY(200%)' },
          { offset: 0.95, transform: 'translateY(100%)' },
          { offset: 1, transform: 'translateY(0%)' }
        ]);
      this.changeScore.play();
    }

    let promise = this.promise;
    await new Promise( resolve => setTimeout(resolve, 2000) );
    promise == this.promise ? this.resetSelected() : null;
  }

  async startMemorizeTimer() {

    if (this.stage == Stage.START) {

      let fadeOutOverlay = createAnimation()
      .addElement(document.querySelectorAll('.overlay'))
        .fill('none')
        .duration(200)
        .fromTo('opacity', '.9', '0');
      await fadeOutOverlay.play();

      this.timeRemaining = this.memorizeTime;
      this.stage = Stage.MEMORIZE;

      this.timer = timer(this.timeRemaining * 1000).subscribe(() => {
        this.startMaskTimer();
      });

      this.interval = interval(1000)
        .pipe(
          takeUntil(timer(this.timeRemaining * 1000))
        )
        .subscribe(async () => {
          let first = createAnimation()
            .addElement(document.querySelector('.time-left'))
            .fill('none')
            .duration(100)
            .keyframes([
              { offset: 0, transform: 'translateY(0%)', opacity: '1' },
              { offset: 1, transform: 'translateY(100%)', opacity: '0' }
            ]);
          await first.play();
          this.timeRemaining--;
          let second = createAnimation()
            .addElement(document.querySelector('.time-left'))
            .fill('none')
            .duration(100)
            .keyframes([
              { offset: 0, transform: 'translateY(-100%)', opacity: '0' },
              { offset: 1, transform: 'translateY(0%)', opacity: '1' }
            ]);
          await second.play();
        });
    }

  }

  startMaskTimer() {
    this.stage = Stage.MASK;
    this.timer = timer(2000).subscribe(() => {
      this.stage = Stage.SELECT;
    });
  }

  scoreCardDisplayed() {
    return !this.firstSlide;
  }

  revealFooter() {
    this.timer = timer(500).subscribe(async () => {
      let fadeIn = createAnimation()
        .addElement(document.querySelectorAll('.footer'))
        .fill('none')
        .duration(500)
        .fromTo('opacity', '0', '0.75');
      await fadeIn.play();
      Array.from(document.getElementsByClassName('footer') as HTMLCollectionOf<HTMLElement>)[0].style.opacity = '0.75';  
    });
  }
}