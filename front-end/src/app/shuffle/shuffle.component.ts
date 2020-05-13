import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { timer, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { createAnimation } from '@ionic/core';
import { IonSlides } from '@ionic/angular';
import { trigger, state, style, transition, animate, keyframes} from '@angular/animations';

enum Stage { START, MEMORIZE, MASK, SELECT, CORRECT, INCORRECT }

@Component({
  selector: 'app-shuffle',
  templateUrl: './shuffle.component.html',
  styleUrls: ['./shuffle.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('visible', style({
        opacity: .9,
      })),
      state('invisible', style({
        opacity: 0,
      })),
      transition(':enter', [
        animate(500)
      ]),
      transition(':leave', [
        animate(500)
      ])
    ]),
    trigger('countdown', [
      transition('active <=> inactive', [
        animate(200, keyframes([
          style({ transform: 'translateY(0%)', opacity: '1' }),
          style({ transform: 'translateY(75%)', opacity: '0' }),
          style({ transform: 'translateY(-75%)', opacity: '0' }),
          style({ transform: 'translateY(0%)', opacity: '1' })
        ]))
      ])
    ]),
    trigger('fadeFooter', [
      state('visible', style({
        opacity: .75,
      })),
      state('invisible', style({
        opacity: 0,
      })),
      transition('invisible => visible', [
        animate(1500, keyframes([
          style({ opacity: '0' }),
          style({ opacity: '0' }),
          style({ opacity: '0' }),
          style({ opacity: '.75' }),
        ]))
      ]),
      transition('visible => invisible', [
        animate(200)
      ])
    ])
  ]
})
export class ShuffleComponent implements OnInit {
  @Input() facePaths : string[];
  @Output() finished = new EventEmitter<[number, number]>();
  @ViewChild('slideElement') slideElement: IonSlides;

  constructor() { }

