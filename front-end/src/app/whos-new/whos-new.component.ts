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

  ngOnInit() {
	  // start by shuffling three faces from basic set 
	  for (let i = 0; i < this.facePaths.length; i++) {
        this.shuffledFaces.push(this.facePaths[i]);
      }
	  
	  // then draw one from new set
	  this.shuffledFaces.push(this.facePaths);
  }

  score : number = 0;
  progress : number = 0; 
  
  shuffledFaces : any[] = [];

  nextFaceSet() {
	  this.progress++;
	  
	  // dump old images, and repeat initalization process
	  for (let i = 0; i < 4; i++) {
        this.shuffledFaces.splice(i, 1);
      }
	  
	  this.ngOnInit(); 
  }
}
