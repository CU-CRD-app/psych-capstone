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

  constructor() { }

  ngOnInit() {
	  // start by shuffling three faces from basic set
	  this.currentFace = this.facePaths[this.progress];
	  
	  // then draw one from new set
	  ;
	  
	  // lump all faces into new set, then shuffle them
	  ;
  }

  score : number = 0;
  currentFace : string;
  progress : number = 0;
  correct_count: number = 0;

}
