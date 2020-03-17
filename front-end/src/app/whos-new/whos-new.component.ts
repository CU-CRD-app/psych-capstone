import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-whos-new',
  templateUrl: './whos-new.component.html',
  styleUrls: ['./whos-new.component.scss'],
})
export class WhosNewComponent implements OnInit {
  @Input() facePaths : string;
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
  progress : number = 0; 
  chosenNum : number = 0;
  newNum : number = 0;
  
  new_name : string = "";
  newFace : string = "";
  
  usedNumbers : number[] = [];
  shuffledFaces : any[] = [];

  next_round : boolean = false;
  res_correct : boolean = false;

  addNewFace() {
      this.new_name = "./../../assets/sample-faces/CFD-BM-045-004-N.png"
      return this.new_name;
  }
  
  getNewNumber(numSet : number[]) {
      // generate random number
      this.newNum = Math.floor(Math.random() * 8);
      
      // if number generated already taken, get a new one
      for (let i=0; i < numSet.length; i++) {
          if (this.newNum == numSet[i]) {
              return this.getNewNumber(numSet);
          }
      }
      
      this.usedNumbers.push(this.newNum);
      
      return this.newNum;
  }
  
  resetRoundVals() {
    this.next_round = false;
    
    // dump old images, and repeat initalization process
    for (let i = 0; i < this.shuffledFaces.length; i++) {
      this.shuffledFaces[i] = "";
    }
    for (let i = 0; i < this.usedNumbers.length; i++) {
      this.usedNumbers[i] = null;
    }   
  }
  

  chooseCard(input : number) {
      this.next_round = true;
      this.progress++;
      
      // determine if correct or not
      if (input == this.chosenNum) {
        this.res_correct = true;
        this.score++;
	  } else {
        this.res_correct = false;
      }      
  }
}
