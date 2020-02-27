import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-whos-new',
  templateUrl: './whos-new.component.html',
  styleUrls: ['./whos-new.component.scss'],
})
export class WhosNewComponent implements OnInit {
  @Input() setNames : string;
  @Input() facePaths : string;
  @Output() finished = new EventEmitter<number>();

  constructor() {}
 // style="height:220px; width:160px; margin: 0 auto; display: inline-block"
  ngOnInit() {
	  // Initialize set
	  for (let i = 0; i < this.facePaths.length; i++) {
        this.shuffledFaces.push(this.facePaths[i]);
      }
	  
      // then shuffle set by swapping randomly chosen points
      for (let i = this.shuffledFaces.length - 1; i > 0; i -= 1) {
          let j = Math.floor(Math.random() * (i + 1));
          let temp = this.shuffledFaces[i];
          this.shuffledFaces[i] = this.shuffledFaces[j];
          this.shuffledFaces[j] = temp;
      }
      
      // Replace one face with new, unseen one
      // Must be one of the first four that get displayed
      this.chosenNum = Math.floor(Math.random() * 4);
      // this.shuffledFaces[chosenNum] = 
  }

  score : number = 0;
  progress : number = 0; 
  chosenNum : number = 0;
  
  shuffledFaces : any[] = [];
  leftovers : any[] = [];

  nextFaceSet(input : number) {
      this.progress++;
      // determine if correct or not
      if (input == this.chosenNum) {
        this.score++;
	  }
      // else nothing
      
	  // dump old images, and repeat initalization process
      for (let i = 0; i < this.facePaths.length; i++) {
        this.shuffledFaces.splice(i, 1);
      }
      
      this.ngOnInit();
      
  }
}
