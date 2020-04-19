import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-score-page',
  templateUrl: './score-page.component.html',
  styleUrls: ['./score-page.component.scss'],
})
export class ScorePageComponent implements OnInit {
  @Input() score : number;
  @Input() length : number;
  @Input() assessment : boolean;
  @Output() finished = new EventEmitter<number>();

  constructor() { }

  ngOnInit() { }

  minTrainScore : number = 0.75; // Should be equal to minTrainScore in training
  replay_icon : string = "assets/icon/replay.svg";
  face_icon : string = "assets/icon/face.svg";

  failed() {
    return this.score < this.length * this.minTrainScore && !this.assessment
  }
}
