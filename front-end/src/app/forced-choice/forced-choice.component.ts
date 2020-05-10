import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { timer, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { createAnimation } from '@ionic/core';
import { IonSlides } from '@ionic/angular';

enum Stage { START, MEMORIZE, MASK, SELECT, CORRECT, INCORRECT }

@Component({
  selector: 'app-forced-choice',
  templateUrl: './forced-choice.component.html',
  styleUrls: ['./forced-choice.component.scss'],
})
export class ForcedChoiceComponent implements OnInit {
  @Input() facePaths : string[];
  @Output() finished = new EventEmitter<[number, number]>();
  @ViewChild('slideElement', {static: false}) slideElement: IonSlides;

  constructor() { }

  ngOnInit() {

    this.currentSlide = 0;
    this.progressPercent = 0;
    this.score = 0;
    this.fadeIn = createAnimation();
    this.changeScore = createAnimation();
    this.taskLength = this.facePaths.length;

    this.slideInfo = [];
    for (let i = 0; i < this.taskLength; i++) {
      this.slideInfo.push({
        correctFace: this.facePaths[i],
        selectedFace: null,
        faces: this.getSlideFaces(i),
        stage: Stage.START
      });
    }

    this.timer = timer(500).subscribe(async () => {
      let fadeInOverlay = createAnimation()
        .addElement(document.querySelectorAll('.overlay'))
        .fill('none')
        .duration(500)
        .fromTo('opacity', '0', '.9');
      await fadeInOverlay.play();
      if (this.slideInfo[this.currentSlide].stage == Stage.START) {
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

  Stage = Stage;
  numberOfOptions = 4;
  mask : string = 'assets/background_imgs/mask1.png';
  memorizeTime : number = 3;

  currentSlide : number;
  progressPercent : number;
  score : number;
  timeRemaining : number;
  taskLength : number;
  interval : any;
  timer : any;
  slideInfo : any;
  fadeIn : any;
  changeScore : any;

  selectFace(face : string) {
    if (this.slideInfo[this.currentSlide].stage == Stage.SELECT) {
      this.slideInfo[this.currentSlide].selectedFace = face;
      if (face == this.slideInfo[this.currentSlide].correctFace) {
        this.score++;
        this.slideInfo[this.currentSlide].stage = Stage.CORRECT;
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
      } else {
        this.slideInfo[this.currentSlide].stage = Stage.INCORRECT;
      }
      this.progressPercent = (this.currentSlide + 1)/this.taskLength;

      this.slideElement.lockSwipes(false);
      this.slideElement.lockSwipeToPrev(true);
      
      let slide = this.currentSlide;
      timer(1000).subscribe(async () => {
        this.fadeIn = createAnimation()
          .addElement(document.querySelectorAll('.footer'))
          .fill('none')
          .duration(500)
          .fromTo('opacity', '0', '0.75');
        if (slide == this.currentSlide) {
          await this.fadeIn.play();
          Array.from(document.getElementsByClassName('footer') as HTMLCollectionOf<HTMLElement>)[this.currentSlide].style.opacity = '.75';  
        }
      });
    }
  }

  getSlideFaces(index : number) {
    let faces = [];
    for (let i = 0; i < this.numberOfOptions - 1; i++) { // Select five faces
      let j = Math.floor(Math.random() * this.taskLength);
      while (faces.indexOf(this.facePaths[j]) > -1 || this.facePaths[j] == this.facePaths[index]) { // Account for repeats
        j = Math.floor(Math.random() * this.taskLength);
      }
      faces.push(this.facePaths[j]);
    }
    let j = Math.floor(Math.random() * this.numberOfOptions);
    faces.splice(j, 0, this.facePaths[index]); // Add in current face
    return faces;
  }

  async startMemorizeTimer() {

    if (this.currentSlide == 0) {
      let fadeOutOverlay = createAnimation()
        .addElement(document.querySelectorAll('.overlay'))
        .fill('none')
        .duration(200)
        .fromTo('opacity', '.9', '0');
      await fadeOutOverlay.play();
    }

    this.timeRemaining = this.memorizeTime;
    this.slideInfo[this.currentSlide].stage = Stage.MEMORIZE;
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

  startMaskTimer() {
    this.slideInfo[this.currentSlide].stage = Stage.MASK;
    this.timer = timer(2000).subscribe(() => {
      this.slideInfo[this.currentSlide].stage = Stage.SELECT;
    });
  }

  firstStage(index : number) {
    return this.slideInfo[index].stage == Stage.START || this.slideInfo[index].stage == Stage.MEMORIZE || this.slideInfo[index].stage == Stage.MASK;
  }

  getSrc(index : number) {
    if (this.slideInfo[index].stage == Stage.MEMORIZE) {
      return this.slideInfo[index].correctFace;
    } else if (this.slideInfo[index].stage == Stage.MASK) {
      return this.mask;
    } else {
      return null;
    }
  }

  showFeedback() {
    return !this.scoreCardDisplayed() && (this.slideInfo[this.currentSlide].stage == Stage.CORRECT || this.slideInfo[this.currentSlide].stage == Stage.INCORRECT);
  }

  scoreCardDisplayed() {
    return this.currentSlide >= this.taskLength;
  }

  async changeSlide() {
    if (await this.slideElement.getActiveIndex() > this.currentSlide) {
      this.currentSlide = await this.slideElement.getActiveIndex();
      await this.slideElement.lockSwipes(true);
      await this.changeScore.stop();
      await this.fadeIn.stop();
      let footers = Array.from(document.getElementsByClassName('footer') as HTMLCollectionOf<HTMLElement>);
      for (let i = 0; i < footers.length; i++) {
        footers[i].style.opacity = '0';
      }

      if (!this.scoreCardDisplayed()) {
        this.startMemorizeTimer();
      }
    }
  }
}