import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-whos-new',
  templateUrl: './whos-new.component.html',
  styleUrls: ['./whos-new.component.scss'],
})
export class WhosNewComponent implements OnInit {
  @Input() facePaths : string[];
  @Input() newFacePaths : string[];
  @Output() finished = new EventEmitter<number>();

  constructor() {}
  
  ngOnInit() {
    this.resetRoundVals();
    
    // Initialize set first by selecting random numbers
    for (let i = 0; i < 4; i++) {
        this.newNum = this.getNewNumber(this.usedNumbers);
        this.shuffledFaces[i] = this.facePaths[this.newNum];
    }

    // Add new face randomly
    this.chosenNum = Math.floor(Math.random() * 4);
    this.shuffledFaces[this.chosenNum] = this.addNewFace();
  }

  score : number = 0;
  progress : number = -1;
  progressPercent : number = 0;
  chosenNum : number = 0;
  newNum : number = 0;
  userNum : number = 0;
  
  new_name : string = "";
  
  usedNumbers : number[] = [];
  shuffledFaces : any[] = [];
  newFacePathsCopy : string[];

  nextRound : boolean = false;
  resCorrect : boolean = false;

  addNewFace() {
    if (this.progress == 0) { // reinitialize new face pool
      this.newFacePathsCopy = [];
      for (let i = 0; i < this.newFacePaths.length; i++) {
        this.newFacePathsCopy.push(this.newFacePaths[i]);
      }
    }
    let newFaceIndex = Math.floor(Math.random() * this.newFacePathsCopy.length);
    let newFace = this.newFacePathsCopy[newFaceIndex];
    this.newFacePathsCopy.splice(newFaceIndex, 1);
    return newFace;
  }
  
  getNewNumber(numSet : number[]) {
    // generate random number
    this.newNum = Math.floor(Math.random() * 8);
    
    // if number generated already taken, get a new one
    for (let i = 0; i < numSet.length; i++) {
        if (this.newNum == numSet[i]) {
            return this.getNewNumber(numSet);
        }
    }
    
    this.usedNumbers.push(this.newNum);
    
    return this.newNum;
  }
  
  resetRoundVals() {
    this.nextRound = false;
    this.progress++;
    
    // dump old images, and repeat initalization process
    for (let i = 0; i < this.shuffledFaces.length; i++) {
      this.shuffledFaces[i] = "";
    }
    for (let i = 0; i < this.usedNumbers.length; i++) {
      this.usedNumbers[i] = null;
    }   
  }
  
  chooseCard(input : number) {
    if (!this.nextRound) {
      this.userNum = input;
      this.nextRound = true;
      this.progressPercent = (this.progress + 1)/this.facePaths.length;
      
      // determine if correct or not
      if (input == this.chosenNum) {
        this.resCorrect = true;
        this.score++;
      } else {
        this.resCorrect = false;
      }
    }
  }
  
  showDisabled(i : number) {
    return this.nextRound && this.shuffledFaces[i] != this.shuffledFaces[this.chosenNum];
  }

  showSelected(i : number) {
    return this.nextRound && this.shuffledFaces[i] == this.shuffledFaces[this.userNum];
  }

}
