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
    this.currentName = this.setNames[this.progress];
    this.currentFace = this.facePaths[this.progress];
    for (let name of this.setNames) {
      this.shuffledNames.push(name);
    }
    for (let i = this.shuffledNames.length - 1; i > 0; i -= 1) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.shuffledNames[i];
      this.shuffledNames[i] = this.shuffledNames[j];
      this.shuffledNames[j] = temp;
    }
    //TO DO: shuffle pictures too
  }

  progress : number = 0;
  score : number = 0;

  currentFace : string;
  currentName : string;

  shuffledNames : any[] = [];

  nextFace(name : string) {
    if (name.toLowerCase() == this.currentName.toLowerCase()) {
      this.score++;
    }
    this.progress++;
    this.currentName = this.setNames[this.progress];
    this.currentFace = this.facePaths[this.progress];
  }

}
