import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

enum Stage { MEMORIZE, SELECT, CORRECT, INCORRECT, DONE }

@Component({
  selector: 'app-memory-match',
  templateUrl: './memory-match.component.html',
  styleUrls: ['./memory-match.component.scss'],
})
export class MemoryMatchComponent implements OnInit {
  @Input() setNames : string;
  @Input() facePaths : string;
  @Output() finished = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
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
  }

  Stage = Stage;  
  stage : Stage = Stage.MEMORIZE;
  score : number = 0;
  promise : number = 0;

  randomFaces : string[];
  correctFaces : string[] = [];
  incorrectFaces : number[] = [];
  selectedFace : number = null;

  async clickFace(face : number) {
    if (this.stage != Stage.MEMORIZE) { // Waiting for feedback
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
          this.score++;
          this.stage = Stage.CORRECT;
          await this.waitForFeedback();

        } else { // Incorrect
          this.incorrectFaces.push(this.selectedFace);
          this.incorrectFaces.push(face);
          this.score--;
          this.stage = Stage.INCORRECT;
          await this.waitForFeedback();
        }
      }
    }
  }

  isShown(index : number) {
    return (
      this.stage == Stage.MEMORIZE || 
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

  clickDone() {
    if (this.correctFaces.length == this.facePaths.length) {
      this.promise++;
      this.stage = Stage.DONE;
      this.score < 0 ? this.score = 0 : 0;
    }
  }
}