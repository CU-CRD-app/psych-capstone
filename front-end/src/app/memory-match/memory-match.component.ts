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
      Array.from(document.getElementsByClassName('overlay') as HTMLCollectionOf<HTMLElement>)[0].style.opacity = '.9';  
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
  mask : string = 'assets/background_imgs/mask1.png';
  memorizeTime : number = 10;

  stage : Stage;
  score : number;
  promise : number;
  progressPercent : number;
  timeRemaining : number;
  interval : any;
  timer : any;

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
          this.stage = Stage.CORRECT;

          if (this.correctFaces.length == this.facePaths.length) { // Done
            this.score = Math.ceil(this.score) + this.facePaths.length;
            this.slideElement.lockSwipes(false);
            this.revealFooter();
          }
          await this.waitForFeedback();

        } else { // Incorrect
          this.incorrectFaces.push(this.selectedFace);
          this.incorrectFaces.push(face);
          this.score -= 0.25;
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
  }

  async waitForFeedback() {
    this.selectedFace = null;
    let promise = this.promise
    await new Promise( resolve => setTimeout(resolve, 2000) );
    promise == this.promise ? this.resetSelected() : 0;
  }

  async startMemorizeTimer() {

    if (this.stage == Stage.START) {

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
          let inflate = createAnimation()
            .addElement(document.querySelector('.time-left'))
            .fill('none')
            .duration(400)
            .keyframes([
              { offset: 0, transform: 'scale(1, 1)' },
              { offset: 0.5, transform: 'scale(2, 2)' },
              { offset: 1, transform: 'scale(1, 1)' }
            ]);
          this.timeRemaining--;
          if (this.timeRemaining > this.memorizeTime - 2 || this.timeRemaining < 4) {
            await inflate.play();
          }
        });
    }

  }

  startMaskTimer() {
    this.stage = Stage.MASK;
    this.timer = timer(2000).subscribe(() => {
      this.stage = Stage.SELECT;
    });
  }

  revealFooter() {
    this.timer = timer(500).subscribe(async () => {
      let fadeIn = createAnimation()
        .addElement(document.querySelectorAll('.footer'))
        .fill('none')
        .duration(500)
        .fromTo('opacity', '0', '1');
      await fadeIn.play();
      Array.from(document.getElementsByClassName('footer') as HTMLCollectionOf<HTMLElement>)[0].style.opacity = '1';  
    });
  }
}