import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-learning-task',
  templateUrl: './learning-task.component.html',
  styleUrls: ['./learning-task.component.scss'],
})
export class LearningTaskComponent implements OnInit {
  @Input() setNames : string;
  @Input() facePaths : string[];
  @Output() finished = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  progress : number = 0;
  progressPercent : number = 0;
  seenAll : boolean = false;

  changeCard(direction : string) {
    if (direction == 'next') {
      this.progress++;
    } else {
      this.progress--;
    }
    if (!this.seenAll) {
      this.progressPercent = this.progress/(this.facePaths.length - 1);
    }
    if (this.progress == 7) {
      this.seenAll = true;
    }
  }

}
