import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { timer, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { createAnimation } from '@ionic/core';
import { IonSlides } from '@ionic/angular';
import { trigger, state, style, transition, animate, keyframes} from '@angular/animations';

enum Stage { START, MEMORIZE, MASK, SELECT, CORRECT, INCORRECT }

@Component({
  selector: 'app-same-different',
  templateUrl: './same-different.component.html',
  styleUrls: ['./same-different.component.scss'],
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
      state('sameDifferent', style({
        opacity: 1,
      })),
      state('invisible', style({
        opacity: 0,
      })),
      transition('void => visible', [
        animate(1500, keyframes([
          style({ opacity: '0' }),
          style({ opacity: '0' }),
          style({ opacity: '0' }),
          style({ opacity: '.75' }),
        ]))
      ]),
      transition('void => sameDifferent', [
        animate(500)
      ]),
      transition('visible => invisible', [
        animate(200)
      ])
    ]),
    trigger('swipeCard', [
      transition('right => void', [
        animate(200, keyframes([
          style({ transform: '*', position: 'absolute', zIndex: '21' }),
          style({ transform: 'translateY(-50%) translateX(100%) rotate(100deg)', position: 'absolute', zIndex: '21' })
        ]))
      ]),
      transition('left => void', [
        animate(200, keyframes([
          style({ transform: '*', position: 'absolute', zIndex: '21' }),
          style({ transform: 'translateY(-50%) translateX(-100%) rotate(-100deg)', position: 'absolute', zIndex: '21' })
        ]))
      ])
    ])
  ],
})
export class SameDifferentComponent implements OnInit {
  @Input() facePaths : string[];
  @Output() finished = new EventEmitter<[number, number]>();
  @ViewChild('slideElement') slideElement: IonSlides;

  constructor() { }

  ngOnInit() {

    this.currentSlide = 0;
    this.progressPercent = 0;
    this.score = 0;
    this.changeScore = createAnimation();
    this.taskLength = this.facePaths.length;

    this.slideInfo = [];
    for (let i = 0; i < this.taskLength; i++) {

      let displayedFace = this.facePaths[i];
      if (Math.random() > .5) {
        displayedFace = this.facePaths[Math.floor(Math.random() * this.taskLength)];
      }

      this.slideInfo.push({
        correctFace: this.facePaths[i],
        displayedFace: displayedFace,
        selection: null,
        stage: Stage.START
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

  Stage = Stage;
  mask : string = 'assets/background_imgs/mask1.png';
  memorizeTime : number = 3;

  currentSlide : number
  progressPercent : number;
  score : number;
  timeRemaining : number;
  taskLength : number;
  interval : any;
  timer : any;
  slideInfo : any;
  changeScore : any;

  async selectFace(sameFace : boolean) {

    if (this.slideInfo[this.currentSlide].stage == Stage.SELECT) {

      this.slideInfo[this.currentSlide].selection = sameFace;
      this.timer = timer(10).subscribe(() => {
        if (sameFace == (this.slideInfo[this.currentSlide].displayedFace == this.slideInfo[this.currentSlide].correctFace)) {
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

      });
    }
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
        /*{ offset: 0.075, transform: 'rotateY(90deg) translateY(-20%)' },*/
        { offset: 0.15, transform: 'rotateY(180deg)' },
        { offset: 0.85, transform: 'rotateY(180deg)' },
        /*{ offset: 0.925, transform: 'rotateY(90deg) translateY(-20%)' },*/
        { offset: 1, transform: 'rotateY(0deg)' }
      ]);
    flipCard.play();

    this.timer = timer(400).subscribe(async () => {
      this.slideInfo[this.currentSlide].stage = Stage.MASK;
    });

    this.timer = timer(2400).subscribe(async () => {
      this.slideInfo[this.currentSlide].stage = Stage.SELECT;
    });
  }

  getSrc(index : number) {
    if (this.slideInfo[index].stage == Stage.MEMORIZE) {
      return this.slideInfo[index].correctFace;
    } else if (this.slideInfo[index].stage == Stage.MASK) {
      return null;
    } else {
      return this.slideInfo[index].displayedFace;
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
      if (!this.scoreCardDisplayed()) {
        this.startMemorizeTimer();
      }
    }
  }

  drag(event : any) {
    if (this.slideInfo[this.currentSlide].stage == Stage.SELECT) {
      let card = Array.from(document.getElementsByClassName('flipper') as HTMLCollectionOf<HTMLElement>)[0];
      card.setAttribute("style", `transform: translateX(${event.deltaX}px) translateY(-${Math.abs(event.deltaX/2)}px) rotate(${event.deltaX/3}deg)`);
    }
  }

  returnCenter(event : any) {
    if (Math.abs(event.velocityX) > .5) {
      if (event.velocityX < 0) {
        this.slideInfo[this.currentSlide].selection = true;
        this.selectFace(true);
      } else {
        this.slideInfo[this.currentSlide].selection = false;
        this.selectFace(false);
      }
    } else {
      let card = Array.from(document.getElementsByClassName('flipper') as HTMLCollectionOf<HTMLElement>)[0];
      card.setAttribute("style", "transform: translateX(0px) transform: translateY(0px) transform: rotate(0px)");
    }
  }

}
