import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-score-page',
  templateUrl: './score-page.component.html',
  styleUrls: ['./score-page.component.scss'],
})
export class ScorePageComponent implements OnInit {
  @Input() score : number;
  @Input() assessment : boolean;
  @Output() finished = new EventEmitter<number>();

  constructor() { }

  ngOnInit() { }

  replay_icon : string = "assets/icon/replay.svg";
  face_icon : string = "assets/icon/face.svg";
}
