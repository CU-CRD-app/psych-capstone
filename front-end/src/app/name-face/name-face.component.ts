import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { timer } from 'rxjs';
import { createAnimation } from '@ionic/core';

enum Stage { SELECT, CORRECT, INCORRECT, DONE }

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
  progress : number = 0;
  progressPercent : number = 0;
  score : number = 0;
  numberOfOptions : number = 6;

  selectedFace : string[] = [];

  shuffledNames : any;
  currentSlide : number = 0;
  slideInfo : any;

  chooseFace(face : string) {
    if (!this.showFeedback()) {
      this.slideInfo[this.currentSlide].selectedFace = face;
      if (face == this.slideInfo[this.currentSlide].correctFace) {
        this.score++;
        this.slideInfo[this.currentSlide].stage = Stage.CORRECT;
      } else {
        this.slideInfo[this.currentSlide].stage = Stage.INCORRECT;
      }
      this.progressPercent = (this.progress + 1)/this.facePaths.length;
      this.slideElement.lockSwipes(false);
      this.slideElement.lockSwipeToPrev(true);
      
      let slide = this.currentSlide;
      timer(1000).subscribe(async () => {
        let fadeIn = createAnimation()
        .addElement(document.querySelectorAll('.footer'))
        .fill('none')
        .duration(500)
        .fromTo('opacity', '0', '0.75');
        if (slide == this.currentSlide) {
          await fadeIn.play();
          Array.from(document.getElementsByClassName('footer') as HTMLCollectionOf<HTMLElement>)[this.currentSlide].style.opacity = '.75';  
        }
      });
    }
  }

  getSlideFaces(index : number) {
    let faces : string[];

    faces = [];
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
    if (this.currentSlide < this.setNames.length) {
      return this.slideInfo[this.currentSlide].stage == Stage.CORRECT || this.slideInfo[this.currentSlide].stage == Stage.INCORRECT;
    }
    return false;
  }

  async changeSlide() {
    if (await this.slideElement.getActiveIndex() > this.currentSlide) {
      this.currentSlide = await this.slideElement.getActiveIndex();
      await this.slideElement.lockSwipes(true);
      this.progress++;
      Array.from(document.getElementsByClassName('footer') as HTMLCollectionOf<HTMLElement>)[this.currentSlide].style.opacity = '0';
    }
  }
}
