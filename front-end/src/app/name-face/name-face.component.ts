import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

enum Stage { SELECT, CORRECT, INCORRECT, DONE }

@Component({
  selector: 'app-name-face',
  templateUrl: './name-face.component.html',
  styleUrls: ['./name-face.component.scss'],
})
export class NameFaceComponent implements OnInit {
  @Input() setNames : string;
  @Input() facePaths : string;
  @Output() finished = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {
    // Initialize shuffled name and face lists
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
    this.setNextFaces();
  }

  Stage = Stage;
  stage : Stage = Stage.SELECT;
  progress : number = 0;
  progressPercent : number = 0;
  score : number = 0;
  numberOfOptions : number = 6;

  currentFace : string;
  currentName : string;
  selectedFace : string = null;

  shuffledNames : any[] = [];
  shuffledFaces : any[] = [];

  chooseFace(face : string) {
    if (!this.showFeedback()) {
      this.selectedFace = face;
      if (face == this.currentFace) {
        this.score++;
        this.stage = Stage.CORRECT;
      } else {
        this.stage = Stage.INCORRECT;
      }
      this.progressPercent = (this.progress + 1)/this.facePaths.length;
    } else {
      this.nextFace();
    }
  }

  nextFace() {
    this.selectedFace = null;
    this.stage = Stage.SELECT;
    this.progress++;
    this.setNextFaces();
  }

  setNextFaces() {
    this.currentName = this.shuffledNames[this.progress];
    this.currentFace = this.facePaths[this.setNames.indexOf(this.currentName)];

    this.shuffledFaces = [];
    for (let i = 0; i < this.numberOfOptions - 1; i++) { // Select five faces
      let j = Math.floor(Math.random() * this.facePaths.length);
      while (this.shuffledFaces.indexOf(this.facePaths[j]) > -1 || this.facePaths[j] == this.currentFace) { // Account for repeats
        j = Math.floor(Math.random() * this.facePaths.length);
      }
      this.shuffledFaces.push(this.facePaths[j]);
    }
    let j = Math.floor(Math.random() * this.numberOfOptions);
    this.shuffledFaces.splice(j, 0, this.currentFace); // Add in current face
  }

  showDisabled(i : number) {
    return this.showFeedback() && this.shuffledFaces[i] != this.currentFace;
  }

  showSelected(i : number) {
    return this.showFeedback() && this.shuffledFaces[i] != this.currentFace && this.shuffledFaces[i] == this.selectedFace;
  }

  getName(face : number) {
    if (this.showFeedback() && (!this.showDisabled(face) || this.showSelected(face))) {
      return this.setNames[this.facePaths.indexOf(this.shuffledFaces[face])];
    } else {
      return '';
    }
  }

  showFeedback() {
    return this.stage == Stage.CORRECT || this.stage == Stage.INCORRECT;
  }
}
