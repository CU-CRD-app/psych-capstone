import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

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
      this.shuffledFaces.push(this.facePaths[name]);
    }
    // Shuffle Names
    for (let i = this.shuffledNames.length - 1; i > 0; i -= 1) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.shuffledNames[i];
      this.shuffledNames[i] = this.shuffledNames[j];
      this.shuffledNames[j] = temp;
    }
    // Shuffle Faces
    for (let i = this.shuffledNames.length - 1; i > 0; i -= 1) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.shuffledFaces[i];
      this.shuffledFaces[i] = this.shuffledFaces[j];
      this.shuffledFaces[j] = temp;
    }
    this.currentName = this.shuffledNames[this.progress];
    this.currentFace = this.facePaths[this.setNames.indexOf(this.currentName)];
  }

  progress : number = 0;
  score : number = 0;

  currentFace : string;
  currentName : string;
  showFeedback : boolean = false;
  correctSelection : boolean;
  selectedFace : string = null;

  shuffledNames : any[] = [];
  shuffledFaces : any[] = [];

  chooseFace(face : string) {
    this.selectedFace = face;
    if (face == this.currentFace) {
      this.score++;
      this.correctSelection = true;
    } else {
      this.correctSelection = false;
    }
    this.showFeedback = true;
  }

  nextFace() {
    this.selectedFace = null;
    this.showFeedback = false;
    this.progress++;
    this.currentName = this.shuffledNames[this.progress];
    this.currentFace = this.facePaths[this.setNames.indexOf(this.currentName)];

    //Shuffle displayed names after each guess
    for (let i = this.shuffledFaces.length - 1; i > 0; i -= 1) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.shuffledFaces[i];
      this.shuffledFaces[i] = this.shuffledFaces[j];
      this.shuffledFaces[j] = temp;
    }
  }

}
