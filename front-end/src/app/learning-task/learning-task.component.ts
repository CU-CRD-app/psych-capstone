import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-learning-task',
  templateUrl: './learning-task.component.html',
  styleUrls: ['./learning-task.component.scss'],
})
export class LearningTaskComponent implements OnInit {
  @Output() finished = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

  progress : number = 0;

  currentFace : string = "../../assets/sample-faces/0.png";
  currentName : string = "Sam";

  changeCard(direction : string) {
    if (direction == 'next') {
      this.progress++;
    } else {
      this.progress--;
    }
    //this.currentName change
    //this.curretnFace change
  }

}
