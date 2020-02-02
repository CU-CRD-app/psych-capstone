import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-learning-task',
  templateUrl: './learning-task.component.html',
  styleUrls: ['./learning-task.component.scss'],
})
export class LearningTaskComponent implements OnInit {
  @Input() setNames : string;
  @Output() finished = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {
    this.currentName = this.setNames[this.progress];
  }

  progress : number = 0;

  currentFace : string = `../../assets/sample-faces/${this.progress}.png`;
  currentName : string;

  changeCard(direction : string) {
    if (direction == 'next') {
      this.progress++;
    } else {
      this.progress--;
    }
    this.currentFace = `../../assets/sample-faces/${this.progress}.png`;
    this.currentName = this.setNames[this.progress];
  }

}
