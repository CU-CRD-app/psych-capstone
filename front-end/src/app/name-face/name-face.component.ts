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
    this.currentFace = this.shuffledFaces[this.progress];
    this.currentName = this.setNames[this.facePaths.indexOf(this.currentFace)]; // Name is based off of displayed face



    this.numNames = this.shuffledNames.length;
    this.numRows = Math.floor(this.numNames/3.0);
    this.last_row_length = this.numNames % 3;

    if (this.last_row_length != 0) //in case leftover names after rows of 3
    {
      this.numRows += 1;
    }

    for (let i = 0; i < this.numRows-1; i++) //let's do last row after this in terms of last_row_length
    {
      this.grid_names.push([this.shuffledNames[i*3 + 1],this.shuffledNames[i*3+2],this.shuffledNames[i*3+3]]);
    }

    for (let i = 0; i < this.last_row_length; i++)
    {
      this.last_row_names.push(this.shuffledNames[((this.numRows-1)*3)+i]);
    }
    if (this.last_row_names.length > 0)
    {
      this.grid_names.push(this.last_row_names);
    }

  }

  progress : number = 0;
  score : number = 0;

  currentFace : string;
  currentName : string;
  showFeedback : boolean = false;
  correctSelection : boolean;

  shuffledNames : any[] = [];
  shuffledFaces : any[] = [];

  nametagSource : string = "./../../assets/background_imgs/nametag.png";
  numNames : number = 0;
  numRows : number = 0;
  last_row_length : number = 0;
  last_row_names : string[] = [];
  grid_names : string[][] = [];

  chooseName(name : string) {
    if (name == this.currentName) {
      this.score++;
      this.correctSelection = true;
    } else {
      this.correctSelection = false;
    }
    this.showFeedback = true;
  }
  
  nextFace() {
    this.showFeedback = false;
    this.progress++;
    this.currentFace = this.shuffledFaces[this.progress];
    this.currentName = this.setNames[this.facePaths.indexOf(this.currentFace)];
    //Shuffle displayed names after each guess
    for (let i = this.shuffledNames.length - 1; i > 0; i -= 1) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.shuffledNames[i];
      this.shuffledNames[i] = this.shuffledNames[j];
      this.shuffledNames[j] = temp;
    }
  }

}
