import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Events } from '@ionic/angular';
import { GetProgressService } from '../service/get-progress.service';

enum Task { FORCED_CHOICE, SAME_DIFFERENT }

@Component({
  selector: 'app-pre-post-assessment',
  templateUrl: './pre-post-assessment.component.html',
  styleUrls: ['./pre-post-assessment.component.scss'],
})
export class PrePostAssessmentComponent implements OnInit {
  @Input() facePaths : string[];
  @Input() preTest : boolean;
	@Output() finished = new EventEmitter<void>();

  constructor(public getProgress: GetProgressService, public events: Events) { }

  ngOnInit() {
    this.scores = [-1, -1];
    this.task = Task.FORCED_CHOICE;
  }

  Task = Task;
  scores : number[];
  task : Task;

  taskDone(score : number[], task : number) {
    this.scores[task] = Math.max(score[0], this.scores[task]);
    if (this.task == Task.FORCED_CHOICE) {
      this.task = Task.SAME_DIFFERENT;
    } else {
      // save the scores to database
      if (this.preTest) {
        this.getProgress.updateProgress(1);
      } else {
        this.getProgress.updateProgress(10);
      }
      this.finished.emit();
    }
  }

}
