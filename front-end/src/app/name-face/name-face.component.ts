import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { timer } from 'rxjs';
import { createAnimation } from '@ionic/core';

enum Stage { SELECT, CORRECT, INCORRECT }

@Component({
  selector: 'app-name-face',
  templateUrl: './name-face.component.html',
  styleUrls: ['./name-face.component.scss'],
})
export class NameFaceComponent implements OnInit {
  @Input() setNames : string[];
  @Input() facePaths : string[];
  @Output() finished = new EventEmitter<[number, number]>();
  @ViewChild('slideElement', {static: false}) slideElement: IonSlides;

  constructor() {}

  ngOnInit() {

    this.score = 0;
    this.currentSlide = 0;
    this.progressPercent = 0;
    this.fadeIn = createAnimation();

    // Initialize shuffled name list
    this.shuffledNames = [];
    for (let name = 0; name < this.setNames.length; name++) {
      this.shuffledNames.push(this.setNames[name]);
    }
    // Shuffle Names
    for (let i = this.shuffledNames.length - 1; i > 0; i -= 1) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.shuffledNames[i];
      this.shuffledNames[i] = this.shuffledNames[j];
      this.shuffledNames[j] = temp;
    }

    this.slideInfo = [];
    for (let i = 0; i < this.shuffledNames.length; i++) {
      this.slideInfo.push({
        correctName: this.shuffledNames[i],
        correctFace: this.facePaths[this.setNames.indexOf(this.shuffledNames[i])],
        selectedFace: null,
        faces: this.getSlideFaces(i),
        stage: Stage.SELECT
      });
    }
  }

  ngAfterViewInit() {
    this.slideElement.lockSwipes(true);
  }

  Stage = Stage;
  numberOfOptions : number = 6;

  score : number;
  currentSlide : number;
  progressPercent : number;
  shuffledNames : any;
  slideInfo : any;
  fadeIn : any;

  selectFace(face : string) {
    if (this.slideInfo[this.currentSlide].stage == Stage.SELECT) {
      this.slideInfo[this.currentSlide].selectedFace = face;
      if (face == this.slideInfo[this.currentSlide].correctFace) {
        this.score++;
        this.slideInfo[this.currentSlide].stage = Stage.CORRECT;
      } else {
        this.slideInfo[this.currentSlide].stage = Stage.INCORRECT;
      }
      this.progressPercent = (this.currentSlide + 1)/this.facePaths.length;
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
      let j = Math.floor(Math.random() * this.facePaths.length);
      while (faces.indexOf(this.facePaths[j]) > -1 || this.facePaths[j] == this.facePaths[this.setNames.indexOf(this.shuffledNames[index])]) { // Account for repeats
        j = Math.floor(Math.random() * this.facePaths.length);
      }
      faces.push(this.facePaths[j]);
    }
    let j = Math.floor(Math.random() * this.numberOfOptions);
    faces.splice(j, 0, this.facePaths[this.setNames.indexOf(this.shuffledNames[index])]); // Add in current face
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

  getName(face : number) {
    if (this.showFeedback() && (!this.showDisabled(face) || this.showSelected(face))) {
      return this.setNames[this.facePaths.indexOf(this.slideInfo[this.currentSlide].faces[face])];
    } else {
      return '';
    }
  }

  showFeedback() {
    return !this.endCardDisplayed() && (this.slideInfo[this.currentSlide].stage == Stage.CORRECT || this.slideInfo[this.currentSlide].stage == Stage.INCORRECT);
  }

  endCardDisplayed() {
    return this.currentSlide >= this.setNames.length;
  }

  async changeSlide() {
    if (await this.slideElement.getActiveIndex() > this.currentSlide) {
      this.currentSlide = await this.slideElement.getActiveIndex();
      await this.slideElement.lockSwipes(true);
      await this.fadeIn.stop();
      let footers = Array.from(document.getElementsByClassName('footer') as HTMLCollectionOf<HTMLElement>);
      for (let i = 0; i < footers.length; i++) {
        footers[i].style.opacity = '0';
      }
    }
  }
}
