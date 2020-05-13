import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { createAnimation } from '@ionic/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

enum Stage { SELECT, CORRECT, INCORRECT }

@Component({
  selector: 'app-whos-new',
  templateUrl: './whos-new.component.html',
  styleUrls: ['./whos-new.component.scss'],
  animations: [
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
export class WhosNewComponent implements OnInit {
  @Input() facePaths : string[];
  @Input() newFacePaths : string[];
  @Output() finished = new EventEmitter<[number, number]>();
  @ViewChild('slideElement') slideElement: IonSlides;

  constructor() {}
  
  ngOnInit() {

    this.score = 0;
    this.currentSlide = 0;
    this.progressPercent = 0;
    this.changeScore = createAnimation();
    this.taskLength = this.newFacePaths.length;

    // Initialize shuffled face list
    this.shuffledFaces = [];
    for (let face = 0; face < this.taskLength; face++) {
      this.shuffledFaces.push(this.newFacePaths[face]);
    }
    // Shuffle Faces
    for (let i = this.taskLength - 1; i > 0; i -= 1) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.shuffledFaces[i];
      this.shuffledFaces[i] = this.shuffledFaces[j];
      this.shuffledFaces[j] = temp;
    }

    this.slideInfo = [];
    for (let i = 0; i < this.taskLength; i++) {
      this.slideInfo.push({
        correctFace: this.shuffledFaces[i],
        selectedFace: null,
        faces: this.getSlideFaces(i),
        stage: Stage.SELECT
      });
    }
  }

  ngAfterViewInit() {
    this.slideElement.lockSwipes(true);
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
  numberOfOptions : number = 4;

  score : number;
  currentSlide : number;
  progressPercent : number;
  taskLength : number;
  shuffledFaces : any;
  slideInfo : any;
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
    }
  }

  getSlideFaces(index : number) {
    let faces = [];
    for (let i = 0; i < this.numberOfOptions - 1; i++) { // Select three faces from today's set
      let j = Math.floor(Math.random() * this.taskLength);
      while (faces.indexOf(this.facePaths[j]) > -1) { // Account for repeats
        j = Math.floor(Math.random() * this.taskLength);
      }
      faces.push(this.facePaths[j]);
    }
    let j = Math.floor(Math.random() * this.numberOfOptions);
    faces.splice(j, 0, this.shuffledFaces[index]); // Add in current face
    return faces;
  }
  
  showDisabled(face : number) {
    return this.showFeedback() && this.slideInfo[this.currentSlide].correctFace != this.slideInfo[this.currentSlide].faces[face];
  }

  showSelected(face : number) {
    return this.showFeedback() &&
      this.slideInfo[this.currentSlide].faces[face] != this.slideInfo[this.currentSlide].correctFace &&
      this.slideInfo[this.currentSlide].faces[face] == this.slideInfo[this.currentSlide].selectedFace;
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
    }
  }
}