  ngOnInit() {

    this.currentSlide = 0;
    this.progressPercent = 0;
    this.score = 0;
    this.changeScore = createAnimation();

    this.slideInfo = [];
    for (let i = 0; i < this.numberOfSlides; i++) {
      let correctFaces = this.getSlideFaces(i);
      this.slideInfo.push({
        correctOrder: correctFaces,
        shuffledOrder: this.shuffleFaces(correctFaces),
        stage: Stage.START,
        feedback: true,
        selectedFace: null
      });
    }

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
  numberOfOptions = 4;
  numberOfSlides = 4;
  mask : string = 'assets/background_imgs/mask1.png';
  memorizeTime : number = 10;
  taskLength : number = this.numberOfOptions * this.numberOfSlides; // 16

  currentSlide : number;
  progressPercent : number;
  score : number;
  changeScoreValue : number;
  timeRemaining : number;
  interval : any;
  timer : any;
  slideInfo : any;
  changeScore : any;

  clickDone() {
    this.changeScoreValue = this.numberOfOptions;
    this.slideInfo[this.currentSlide].selectedFace = null;
    for (let i = 0; i < this.slideInfo[this.currentSlide].shuffledOrder.length; i++) {
      if (this.slideInfo[this.currentSlide].shuffledOrder[i] != this.slideInfo[this.currentSlide].correctOrder[i]) {
        this.changeScoreValue -= 1;
      }
    }
    this.score += this.changeScoreValue;
    if (this.changeScoreValue == this.numberOfOptions) {
      this.slideInfo[this.currentSlide].stage = Stage.CORRECT;
    } else {
      this.slideInfo[this.currentSlide].stage = Stage.INCORRECT;
    }
    this.progressPercent = (this.currentSlide + 1)/this.numberOfSlides;

    this.slideElement.lockSwipes(false);
    this.slideElement.lockSwipeToPrev(true);

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

  getSlideFaces(index : number) {
    let faces = [];
    for (let i = 0; i < this.numberOfOptions - 1; i++) { // Select five faces
      let j = Math.floor(Math.random() * this.facePaths.length);
      while (faces.indexOf(this.facePaths[j]) > -1 || this.facePaths[j] == this.facePaths[index]) { // Account for repeats
        j = Math.floor(Math.random() * this.facePaths.length);
      }
      faces.push(this.facePaths[j]);
    }
    let j = Math.floor(Math.random() * this.numberOfOptions);
    faces.splice(j, 0, this.facePaths[index]); // Add in current face
    return faces;
  }

  shuffleFaces(faces : any[]) {
    let randomFaceOrder = [];
    for (let i = 0; i < faces.length; i++) {
      randomFaceOrder.push(faces[i]);
    }
    for (let i = randomFaceOrder.length - 1; i > 0; i -= 1) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = randomFaceOrder[i];
      randomFaceOrder[i] = randomFaceOrder[j];
      randomFaceOrder[j] = temp;
    }
    return randomFaceOrder;
  }

  async startMemorizeTimer() {

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
        this.timeRemaining--;
      });
  }

  async startMaskTimer() {
    
    let flipCard = createAnimation()
      .addElement(document.querySelectorAll('.flipper'))
      .fill('none')
      .duration(2800)
      .keyframes([
        { offset: 0, transform: 'rotateY(0deg)' },
        { offset: 0.15, transform: 'rotateY(180deg)' },
        { offset: 0.85, transform: 'rotateY(180deg)' },
        { offset: 1, transform: 'rotateY(0deg)' }
      ]);
    flipCard.play();

    this.timer = timer(400).subscribe(async () => {
      this.slideInfo[this.currentSlide].stage = Stage.MASK;
    });

    this.timer = timer(2200).subscribe(async () => {
      this.slideInfo[this.currentSlide].stage = Stage.SELECT;
    });
  }

  getSrc(index : number) {
    if (this.slideInfo[this.currentSlide].stage == Stage.MASK) {
      return null;
    } else if (this.slideInfo[this.currentSlide].stage == Stage.SELECT || (this.slideInfo[this.currentSlide].stage == Stage.INCORRECT && this.slideInfo[this.currentSlide].feedback)) {
      return this.slideInfo[this.currentSlide].shuffledOrder[index];
    } else {
      return this.slideInfo[this.currentSlide].correctOrder[index];
    }
  }

  async clickCard(index : number) {
    if (this.slideInfo[this.currentSlide].stage == Stage.SELECT) {
      let button = createAnimation()
        .addElement(document.querySelectorAll('.small-card')[index])
        .fill('none')
        .duration(400)
        .keyframes([
          { offset: 0, transform: 'scale(1, 1)' },
          { offset: 0.5, transform: 'scale(0.95, 0.95)' },
          { offset: 1, transform: 'scale(1, 1)' }
        ]);
      button.play();
      if (this.slideInfo[this.currentSlide].selectedFace == null) {
        this.slideInfo[this.currentSlide].selectedFace = this.slideInfo[this.currentSlide].shuffledOrder[index];
      } else {
        let index_selected : number = this.slideInfo[this.currentSlide].shuffledOrder.indexOf(this.slideInfo[this.currentSlide].selectedFace);
        [this.slideInfo[this.currentSlide].shuffledOrder[index], this.slideInfo[this.currentSlide].shuffledOrder[index_selected]] = [this.slideInfo[this.currentSlide].shuffledOrder[index_selected], this.slideInfo[this.currentSlide].shuffledOrder[index]];
        this.slideInfo[this.currentSlide].selectedFace = null;
      }
    } else if (this.showFeedback()) {
      await this.animateCardChange();
      this.slideInfo[this.currentSlide].feedback = !this.slideInfo[this.currentSlide].feedback;
    }
  }

  async animateCardChange() {
    let animations = [];
    for (let i = 0; i < this.slideInfo[this.currentSlide].correctOrder.length; i++) {
      let shuffledIndex = this.slideInfo[this.currentSlide].shuffledOrder.indexOf(this.slideInfo[this.currentSlide].correctOrder[i]);
      let ampX = '0px';
      let ampY = '0px';
      if (i != shuffledIndex) {

        if (Math.abs(i - shuffledIndex) == 1 || Math.abs(i - shuffledIndex) == 3) { // Left-Right
          ampX = '-125px';
          if ((i < shuffledIndex && !this.slideInfo[this.currentSlide].feedback) || (i > shuffledIndex && this.slideInfo[this.currentSlide].feedback)) { // Right
            ampX = '125px';
          }
          if (((i == 1 && shuffledIndex == 2) || (i == 2 && shuffledIndex == 1))) { // Reversed for 1-2 and 2-1
            ampX = ampX == '125px' ? '-125px' : '125px';
          }
        } 
        
        if (Math.abs(i - shuffledIndex) == 3 || Math.abs(i - shuffledIndex) == 2 || (Math.abs(i - shuffledIndex) == 1 && ((i == 1 && shuffledIndex == 2) || (i == 2 && shuffledIndex == 1)))) { // Up-Down
          ampY = '-150px';
          if ((i < shuffledIndex && !this.slideInfo[this.currentSlide].feedback) || (i > shuffledIndex && this.slideInfo[this.currentSlide].feedback)) { // Up
            ampY = '150px';
          }
        }
      }

      let card = this.slideInfo[this.currentSlide].feedback ? shuffledIndex : i;
      let cardID = '#card-' + card;

      let animation = createAnimation()
        .addElement(document.querySelectorAll(cardID)[this.currentSlide])
        .fill('none')
        .duration(300)
        .fromTo('transform', 'translate(0vw, 0vh)', 'translate(' + ampX + ', ' + ampY + ')');
      animations.push(animation);
    }

    for (let i = 0; i < animations.length; i++) {
      if (i == animations.length - 1) {
        await animations[i].play();
      } else {
        animations[i].play();
      }
    }
  }

  showFeedback() {
    return !this.scoreCardDisplayed() && (this.slideInfo[this.currentSlide].stage == Stage.CORRECT || this.slideInfo[this.currentSlide].stage == Stage.INCORRECT);
  }

  scoreCardDisplayed() {
    return this.currentSlide >= this.numberOfSlides;
  }

  async changeSlide() {
    if (await this.slideElement.getActiveIndex() > this.currentSlide) {
      this.currentSlide = await this.slideElement.getActiveIndex();
      await this.slideElement.lockSwipes(true);
      await this.changeScore.stop();
      if (!this.scoreCardDisplayed()) {
        this.startMemorizeTimer();
      }
    }
  }
}